import { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { calculateNominaFull } from '../utils/nominaCalculator';
import { REGULATIONS_2026 } from '../config/regulations';
import NominaForm from '../components/nomina/NominaForm';
import NominaPreview from '../components/nomina/NominaPreview';
import { Download, ShieldCheck } from 'lucide-react';

export default function NominaTool() {
  const { t } = useLanguage();
  const pdfRef = useRef();

  const [formData, setFormData] = useState({
    employerName: '',
    employerNif: '',
    employerAddress: '',
    employerLocality: '',
    employerCCC: '',
    workerName: '',
    workerNie: '',
    ssNumber: '',
    workerCategory: 'Empleada de Hogar',
    workerDob: '',
    workerSeniority: '',
    contractType: 'indefinido',
    periodMonth: '3', // April (0-indexed)
    periodYear: '2026',
    hoursPerWeek: '8',
    hoursPerMonth: '34.64',
    hourlyRate: String(REGULATIONS_2026.smi.hourly),
    pagasProrrateadas: true,
    includePagaExtra: false,
    overrideSalary: '',
    overrideBase: '',
  });

  const handleFormChange = (updates) => {
    setFormData(prev => {
      const next = { ...prev, ...updates };
      if ('hoursPerWeek' in updates) {
        next.hoursPerMonth = (parseFloat(updates.hoursPerWeek) * 4.33).toFixed(2);
      }
      return next;
    });
  };

  const results = calculateNominaFull({
    hoursPerMonth: formData.hoursPerMonth,
    hourlyRate: formData.hourlyRate,
    salarioBruto: formData.overrideSalary || undefined,
    baseCotizacion: formData.overrideBase || undefined,
    pagasProrrateadas: formData.pagasProrrateadas,
    includePagaExtra: formData.includePagaExtra,
    contractType: formData.contractType,
  });

  const exportPDF = async () => {
    const { generateNominaPdf } = await import('../utils/nominaPdfBuilder');
    generateNominaPdf(formData, results, t);
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem' }}>
          {t('nomina.pageTitle')} <span className="gradient-text">{t('nomina.pageYear')}</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>{t('nomina.pageSubtitle')}</p>
      </div>

      <div className="grid-2-cols" style={{ gap: '2rem', alignItems: 'start' }}>
        <div>
          <NominaForm formData={formData} onChange={handleFormChange} results={results} />

          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button className="btn-primary" onClick={exportPDF} style={{ width: '100%', fontSize: '1rem', padding: '0.75rem' }}>
              <Download size={18} /> {t('common.exportPdf')}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--success)', fontSize: '0.75rem' }}>
              <ShieldCheck size={14} /> {t('common.localProcessing')}
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto', alignSelf: 'flex-start' }}>
          <NominaPreview ref={pdfRef} formData={formData} results={results} />
        </div>
      </div>
    </div>
  );
}
