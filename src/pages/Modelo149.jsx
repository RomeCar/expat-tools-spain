import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { calculateDeadline } from '../config/modelo149';
import { Link } from 'react-router-dom';
import Modelo149Form from '../components/modelo149/Modelo149Form';
import { CheckCircle, XCircle, AlertTriangle, Clock, FileText, Shield, ExternalLink, ChevronRight, List, Info } from 'lucide-react';

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
          <span>{item}</span>
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

export default function Modelo149() {
  const { t, language } = useLanguage();
  const m = t('modelo149');
  const g = m.guide;

  // Eligibility checker state
  const [eligibility, setEligibility] = useState([null, null, null, null]);
  const updateEligibility = (idx, val) => {
    const next = [...eligibility];
    next[idx] = val;
    setEligibility(next);
  };
  const allAnswered = eligibility.every(v => v !== null);
  const allYes = eligibility.every(v => v === true);
  const anyNo = eligibility.some(v => v === false);

  // Deadline calculator state
  const [ssDate, setSsDate] = useState('');
  const deadlineResult = calculateDeadline(ssDate);

  const tocSections = [
    { id: 'what-is', label: g.whatIs.title },
    { id: 'eligibility', label: g.eligibility.title },
    { id: 'deadline', label: g.deadline.title },
    { id: 'documents', label: g.documents.title },
    { id: 'how-to-submit', label: g.howToSubmit.title },
    { id: 'mistakes', label: g.mistakes.title },
    { id: 'after-approval', label: g.afterApproval.title },
    { id: 'form', label: m.form.title },
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <Link to="/" style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)', display: 'inline-block', marginBottom: '1.5rem' }}>
          &larr; {t('common.back')}
        </Link>
        <h1 style={{ fontSize: '2.75rem', lineHeight: 1.2 }}>
          {m.pageTitle} <br /><span className="gradient-text">{m.pageHighlight}</span>
        </h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>{m.pageSubtitle}</p>
        <div style={{ display: 'inline-block', marginTop: '0.75rem', padding: '0.5rem 1rem', background: 'var(--bg-tertiary)', borderRadius: '0.5rem', fontSize: '0.875rem', color: 'var(--success)', fontWeight: '600' }}>
          <Shield size={16} style={{ marginRight: '0.35rem', verticalAlign: 'middle' }} />
          {m.savingsNote}
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
        {/* 1. What is the Beckham Law */}
        <Section id="what-is" icon={Info} title={g.whatIs.title}>
          <P>{g.whatIs.p1}</P>
          <P>{g.whatIs.p2}</P>
          <P>{g.whatIs.p3}</P>
        </Section>

        {/* 2. Eligibility Checker */}
        <Section id="eligibility" icon={CheckCircle} title={g.eligibility.title}>
          <P>{g.eligibility.subtitle}</P>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
            {[g.eligibility.q1, g.eligibility.q2, g.eligibility.q3, g.eligibility.q4].map((q, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'var(--bg-tertiary)', borderRadius: '0.5rem', borderLeft: `3px solid ${eligibility[i] === true ? 'var(--success)' : eligibility[i] === false ? 'var(--danger)' : 'var(--border-color)'}` }}>
                <span style={{ flex: 1, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{q}</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => updateEligibility(i, true)} style={{ padding: '0.35rem 0.75rem', borderRadius: '0.375rem', border: `1px solid ${eligibility[i] === true ? 'var(--success)' : 'var(--border-color)'}`, background: eligibility[i] === true ? 'var(--success)' : 'transparent', color: eligibility[i] === true ? 'white' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '500' }}>
                    {t('common.yes')}
                  </button>
                  <button onClick={() => updateEligibility(i, false)} style={{ padding: '0.35rem 0.75rem', borderRadius: '0.375rem', border: `1px solid ${eligibility[i] === false ? 'var(--danger)' : 'var(--border-color)'}`, background: eligibility[i] === false ? 'var(--danger)' : 'transparent', color: eligibility[i] === false ? 'white' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '500' }}>
                    {t('common.no')}
                  </button>
                </div>
              </div>
            ))}
          </div>
          {allAnswered && (
            <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '0.5rem', background: allYes ? 'rgba(16, 185, 129, 0.1)' : anyNo ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-tertiary)', border: `1px solid ${allYes ? 'var(--success)' : 'var(--danger)'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', color: allYes ? 'var(--success)' : 'var(--danger)' }}>
                {allYes ? <CheckCircle size={20} /> : <XCircle size={20} />}
                {allYes ? g.eligibility.resultYes : g.eligibility.resultNo}
              </div>
            </div>
          )}
        </Section>

        {/* 3. Deadline */}
        <Section id="deadline" icon={Clock} title={g.deadline.title}>
          <P>{g.deadline.p1}</P>
          <div style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: '0.75rem', marginTop: '1rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
              {g.deadline.calculator}
            </label>
            <input type="date" value={ssDate} onChange={e => setSsDate(e.target.value)} className="input-field" style={{ maxWidth: '250px', padding: '0.5rem' }} />
            {deadlineResult && (
              <div style={{ marginTop: '0.75rem', padding: '0.75rem', borderRadius: '0.5rem', background: deadlineResult.isExpired ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', border: `1px solid ${deadlineResult.isExpired ? 'var(--danger)' : 'var(--success)'}` }}>
                {deadlineResult.isExpired ? (
                  <span style={{ color: 'var(--danger)', fontWeight: '700' }}>
                    <AlertTriangle size={16} style={{ verticalAlign: 'middle', marginRight: '0.35rem' }} />
                    {g.deadline.expired}
                  </span>
                ) : (
                  <span style={{ color: 'var(--success)', fontWeight: '600' }}>
                    {g.deadline.deadlineDate}: <strong>{deadlineResult.deadline.toLocaleDateString()}</strong> &mdash; {deadlineResult.daysLeft} {g.deadline.daysLeft}
                  </span>
                )}
              </div>
            )}
          </div>
        </Section>

        {/* 4. Documents */}
        <Section id="documents" icon={FileText} title={g.documents.title}>
          <P>{g.documents.p1}</P>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', marginTop: '1rem' }}>{g.documents.allTitle}</h3>
          <Checklist items={[g.documents.all1, g.documents.all2, g.documents.all3, g.documents.all4]} />
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', marginTop: '1rem' }}>{g.documents.employmentTitle}</h3>
          <Checklist items={[g.documents.employment1, g.documents.employment2]} />
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', marginTop: '1rem' }}>{g.documents.directorTitle}</h3>
          <Checklist items={[g.documents.director1, g.documents.director2, g.documents.director3]} />
        </Section>

        {/* 5. How to Submit */}
        <Section id="how-to-submit" icon={ExternalLink} title={g.howToSubmit.title}>
          <StepList items={[g.howToSubmit.step1, g.howToSubmit.step2, g.howToSubmit.step3, g.howToSubmit.step4, g.howToSubmit.step5, g.howToSubmit.step6]} />
          <a href="https://sede.agenciatributaria.gob.es/Sede/procedimientoini/G606.shtml" target="_blank" rel="noreferrer" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
            {language === 'en' ? 'Go to AEAT Sede Electronica' : 'Ir a Sede Electronica AEAT'} <ExternalLink size={16} />
          </a>
        </Section>

        {/* 6. Common Mistakes */}
        <Section id="mistakes" icon={AlertTriangle} title={g.mistakes.title}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {[g.mistakes.m1, g.mistakes.m2, g.mistakes.m3, g.mistakes.m4, g.mistakes.m5, g.mistakes.m6, g.mistakes.m7].map((m, i) => (
              <li key={i} style={{ marginBottom: '0.6rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start', color: 'var(--text-secondary)' }}>
                <XCircle size={16} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: '0.2rem' }} />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* 7. After Approval */}
        <Section id="after-approval" icon={Shield} title={g.afterApproval.title}>
          <P>{g.afterApproval.p1}</P>
          <Checklist items={[g.afterApproval.a1, g.afterApproval.a2, g.afterApproval.a3, g.afterApproval.a4, g.afterApproval.a5]} />
        </Section>
      </div>

      {/* Form Wizard */}
      <div id="form" style={{ scrollMarginTop: '2rem' }}>
        <Modelo149Form />
      </div>
    </div>
  );
}
