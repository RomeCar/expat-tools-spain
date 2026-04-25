import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import C133Form from '../components/bajaMedica/C133Form';
import { CheckCircle, AlertTriangle, FileText, Info, ExternalLink, ChevronRight, List, Stethoscope, Calendar, Coins } from 'lucide-react';

function Section({ id, icon: Icon, title, children }) {
  return (
    <section id={id} style={{ marginBottom: '2.5rem', scrollMarginTop: '2rem' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '1.5rem' }}>
        {Icon && <Icon size={22} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />}
        {title}
      </h2>
      {children}
    </section>
  );
}

function Checklist({ items }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: '0.75rem 0' }}>
      {items.map((item, i) => (
        <li key={i} style={{ marginBottom: '0.6rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start', color: 'var(--text-secondary)' }}>
          <CheckCircle size={16} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '0.2rem' }} />
          <span dangerouslySetInnerHTML={{ __html: item }} />
        </li>
      ))}
    </ul>
  );
}

function StepList({ items }) {
  return (
    <ol style={{ paddingLeft: '1.25rem', margin: '0.75rem 0', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
      {items.map((item, i) => <li key={i} style={{ marginBottom: '0.35rem' }} dangerouslySetInnerHTML={{ __html: item }} />)}
    </ol>
  );
}

function P({ children }) {
  return <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: 1.7 }}>{children}</p>;
}

export default function BajaMedica() {
  const { t, language } = useLanguage();
  const b = t('bajaMedica');
  const g = b.guide;
  const f = b.form;

  const tocSections = [
    { id: 'what-is', label: g.whatIs.title },
    { id: 'who-pays', label: g.whoPays.title },
    { id: 'employer-steps', label: g.employerSteps.title },
    { id: 'worker-steps', label: g.workerSteps.title },
    { id: 'documents', label: g.documents.title },
    { id: 'after', label: g.after.title },
    { id: 'mistakes', label: g.mistakes.title },
    { id: 'form', label: f.title },
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <Link to="/" style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)', display: 'inline-block', marginBottom: '1.5rem' }}>
          &larr; {t('common.back')}
        </Link>
        <h1 style={{ fontSize: '2.75rem', lineHeight: 1.2 }}>
          {b.pageTitle} <br /><span className="gradient-text">{b.pageHighlight}</span>
        </h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>{b.pageSubtitle}</p>
        <div style={{ display: 'inline-block', marginTop: '0.75rem', padding: '0.5rem 1rem', background: 'var(--bg-tertiary)', borderRadius: '0.5rem', fontSize: '0.875rem', color: 'var(--success)', fontWeight: '600' }}>
          <FileText size={16} style={{ marginRight: '0.35rem', verticalAlign: 'middle' }} />
          {b.formNote}
        </div>
      </div>

      {/* TOC */}
      <div className="glass-card" style={{ marginBottom: '2.5rem', padding: '1.25rem 1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '1.1rem' }}>
          <List size={18} style={{ color: 'var(--accent-primary)' }} /> {language === 'en' ? 'Contents' : 'Contenido'}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem 1.5rem' }}>
          {tocSections.map((sec, i) => (
            <a key={sec.id} href={`#${sec.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.875rem', color: 'var(--text-secondary)', padding: '0.25rem 0' }}>
              <ChevronRight size={14} style={{ color: 'var(--accent-primary)' }} />
              <span>{i + 1}. {sec.label}</span>
            </a>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 0.5rem' }}>
        <Section id="what-is" icon={Stethoscope} title={g.whatIs.title}>
          <P>{g.whatIs.p1}</P>
          <P>{g.whatIs.p2}</P>
          <div style={{ background: 'rgba(37, 99, 235, 0.08)', padding: '1rem', borderRadius: '0.5rem', borderLeft: '4px solid var(--accent-primary)' }}>
            <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>{g.whatIs.p3}</p>
          </div>
        </Section>

        <Section id="who-pays" icon={Coins} title={g.whoPays.title}>
          <P>{g.whoPays.p1}</P>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            <thead>
              <tr>
                <th style={{ background: 'var(--bg-tertiary)', padding: '0.5rem 0.75rem', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid var(--border-color)', color: 'var(--text-primary)' }}>{g.whoPays.colDays}</th>
                <th style={{ background: 'var(--bg-tertiary)', padding: '0.5rem 0.75rem', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid var(--border-color)', color: 'var(--text-primary)' }}>{g.whoPays.colWho}</th>
                <th style={{ background: 'var(--bg-tertiary)', padding: '0.5rem 0.75rem', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid var(--border-color)', color: 'var(--text-primary)' }}>{g.whoPays.colAmount}</th>
              </tr>
            </thead>
            <tbody>
              {[g.whoPays.row1, g.whoPays.row2, g.whoPays.row3, g.whoPays.row4].map((row, i) => (
                <tr key={i}>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>{row.days}</td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>{row.who}</td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>{row.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <P>{g.whoPays.note}</P>
          <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem 1rem', borderRadius: '0.5rem', borderLeft: '4px solid var(--warning)', marginTop: '0.5rem' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>{g.whoPays.continueSs}</p>
          </div>
        </Section>

        <Section id="employer-steps" icon={Calendar} title={g.employerSteps.title}>
          <P>{g.employerSteps.intro}</P>
          <StepList items={[g.employerSteps.s1, g.employerSteps.s2, g.employerSteps.s3, g.employerSteps.s4, g.employerSteps.s5]} />
        </Section>

        <Section id="worker-steps" icon={Calendar} title={g.workerSteps.title}>
          <P>{g.workerSteps.intro}</P>
          <StepList items={[g.workerSteps.s1, g.workerSteps.s2, g.workerSteps.s3, g.workerSteps.s4]} />
          <a href="https://sede.seg-social.gob.es" target="_blank" rel="noreferrer" className="btn-primary" style={{ marginTop: '0.5rem', display: 'inline-flex' }}>
            {g.workerSteps.cta} <ExternalLink size={16} />
          </a>
        </Section>

        <Section id="documents" icon={FileText} title={g.documents.title}>
          <P>{g.documents.intro}</P>
          <Checklist items={[g.documents.d1, g.documents.d2, g.documents.d3, g.documents.d4]} />
        </Section>

        <Section id="after" icon={Info} title={g.after.title}>
          <P>{g.after.p1}</P>
          <Checklist items={[g.after.a1, g.after.a2, g.after.a3]} />
        </Section>

        <Section id="mistakes" icon={AlertTriangle} title={g.mistakes.title}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {[g.mistakes.m1, g.mistakes.m2, g.mistakes.m3, g.mistakes.m4].map((m, i) => (
              <li key={i} style={{ marginBottom: '0.6rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start', color: 'var(--text-secondary)' }}>
                <AlertTriangle size={16} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: '0.2rem' }} />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <div id="form" style={{ scrollMarginTop: '2rem' }}>
        <C133Form />
      </div>
    </div>
  );
}
