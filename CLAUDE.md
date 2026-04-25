# Project notes for Claude

## What this project is

**ExpatGestor** (also "Expat Tools Spain") — a free, browser-only suite of tools for expats living in Spain. Live at <https://expatgestor.es>. The owner is building it as he encounters Spanish-bureaucracy problems himself, so the roadmap is opportunistic, not pre-planned.

### Audience
- Primary: English-speaking expats trying to navigate Spanish bureaucracy with Google Translate.
- Secondary: Spanish speakers — both natives and Latin American expats. The site is fully bilingual.
- Future possibility: per-country / per-region specifics (e.g. tailored guides for American vs European expats).

### What's shipped
- **Nomina Generator** — official payslips for empleadas de hogar with 2026 SS rates baked in
- **Hiring Guide** — end-to-end guide to legally hiring a domestic worker, including the arraigo (residency) sequence
- **Modelo 149 Generator** — Beckham Law application prep
- **Baja Médica + C-133** — what to do when your domestic worker goes on medical leave, plus the employer certificate

### Pillars
- **Free + private.** Everything runs in the browser; no data leaves the user's machine. Important enough that it's surfaced on the landing page and in card subtitles.
- **Replaces gestorías** for routine bureaucracy. The copy is openly opinionated about it ("Gestorías charge 500-1500 EUR for this. Do it yourself for free.")
- **Plain-English explanations** of why each step matters, not just "fill this form."

### Long game
Currently a personal tool the owner shares. If traction shows up, monetisation may come later. Don't pre-engineer for monetisation — build for usefulness.

## Editorial voice

Matter-of-fact, lightly opinionated, "do this, not that." Concrete numbers wherever possible (e.g. worked example: "8h/week worker, full month baja → ~30.60 EUR out-of-pocket"). Don't drift into corporate / disclaimer-heavy / hedging language.

**Disclaimers only where stakes are high** (e.g. arraigo guidance — undocumented immigration is legally precarious). Routine "fill out this form" guides don't need a "this is not legal advice" footer; that just adds friction.

## Workflow

### You can merge directly
- You may merge PRs on this repo (RomeCar/expat-tools-spain) **without waiting for me**, once verification passes.
- Always open a PR (`gh pr create`) — never push to `master` directly.
- **Merge style: `gh pr merge --squash --delete-branch`.** Keeps master's history one clean commit per feature.
- One PR per logical change. Don't bundle unrelated fixes.

### Verification before every merge
There's no `test` script — the project uses **`npm run lint && npm run build`** as the test suite. Both must succeed locally before merging. CI ([.github/workflows/ci.yml](.github/workflows/ci.yml)) runs the same on every PR and shows the green checkmark on GitHub.

For browser verification of UI changes, use the Preview tool (`preview_start dev`). On Apple Silicon, if the dev server crashes with a rolldown native-binding error, run once: `npm install --no-save @rolldown/binding-darwin-arm64`. (One-time fix for an `npm` optional-deps bug.)

### Pre-existing lint errors
As of 2026-04-25, `npm run lint` reports 3 errors that predate this work:
- `src/context/{LanguageContext,ThemeContext}.jsx` — `react-refresh/only-export-components` (harmless fast-refresh warnings)
- `src/utils/nominaPdfBuilder.js` — unused `t` parameter

(PR #3 cleaned up the 5 `react-hooks/static-components` errors in `Modelo149Form.jsx`.)

CI is configured with `continue-on-error: true` on the lint step until these are zero. **Rule: PRs add zero new errors.** Fix them opportunistically in dedicated PRs; don't bundle with feature work. Once the count is zero, remove `continue-on-error` from `.github/workflows/ci.yml` so future regressions block merges.

## React focus bug pattern (important)

Inputs lose focus after every keystroke when helper components or step renderers are defined **inside** a parent component function. Each render produces new function references → React unmounts/remounts the input subtree → focus dies. ESLint catches this as `react-hooks/static-components`.

**Always:**
- Define `Field`, `RadioOption`, and any other helper components at module level (top of file, outside the parent function).
- Inline step JSX directly in the parent's `return` (don't render `<Step1 />` for components defined in the same function).
- Pass callbacks like `onSelect={(v) => update('field', v)}` instead of closing over `update` from the parent scope.

Reference implementation: [src/components/bajaMedica/C133Form.jsx](src/components/bajaMedica/C133Form.jsx). Modelo149Form has the same bug pending a fix.

## Project structure

- React 19 + Vite + react-router. No SSR, no build-time data fetching.
- Routes live in [src/App.jsx](src/App.jsx).
- Each tool/guide is one page in [src/pages/](src/pages/) plus a folder of components in [src/components/](src/components/).
- All copy is i18n (EN/ES) in [src/i18n/en.json](src/i18n/en.json) and [src/i18n/es.json](src/i18n/es.json) — keep both in sync. The translator is `t('a.b.c')` from `useLanguage()`.
- Landing page card grid is in [src/pages/LandingPage.jsx](src/pages/LandingPage.jsx); also bump `landing.modulesCount` in both i18n files when adding a card.

### Regulations live in one place
2026 Social Security data (rates, tramos, SMI) is centralized in [src/config/regulations.js](src/config/regulations.js). **Reuse it. Never duplicate.**

When external regulations change (BOE updates, mid-year SMI bump, contribution rate adjustment):
1. Update the values in `regulations.js`.
2. Bump `lastVerified` to the date you verified against the source.
3. Call out the change in the PR description with the BOE link / reference.
4. Surface the updated date on relevant guides so users know the data is fresh.

## Diacritics / accents in copy

The existing i18n files use ASCII-transliterated Spanish ("Espana", "comun", "habitacion") — not by intent on the user's part, but because **jsPDF's default Helvetica font does not render diacritics correctly** in PDFs. Boxes or `?` appear instead.

**Going forward:**
- **HTML / JSX copy in i18n JSON files: use proper diacritics** (España, común, habitación). Browsers render UTF-8 fine.
- **Strings passed into PDF builders ([src/utils/*PdfBuilder.js](src/utils/)): keep ASCII-transliterated** OR embed a Unicode-capable font via `jsPDF.addFont()`.

A backfill PR to fix all the existing JSON copy is pending. Don't introduce new ASCII transliterations in new HTML copy.

## House style

- No tests are added (no test framework is set up). If a behaviour is critical, verify in the browser preview.
- Prefer the shared CSS classes from [src/index.css](src/index.css): `glass-card`, `btn-primary`, `btn-secondary`, `input-field`, `gradient-text`. Don't reinvent these inline.
- Brand: **"ExpatGestor"** as the primary mark, with **"Expat Tools Spain"** as a tagline / subtitle / repository name (legacy).
- Don't add new dependencies without flagging in the PR description — the bundle is already 400+ KB gzipped and we want to keep it lean.
