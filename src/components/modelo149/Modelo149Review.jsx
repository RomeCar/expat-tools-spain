import { useLanguage } from '../../context/LanguageContext';
import { COMMON_COUNTRIES } from '../../config/modelo149';
import { Download, ExternalLink } from 'lucide-react';

function ReviewRow({ box, label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0.4rem 0', borderBottom: '1px solid var(--border-color)', fontSize: '0.875rem' }}>
      <span style={{ color: 'var(--text-secondary)' }}>
        {box && <span style={{ fontWeight: '600', color: 'var(--accent-primary)', marginRight: '0.5rem' }}>Box {box}</span>}
        {label}
      </span>
      <span style={{ fontWeight: '500', color: 'var(--text-primary)', textAlign: 'right', maxWidth: '50%' }}>{value}</span>
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

export default function Modelo149Review({ data }) {
  const { t, language } = useLanguage();
  const r = t('modelo149.form.review');
  const f = t('modelo149.form');

  const countryName = (code) => {
    const c = COMMON_COUNTRIES.find(x => x.code === code);
    return c ? (language === 'en' ? c.en : c.es) : code;
  };

  const purposeLabels = { option: f.purpose.option, renunciation: f.purpose.renunciation, exclusion: f.purpose.exclusion, endDisplacement: f.purpose.endDisplacement };
  const categoryLabels = { employment: f.situation.employment, director: f.situation.director, entrepreneur: f.situation.entrepreneur, professional: f.situation.professional, research: f.situation.research };
  const empTypeLabels = { newJob: f.situation.newJob, transfer: f.situation.transfer, remote: f.situation.remote };

  const exportPDF = async () => {
    const { generateModelo149Pdf } = await import('../../utils/modelo149PdfBuilder');
    generateModelo149Pdf(data, t, language);
  };

  return (
    <div>
      <h3 style={{ marginBottom: '0.5rem' }}>{r.title}</h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>{r.subtitle}</p>

      <ReviewSection title={r.section1}>
        <ReviewRow box="06/07" label={f.taxpayerType.title} value={data.taxpayerType === 'primary' ? f.taxpayerType.primary : f.taxpayerType.associated} />
        <ReviewRow box="01" label={f.details.nif} value={data.nif} />
        <ReviewRow box="02" label={f.details.apellidos} value={data.apellidos} />
        <ReviewRow box="03" label={f.details.nombre} value={data.nombre} />
        <ReviewRow box="04" label={f.details.telefonoFijo} value={data.telefonoFijo} />
        <ReviewRow box="05" label={f.details.telefonoMovil} value={data.telefonoMovil} />
        {data.taxpayerType === 'associated' && (
          <>
            <ReviewRow box="08" label={f.taxpayerType.primaryNif} value={data.primaryNif} />
            <ReviewRow box="09-10" label={f.taxpayerType.primaryName} value={data.primaryApellidos} />
            <ReviewRow box="11" label={f.taxpayerType.primaryRef} value={data.primaryM149Ref} />
          </>
        )}
      </ReviewSection>

      <ReviewSection title={r.section2}>
        <ReviewRow label={f.details.addressTitle} value={`${data.tipoVia} ${data.nombreVia} ${data.numero}, ${data.planta} ${data.puerta}`} />
        <ReviewRow label={f.details.codigoPostal} value={data.codigoPostal} />
        <ReviewRow label={f.details.municipio} value={data.municipio} />
        <ReviewRow label={f.details.provincia} value={data.provincia} />
      </ReviewSection>

      <ReviewSection title={r.section3}>
        <ReviewRow box="31-34" label={f.purpose.title} value={purposeLabels[data.purpose]} />
        {data.purpose === 'option' && <ReviewRow box="32" label={f.purpose.docCode} value={data.docRegistrationCode} />}
        {data.purpose === 'exclusion' && (
          <>
            <ReviewRow box="35" label={f.purpose.exclusionDate} value={data.exclusionDate} />
            <ReviewRow box="36" label={f.purpose.exclusionReason} value={data.exclusionReason} />
          </>
        )}
        {data.purpose === 'endDisplacement' && <ReviewRow box="38" label={f.purpose.endDate} value={data.endDisplacementDate} />}
      </ReviewSection>

      <ReviewSection title={r.section4}>
        {data.taxpayerType === 'primary' && (
          <>
            <ReviewRow box="41-56" label={f.situation.categoryLabel} value={categoryLabels[data.category]} />
            {data.category === 'employment' && (
              <>
                <ReviewRow box="41-43" label={f.situation.empType} value={empTypeLabels[data.employmentType]} />
                <ReviewRow box="44" label={f.situation.employerNif} value={data.employerNif} />
                <ReviewRow box="45-46" label={f.situation.employerName} value={data.employerName} />
              </>
            )}
            {data.category === 'director' && (
              <>
                <ReviewRow box="49" label={f.situation.entityNif} value={data.entityNif} />
                <ReviewRow box="50" label={f.situation.entityName} value={data.entityName} />
              </>
            )}
            {(data.category === 'professional' || data.category === 'research') && (
              <>
                <ReviewRow box="57/59" label={f.situation.entityNif} value={data.entityNif} />
                <ReviewRow box="58/60" label={f.situation.entityName} value={data.entityName} />
              </>
            )}
          </>
        )}
        {data.taxpayerType === 'associated' && (
          <ReviewRow box="61-63" label={f.dates.associatedRelation} value={data.associatedType} />
        )}
        <ReviewRow box="51" label={f.dates.entryDate} value={data.entryDate} />
        <ReviewRow box="52" label={f.dates.activityStart} value={data.activityStartDate} />
        <ReviewRow box="53" label={f.dates.lastResidence} value={countryName(data.lastTaxResidence)} />
        <ReviewRow box="67" label={f.dates.nationality} value={countryName(data.nationality)} />
      </ReviewSection>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
        <button className="btn-primary" onClick={exportPDF} style={{ padding: '0.75rem 1.5rem' }}>
          <Download size={18} /> {r.downloadPdf}
        </button>
        <a href={r.aeatUrl} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '0.75rem 1.5rem' }}>
          {r.goToAeat} <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
}
