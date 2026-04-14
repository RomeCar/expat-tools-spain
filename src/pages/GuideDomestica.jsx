import { useLanguage } from '../context/LanguageContext';
import { REGULATIONS_2026 } from '../config/regulations';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { Link } from 'react-router-dom';
import { BookOpen, ExternalLink, FileText, CheckCircle, Info, AlertTriangle, List, ChevronRight } from 'lucide-react';

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

export default function GuideDomestica() {
  const { t } = useLanguage();
  const g = t('guide');
  const s = g.sections;
  const R = REGULATIONS_2026;

  const tocSections = [
    { id: 'who-needs', label: s.whoNeeds.title },
    { id: 'arraigo', label: s.arraigo.title },
    { id: 'documentation', label: s.documentation.title },
    { id: 'ccc', label: s.ccc.title },
    { id: 'contract', label: s.contract.title },
    { id: 'registration', label: s.registration.title },
    { id: 'base-cotizacion', label: s.baseCotizacion.title },
    { id: 'monthly', label: s.monthly.title },
    { id: 'vacation', label: s.vacation.title },
    { id: 'termination', label: s.termination.title },
    { id: 'rates', label: s.rates.title },
    { id: 'resources', label: s.resources.title },
  ];

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '1rem',
    fontSize: '0.875rem',
  };
  const thStyle = {
    background: 'var(--bg-tertiary)',
    padding: '0.5rem 0.75rem',
    textAlign: 'left',
    fontWeight: '600',
    borderBottom: '2px solid var(--border-color)',
    color: 'var(--text-primary)',
  };
  const tdStyle = {
    padding: '0.5rem 0.75rem',
    borderBottom: '1px solid var(--border-color)',
    color: 'var(--text-secondary)',
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <Link to="/" style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)', display: 'inline-block', marginBottom: '1.5rem' }}>
          &larr; {t('common.back')}
        </Link>
        <h1 style={{ fontSize: '2.75rem', lineHeight: 1.2 }}>
          {g.title} <br /><span className="gradient-text">{g.titleHighlight}</span>
        </h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>{g.subtitle}</p>
      </div>

      {/* Quick Summary */}
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Info size={22} style={{ color: 'var(--accent-primary)' }} />
          {g.summary.title}
        </h2>
        <Checklist items={[g.summary.smi, g.summary.bonuses, g.summary.desempleo, g.summary.digital]} />
      </div>

      {/* Table of Contents */}
      <div className="glass-card" style={{ marginBottom: '2.5rem', padding: '1.25rem 1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '1.1rem' }}>
          <List size={18} style={{ color: 'var(--accent-primary)' }} /> {g.toc}
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

      {/* Content Sections */}
      <div style={{ padding: '0 0.5rem' }}>

        {/* 1. Who Needs This */}
        <Section id="who-needs" icon={AlertTriangle} title={s.whoNeeds.title}>
          <P>{s.whoNeeds.p1}</P>
          <P>{s.whoNeeds.p2}</P>
          <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '0.5rem', borderLeft: '4px solid var(--danger)' }}>
            <p style={{ color: 'var(--danger)', fontWeight: '600', fontSize: '0.875rem' }}>{s.whoNeeds.p3}</p>
          </div>
        </Section>

        {/* 2. Arraigo / Pending Residency */}
        <Section id="arraigo" icon={AlertTriangle} title={s.arraigo.title}>
          <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '0.5rem', borderLeft: '4px solid var(--accent-primary)', marginBottom: '1rem' }}>
            <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{s.arraigo.intro}</p>
          </div>

          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', marginTop: '1rem' }}>{s.arraigo.whatIsTitle}</h3>
          <P>{s.arraigo.whatIs}</P>

          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', marginTop: '1.25rem' }}>{s.arraigo.sequenceTitle}</h3>
          <P>{s.arraigo.sequenceIntro}</P>
          <StepList items={[s.arraigo.step1, s.arraigo.step2, s.arraigo.step3, s.arraigo.step4, s.arraigo.step5]} />

          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', marginTop: '1.25rem' }}>{s.arraigo.multiEmployerTitle}</h3>
          <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '1rem', borderRadius: '0.5rem', borderLeft: '4px solid var(--success)', marginBottom: '1rem' }}>
            <P>{s.arraigo.multiEmployerP1}</P>
            <P>{s.arraigo.multiEmployerP2}</P>
            <P>{s.arraigo.multiEmployerP3}</P>
            <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '0.375rem', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{s.arraigo.multiEmployerExample}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
                <div>&bull; {s.arraigo.exampleRow1}</div>
                <div>&bull; {s.arraigo.exampleRow2}</div>
                <div>&bull; {s.arraigo.exampleRow3}</div>
                <div style={{ marginTop: '0.4rem', paddingTop: '0.4rem', borderTop: '1px dashed var(--border-color)', fontWeight: '600', color: 'var(--success)' }}>&check; {s.arraigo.exampleTotal}</div>
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', marginTop: '1.25rem' }}>{s.arraigo.whyTitle}</h3>
          <div style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '1rem', borderRadius: '0.5rem', borderLeft: '4px solid var(--danger)', marginBottom: '1rem' }}>
            <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{s.arraigo.why}</p>
          </div>

          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', marginTop: '1.25rem' }}>{s.arraigo.employerReqsTitle}</h3>
          <Checklist items={[s.arraigo.req1, s.arraigo.req2, s.arraigo.req3, s.arraigo.req4, s.arraigo.req5]} />

          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', marginTop: '1.25rem' }}>{s.arraigo.docsTitle}</h3>
          <Checklist items={[s.arraigo.doc1, s.arraigo.doc2, s.arraigo.doc3, s.arraigo.doc4, s.arraigo.doc5, s.arraigo.doc6]} />

          <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem 1rem', borderRadius: '0.5rem', borderLeft: '4px solid var(--warning)', marginTop: '1rem' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>{s.arraigo.warning}</p>
          </div>
        </Section>

        {/* 3. Documentation */}
        <Section id="documentation" icon={FileText} title={s.documentation.title}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', marginTop: '1rem' }}>{s.documentation.employerTitle}</h3>
          <Checklist items={[s.documentation.employer1, s.documentation.employer2, s.documentation.employer3, s.documentation.employer4]} />
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', marginTop: '1.25rem' }}>{s.documentation.workerTitle}</h3>
          <Checklist items={[s.documentation.worker1, s.documentation.worker2, s.documentation.worker3]} />
        </Section>

        {/* 3. Getting CCC */}
        <Section id="ccc" icon={FileText} title={s.ccc.title}>
          <P>{s.ccc.p1}</P>
          <P>{s.ccc.p2}</P>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '0.75rem' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{s.ccc.online}</h4>
              <StepList items={[s.ccc.online1, s.ccc.online2, s.ccc.online3, s.ccc.online4, s.ccc.online5]} />
            </div>
            <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '0.75rem' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{s.ccc.inPerson}</h4>
              <StepList items={[s.ccc.inPerson1, s.ccc.inPerson2, s.ccc.inPerson3]} />
            </div>
          </div>
        </Section>

        {/* 4. Contract */}
        <Section id="contract" icon={FileText} title={s.contract.title}>
          <P>{s.contract.p1}</P>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{s.contract.types}</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0.75rem 0' }}>
            {[s.contract.indefinido, s.contract.temporal, s.contract.porHoras].map((text, i) => (
              <li key={i} style={{ marginBottom: '0.6rem', display: 'flex', gap: '0.5rem', color: 'var(--text-secondary)', alignItems: 'flex-start' }}>
                <ChevronRight size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '0.2rem' }} />
                <span><strong>{text.split(' \u2014 ')[0]}</strong> &mdash; {text.split(' \u2014 ')[1] || text.split(' — ')[1] || ''}</span>
              </li>
            ))}
          </ul>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', marginTop: '1rem' }}>{s.contract.keyPoints}</h3>
          <Checklist items={[s.contract.key1, s.contract.key2, s.contract.key3, s.contract.key4, s.contract.key5, s.contract.key6]} />
          <a href="https://www.mites.gob.es/es/Guia/texto/guia_5/contenidos/guia_5_12_4.htm" target="_blank" rel="noreferrer" className="btn-secondary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
            <FileText size={16} /> {s.contract.templates} <ExternalLink size={14} />
          </a>
        </Section>

        {/* 5. Registration */}
        <Section id="registration" icon={BookOpen} title={s.registration.title}>
          <P>{s.registration.p1}</P>
          <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem 1rem', borderRadius: '0.5rem', borderLeft: '4px solid var(--warning)', marginBottom: '1rem' }}>
            <p style={{ color: 'var(--warning)', fontWeight: '600', fontSize: '0.875rem' }}>{s.registration.important}</p>
          </div>
          <StepList items={[s.registration.step1, s.registration.step2, s.registration.step3, s.registration.step4, s.registration.step5, s.registration.step6]} />
          <a href="https://portal.seg-social.gob.es/wps/portal/importass/importass/Categorias/Altas%2C+bajas+y+modificaciones/Alta+empleado+hogar" target="_blank" rel="noreferrer" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
            {s.registration.cta} <ExternalLink size={16} />
          </a>
        </Section>

        {/* 6. Base de Cotizacion */}
        <Section id="base-cotizacion" icon={Info} title={s.baseCotizacion.title}>
          <P>{s.baseCotizacion.p1}</P>
          <P>{s.baseCotizacion.p2}</P>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>{s.baseCotizacion.tableTramo}</th>
                <th style={thStyle}>{s.baseCotizacion.tableRetrib}</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>{s.baseCotizacion.tableBase}</th>
              </tr>
            </thead>
            <tbody>
              {R.tramos.map((tr) => (
                <tr key={tr.tramo}>
                  <td style={tdStyle}>{tr.tramo}</td>
                  <td style={tdStyle}>
                    {tr.tramo < 8
                      ? `${tr.tramo === 1 ? s.baseCotizacion.upTo : formatCurrency(tr.min) + ' \u2013'} ${formatCurrency(tr.max)}`
                      : `${s.baseCotizacion.from} ${formatCurrency(tr.min)}`}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontWeight: '600' }}>
                    {tr.base ? formatCurrency(tr.base) : 'Salario real'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <P>{s.baseCotizacion.p3}</P>
        </Section>

        {/* 7. Monthly Obligations */}
        <Section id="monthly" icon={FileText} title={s.monthly.title}>
          <P>{s.monthly.p1}</P>
          {[
            { title: s.monthly.obligation1Title, text: s.monthly.obligation1 },
            { title: s.monthly.obligation2Title, text: s.monthly.obligation2 },
            { title: s.monthly.obligation3Title, text: s.monthly.obligation3 },
          ].map((ob, i) => (
            <div key={i} style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '0.75rem' }}>
              <h4 style={{ marginBottom: '0.35rem', fontSize: '1rem' }}>{i + 1}. {ob.title}</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{ob.text}</p>
            </div>
          ))}
          <Link to="/tools/nomina" className="btn-primary" style={{ marginTop: '0.75rem', display: 'inline-flex' }}>
            <BookOpen size={16} /> {s.monthly.ctaNomina}
          </Link>
        </Section>

        {/* 8. Vacation */}
        <Section id="vacation" icon={Info} title={s.vacation.title}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{s.vacation.vacationTitle}</h3>
          <Checklist items={[s.vacation.vacation1, s.vacation.vacation2, s.vacation.vacation3, s.vacation.vacation4]} />
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', marginTop: '1.25rem' }}>{s.vacation.sickTitle}</h3>
          <Checklist items={[s.vacation.sick1, s.vacation.sick2, s.vacation.sick3, s.vacation.sick4, s.vacation.sick5]} />
        </Section>

        {/* 9. Termination */}
        <Section id="termination" icon={AlertTriangle} title={s.termination.title}>
          <P>{s.termination.p1}</P>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{s.termination.desistimientoTitle}</h3>
          <P>{s.termination.desistimiento1}</P>
          <Checklist items={[s.termination.desistimiento2, s.termination.desistimiento3, s.termination.desistimiento4]} />
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', marginTop: '1rem' }}>{s.termination.despidoTitle}</h3>
          <P>{s.termination.despido1}</P>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', marginTop: '1rem' }}>{s.termination.finiquitoTitle}</h3>
          <P>{s.termination.finiquito1}</P>
          <Checklist items={[s.termination.finiquito2, s.termination.finiquito3, s.termination.finiquito4, s.termination.finiquito5]} />
          <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem 1rem', borderRadius: '0.5rem', borderLeft: '4px solid var(--warning)', marginTop: '1rem' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{s.termination.sepe}</p>
          </div>
        </Section>

        {/* 10. Rates Reference */}
        <Section id="rates" icon={Info} title={s.rates.title}>
          <P>{s.rates.p1}</P>

          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{s.rates.workerTitle}</h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>{s.rates.concept}</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>{s.rates.rate}</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={tdStyle}>Contingencias Comunes</td><td style={{ ...tdStyle, textAlign: 'right' }}>{formatPercentage(R.worker.contingenciasComunes)}</td></tr>
              <tr><td style={tdStyle}>MEI</td><td style={{ ...tdStyle, textAlign: 'right' }}>{formatPercentage(R.worker.mei)}</td></tr>
              <tr><td style={tdStyle}>Desempleo (indefinido)</td><td style={{ ...tdStyle, textAlign: 'right' }}>{formatPercentage(R.worker.desempleo.indefinido)}</td></tr>
              <tr style={{ fontWeight: '600' }}><td style={tdStyle}>Total</td><td style={{ ...tdStyle, textAlign: 'right' }}>{formatPercentage(R.worker.contingenciasComunes + R.worker.mei + R.worker.desempleo.indefinido)}</td></tr>
            </tbody>
          </table>

          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', marginTop: '1.25rem' }}>{s.rates.employerTitle}</h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>{s.rates.concept}</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>{s.rates.gross}</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>{s.rates.bonus}</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>{s.rates.effective}</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Contingencias Comunes', data: R.employer.contingenciasComunes },
                { name: 'MEI', data: R.employer.mei },
                { name: 'AT/EP', data: R.employer.atep },
                { name: 'Desempleo', data: R.employer.desempleo.indefinido },
                { name: 'FOGASA', data: R.employer.fogasa },
              ].map((row) => (
                <tr key={row.name}>
                  <td style={tdStyle}>{row.name}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>{formatPercentage(row.data.grossRate)}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>{row.data.bonusPercent > 0 ? formatPercentage(row.data.bonusPercent, 0) : '-'}</td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontWeight: '600' }}>{formatPercentage(row.data.grossRate * (1 - row.data.bonusPercent))}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>{s.rates.source}</p>
        </Section>

        {/* 11. Resources */}
        <Section id="resources" icon={ExternalLink} title={s.resources.title}>
          <P>{s.resources.p1}</P>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { label: 'IMPORT@SS', desc: s.resources.importass, url: 'https://portal.seg-social.gob.es/wps/portal/importass/importass' },
              { label: 'SEPE', desc: s.resources.sepe, url: 'https://www.sepe.es' },
              { label: 'MITES', desc: s.resources.mites, url: 'https://www.mites.gob.es' },
              { label: 'BOE', desc: s.resources.boe, url: 'https://www.boe.es' },
              { label: 'Cl@ve', desc: s.resources.clave, url: 'https://clave.gob.es' },
            ].map(link => (
              <a key={link.label} href={link.url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'var(--bg-tertiary)', borderRadius: '0.5rem', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                <ExternalLink size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                <div>
                  <strong>{link.label}</strong>
                  <span style={{ color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>&mdash; {link.desc}</span>
                </div>
              </a>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'var(--bg-tertiary)', borderRadius: '0.5rem', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
              <Info size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
              <div>
                <strong>901 50 20 50</strong>
                <span style={{ color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>&mdash; {s.resources.segSocial}</span>
              </div>
            </div>
          </div>
        </Section>

      </div>
    </div>
  );
}
