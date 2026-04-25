import { useLanguage } from '../../context/LanguageContext';
import { PRESTACIONES, CONTRACT_TYPES } from '../../config/bajaMedica';
import { Download, ExternalLink } from 'lucide-react';

function ReviewRow({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0.4rem 0', borderBottom: '1px solid var(--border-color)', fontSize: '0.875rem' }}>
      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontWeight: '500', color: 'var(--text-primary)', textAlign: 'right', maxWidth: '60%' }}>{value}</span>
    </div>
  );
}

function ReviewSection({ title, children }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem', paddingBottom: '0.35rem', borderBottom: '2px solid var(--accent-primary)' }}>{title}</h4>
      {children}
    </div>
  );
}

export default function C133Review({ data }) {
  const { t, language } = useLanguage();
  const f = t('bajaMedica.form');
  const r = f.review;

  const prestacionLabel = (() => {
    const p = PRESTACIONES.find(x => x.code === data.prestacion);
    return p ? (language === 'en' ? p.en : p.es) : data.prestacion;
  })();
  const contractLabel = (() => {
    const c = CONTRACT_TYPES.find(x => x.code === data.contractType);
    return c ? (language === 'en' ? c.en : c.es) : data.contractType;
  })();

  const fullAddress = [data.empVia, data.empNumero].filter(Boolean).join(' ') +
    (data.empPiso || data.empPuerta ? `, ${[data.empBloque, data.empEscalera, data.empPiso, data.empPuerta].filter(Boolean).join(' ')}` : '') +
    (data.empCp || data.empLocalidad ? ` — ${[data.empCp, data.empLocalidad, data.empProvincia].filter(Boolean).join(' ')}` : '');

  const exportPDF = async () => {
    const { generateC133Pdf } = await import('../../utils/c133PdfBuilder');
    generateC133Pdf(data, t, language);
  };

  return (
    <div>
      <h3 style={{ marginBottom: '0.5rem' }}>{r.title}</h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>{r.subtitle}</p>

      <ReviewSection title={r.section1}>
        <ReviewRow label={f.prestacion.title} value={prestacionLabel} />
      </ReviewSection>

      <ReviewSection title={r.section2}>
        <ReviewRow label={f.employer.name} value={data.empName} />
        <ReviewRow label={f.employer.dni} value={data.empDni} />
        <ReviewRow label={f.employer.ccc} value={data.empCcc} />
        <ReviewRow label={f.employer.address} value={fullAddress} />
        <ReviewRow label={f.employer.telefono} value={data.empTelefono} />
      </ReviewSection>

      <ReviewSection title={r.section3}>
        <ReviewRow label={f.worker.name} value={data.workName} />
        <ReviewRow label={f.worker.nss} value={data.workNss} />
        <ReviewRow label={f.worker.dni} value={data.workDni} />
        <ReviewRow label={f.worker.telefono} value={data.workTelefono} />
        <ReviewRow label={f.worker.contractTitle} value={contractLabel} />
        <ReviewRow label={f.worker.tramo} value={data.tramo} />
        <ReviewRow label={f.worker.fechaInicio} value={data.fechaInicio} />
        <ReviewRow label={data.prestacion === 'NCM' ? f.worker.fechaInterrupcionNcm : f.worker.fechaInterrupcion} value={data.fechaInterrupcion} />
        <ReviewRow label={f.worker.fechaPrevistaFin} value={data.fechaPrevistaFin} />
        {data.prestacion === 'NCM' && (
          <>
            <ReviewRow label={f.worker.fechaInicioObligatorio} value={data.fechaInicioObligatorio} />
            <ReviewRow label={f.worker.fechaFinObligatorio} value={data.fechaFinObligatorio} />
          </>
        )}
      </ReviewSection>

      <ReviewSection title={r.section4}>
        {data.bases.filter(b => b.anio || b.mes || b.base).map((b, i) => (
          <ReviewRow key={i} label={`${b.anio || '—'}/${b.mes || '—'} (${b.dias || '—'} ${f.bases.daysShort})`} value={b.base ? `${b.base} EUR` : '—'} />
        ))}
        {data.observaciones && <ReviewRow label={f.bases.observaciones} value={data.observaciones} />}
      </ReviewSection>

      <ReviewSection title={r.section5}>
        <ReviewRow label={f.signature.title} value={data.firmaLocalidad ? `${data.firmaLocalidad}, ${data.firmaDia || '__'}/${data.firmaMes || '__'}/${data.firmaAnio || '____'}` : null} />
      </ReviewSection>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
        <button className="btn-primary" onClick={exportPDF} style={{ padding: '0.75rem 1.5rem' }}>
          <Download size={18} /> {r.downloadPdf}
        </button>
        <a href="https://sede.seg-social.gob.es" target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '0.75rem 1.5rem' }}>
          {r.goToSede} <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
}
