import { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import C133Form from '../components/bajaMedica/C133Form';
import { findTramo, REGULATIONS_2026 } from '../config/regulations';
import { formatCurrency } from '../utils/formatters';
import { CheckCircle, AlertTriangle, FileText, Info, ExternalLink, ChevronRight, List, Stethoscope, Calendar, Coins, Calculator, Send } from 'lucide-react';

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

// `P` renders the children as HTML so i18n strings can use inline tags like
// <strong>...</strong> for key document names (C-133, parte de baja, etc.).
// Safe here because all content comes from our own i18n JSON, not user input.
function P({ children }) {
  if (typeof children === 'string') {
    return <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: children }} />;
  }
  return <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: 1.7 }}>{children}</p>;
}

const PHtml = ({ html }) => <P>{html}</P>;

// Mini-calculator for the IT cash flow during baja (days 4-8 employer / 9-20 INSS / 21+ INSS).
// Inputs: monthly gross salary OR hours/week + hourly rate. Output: who pays what.
function BajaCalculator() {
  const { t } = useLanguage();
  const c = t('bajaMedica.guide.calculator');
  const [mode, setMode] = useState('salary'); // 'salary' or 'hours'
  const [monthlySalary, setMonthlySalary] = useState('331');
  const [hoursPerWeek, setHoursPerWeek] = useState('8');
  const [hourlyRate, setHourlyRate] = useState(REGULATIONS_2026.smi.hourly.toString());

  const computed = useMemo(() => {
    const salary = mode === 'salary'
      ? parseFloat(monthlySalary) || 0
      : (parseFloat(hoursPerWeek) || 0) * 4.33 * (parseFloat(hourlyRate) || 0);
    if (salary <= 0) return null;
    const tramo = findTramo(salary);
    const baseDiaria = tramo.base / 30;
    const employer48 = 5 * 0.60 * baseDiaria;       // days 4-8: employer 60%
    const inss920 = 12 * 0.60 * baseDiaria;          // days 9-20: INSS 60%
    const inss2130 = 10 * 0.75 * baseDiaria;         // days 21-30: INSS 75%
    return { salary, tramo, baseDiaria, employer48, inss920, inss2130, totalIfFullMonth: employer48 + inss920 + inss2130 };
  }, [mode, monthlySalary, hoursPerWeek, hourlyRate]);

  const inputStyle = { padding: '0.5rem', fontSize: '0.875rem' };
  const labelStyle = { fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' };

  return (
    <div className="glass-card" style={{ padding: '1.25rem 1.5rem', marginTop: '1rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <Calculator size={18} style={{ color: 'var(--accent-primary)' }} />
        <h3 style={{ margin: 0, fontSize: '1.05rem' }}>{c.title}</h3>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.5 }}>{c.intro}</p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button
          onClick={() => setMode('salary')}
          className={mode === 'salary' ? 'btn-primary' : 'btn-secondary'}
          style={{ flex: 1, padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
        >
          {c.tabSalary}
        </button>
        <button
          onClick={() => setMode('hours')}
          className={mode === 'hours' ? 'btn-primary' : 'btn-secondary'}
          style={{ flex: 1, padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
        >
          {c.tabHours}
        </button>
      </div>

      {mode === 'salary' ? (
        <div>
          <label style={labelStyle}>{c.monthlySalary}</label>
          <input type="number" className="input-field" style={inputStyle} value={monthlySalary} onChange={e => setMonthlySalary(e.target.value)} placeholder="331" />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label style={labelStyle}>{c.hoursPerWeek}</label>
            <input type="number" className="input-field" style={inputStyle} value={hoursPerWeek} onChange={e => setHoursPerWeek(e.target.value)} placeholder="8" />
          </div>
          <div>
            <label style={labelStyle}>{c.hourlyRate}</label>
            <input type="number" step="0.01" className="input-field" style={inputStyle} value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} placeholder="9.55" />
          </div>
        </div>
      )}

      {computed && (
        <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'var(--bg-tertiary)', borderRadius: '0.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.4rem 1rem', fontSize: '0.875rem' }}>
            {mode === 'hours' && (
              <>
                <span style={{ color: 'var(--text-secondary)' }}>{c.computedSalary}</span>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{formatCurrency(computed.salary)}</span>
              </>
            )}
            <span style={{ color: 'var(--text-secondary)' }}>{c.tramoLabel}</span>
            <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Tramo {computed.tramo.tramo} ({formatCurrency(computed.tramo.base)})</span>
            <span style={{ color: 'var(--text-secondary)' }}>{c.baseDiaria}</span>
            <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{formatCurrency(computed.baseDiaria)}</span>
          </div>

          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.4rem 1rem', fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--danger)', fontWeight: '600' }}>{c.youPay}</span>
            <span style={{ fontWeight: '700', color: 'var(--danger)' }}>{formatCurrency(computed.employer48)}</span>
            <span style={{ color: 'var(--text-tertiary)' }}>{c.inss920}</span>
            <span style={{ color: 'var(--text-tertiary)' }}>{formatCurrency(computed.inss920)}</span>
            <span style={{ color: 'var(--text-tertiary)' }}>{c.inss2130}</span>
            <span style={{ color: 'var(--text-tertiary)' }}>{formatCurrency(computed.inss2130)}</span>
          </div>

          <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: 'rgba(239, 68, 68, 0.08)', borderRadius: '0.375rem', fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
            <strong>{c.summaryLabel}</strong> {c.summary.replace('{amount}', formatCurrency(computed.employer48))}
          </div>
        </div>
      )}
    </div>
  );
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
    { id: 'submit', label: g.submit.title },
    { id: 'example', label: g.example.title },
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
          <PHtml html={g.whoPays.p1} />
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

        <Section id="submit" icon={Send} title={g.submit.title}>
          <P>{g.submit.intro}</P>

          <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '1rem 1.25rem', borderRadius: '0.5rem', borderLeft: '4px solid var(--success)', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', marginTop: 0, marginBottom: '0.5rem', color: 'var(--success)' }}>{g.submit.optionA.title}</h3>
            <P>{g.submit.optionA.p1}</P>
            <StepList items={[g.submit.optionA.s1, g.submit.optionA.s2, g.submit.optionA.s3, g.submit.optionA.s4]} />
          </div>

          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{g.submit.optionB.title}</h3>
          <P>{g.submit.optionB.p1}</P>
          <StepList items={[g.submit.optionB.s1, g.submit.optionB.s2, g.submit.optionB.s3, g.submit.optionB.s4, g.submit.optionB.s5, g.submit.optionB.s6]} />
          <a href="https://sede.seg-social.gob.es" target="_blank" rel="noreferrer" className="btn-primary" style={{ marginTop: '0.5rem', display: 'inline-flex' }}>
            {g.submit.openSede} <ExternalLink size={16} />
          </a>

          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', marginTop: '1.5rem' }}>{g.submit.optionC.title}</h3>
          <P>{g.submit.optionC.p1}</P>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0.5rem 0', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <li>&bull; <a href="https://run.gob.es/tramites" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)' }}>run.gob.es/tramites</a> — {g.submit.optionC.run}</li>
            <li>&bull; {g.submit.optionC.mail}</li>
            <li>&bull; {g.submit.optionC.inPerson}</li>
          </ul>
        </Section>

        <Section id="example" icon={Calculator} title={g.example.title}>
          <BajaCalculator />
          <P>{g.example.intro}</P>
          <div style={{ background: 'var(--bg-tertiary)', padding: '1rem 1.25rem', borderRadius: '0.5rem', marginBottom: '0.75rem' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {[g.example.row1, g.example.row2, g.example.row3].map((row, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: row }} />
              ))}
            </ul>
          </div>
          <div style={{ marginTop: '0.75rem', fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.95rem' }}>{g.example.split}</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0.5rem 0 0.75rem 0', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {[g.example.d1, g.example.d2, g.example.d3, g.example.d4].map((row, i) => (
              <li key={i} style={{ paddingLeft: '0.75rem', borderLeft: '3px solid var(--border-color)' }} dangerouslySetInnerHTML={{ __html: row }} />
            ))}
          </ul>
          <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '1rem', borderRadius: '0.5rem', borderLeft: '4px solid var(--success)', marginTop: '0.75rem' }}>
            <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }} dangerouslySetInnerHTML={{ __html: g.example.summary }} />
          </div>
          <P>&nbsp;</P>
          <PHtml html={g.example.note} />
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
