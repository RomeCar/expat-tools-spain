import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { formatCurrency } from '../../utils/formatters';
import { FileText, ChevronDown, ChevronUp, Settings } from 'lucide-react';

export default function NominaForm({ formData, onChange, results }) {
  const { t } = useLanguage();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onChange({ [name]: type === 'checkbox' ? checked : value });
  };

  const handleNumber = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const months = t('common.months');

  const inputStyle = { padding: '0.5rem', fontSize: '0.875rem' };
  const labelStyle = { fontSize: '0.75rem', marginBottom: '0.25rem' };
  const groupStyle = { marginBottom: '0.5rem' };

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem' }}>
        <FileText size={18} style={{ color: 'var(--accent-primary)' }} />
        {t('nomina.form.parametersTitle')}
      </h2>

      {/* Employer Section */}
      <div style={{ fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>
        {t('nomina.form.employerSection')}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div className="input-group" style={groupStyle}>
          <label className="input-label" style={labelStyle}>{t('nomina.form.employerName')}</label>
          <input type="text" name="employerName" className="input-field" style={inputStyle} value={formData.employerName} onChange={handleChange} />
        </div>
        <div className="input-group" style={groupStyle}>
          <label className="input-label" style={labelStyle}>{t('nomina.form.employerNif')}</label>
          <input type="text" name="employerNif" className="input-field" style={inputStyle} value={formData.employerNif} onChange={handleChange} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div className="input-group" style={groupStyle}>
          <label className="input-label" style={labelStyle}>{t('nomina.form.employerAddress')}</label>
          <input type="text" name="employerAddress" className="input-field" style={inputStyle} value={formData.employerAddress} onChange={handleChange} />
        </div>
        <div className="input-group" style={groupStyle}>
          <label className="input-label" style={labelStyle}>{t('nomina.form.employerLocality')}</label>
          <input type="text" name="employerLocality" className="input-field" style={inputStyle} value={formData.employerLocality} onChange={handleChange} />
        </div>
      </div>
      <div className="input-group" style={groupStyle}>
        <label className="input-label" style={labelStyle}>{t('nomina.form.employerCCC')}</label>
        <input type="text" name="employerCCC" className="input-field" style={inputStyle} value={formData.employerCCC} onChange={handleChange} />
      </div>

      {/* Worker Section */}
      <div style={{ fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginTop: '0.75rem', marginBottom: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
        {t('nomina.form.workerSection')}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div className="input-group" style={groupStyle}>
          <label className="input-label" style={labelStyle}>{t('nomina.form.workerName')}</label>
          <input type="text" name="workerName" className="input-field" style={inputStyle} value={formData.workerName} onChange={handleChange} />
        </div>
        <div className="input-group" style={groupStyle}>
          <label className="input-label" style={labelStyle}>{t('nomina.form.workerNie')}</label>
          <input type="text" name="workerNie" className="input-field" style={inputStyle} value={formData.workerNie} onChange={handleChange} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div className="input-group" style={groupStyle}>
          <label className="input-label" style={labelStyle}>{t('nomina.form.ssNumber')}</label>
          <input type="text" name="ssNumber" className="input-field" style={inputStyle} value={formData.ssNumber} onChange={handleChange} />
        </div>
        <div className="input-group" style={groupStyle}>
          <label className="input-label" style={labelStyle}>{t('nomina.form.workerCategory')}</label>
          <input type="text" name="workerCategory" className="input-field" style={inputStyle} value={formData.workerCategory} onChange={handleChange} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div className="input-group" style={groupStyle}>
          <label className="input-label" style={labelStyle}>{t('nomina.form.workerDob')}</label>
          <input type="text" name="workerDob" className="input-field" style={inputStyle} value={formData.workerDob} onChange={handleChange} placeholder="DD/MM/YYYY" />
        </div>
        <div className="input-group" style={groupStyle}>
          <label className="input-label" style={labelStyle}>{t('nomina.form.workerSeniority')}</label>
          <input type="text" name="workerSeniority" className="input-field" style={inputStyle} value={formData.workerSeniority} onChange={handleChange} placeholder="DD/MM/YYYY" />
        </div>
      </div>
      <div className="input-group" style={groupStyle}>
        <label className="input-label" style={labelStyle}>{t('nomina.form.contractType')}</label>
        <select name="contractType" className="input-field" style={inputStyle} value={formData.contractType} onChange={handleChange}>
          <option value="indefinido">{t('nomina.form.contractIndefinido')}</option>
          <option value="temporal">{t('nomina.form.contractTemporal')}</option>
          <option value="fijoDiscontinuo">{t('nomina.form.contractFijoDiscontinuo')}</option>
        </select>
      </div>

      {/* Period & Salary Section */}
      <div style={{ fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginTop: '0.75rem', marginBottom: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
        {t('nomina.form.periodSection')}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
        <div className="input-group" style={groupStyle}>
          <label className="input-label" style={labelStyle}>{t('nomina.form.month')}</label>
          <select name="periodMonth" className="input-field" style={inputStyle} value={formData.periodMonth} onChange={handleChange}>
            <option value="">{t('nomina.form.selectMonth')}</option>
            {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
        </div>
        <div className="input-group" style={groupStyle}>
          <label className="input-label" style={labelStyle}>{t('nomina.form.year')}</label>
          <select name="periodYear" className="input-field" style={inputStyle} value={formData.periodYear} onChange={handleChange}>
            {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div className="input-group" style={groupStyle}>
          <label className="input-label" style={labelStyle}>{t('nomina.form.hoursPerMonth')}</label>
          <input type="number" step="0.01" name="hoursPerMonth" className="input-field" style={inputStyle} value={formData.hoursPerMonth} onChange={handleNumber} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div className="input-group" style={groupStyle}>
          <label className="input-label" style={labelStyle}>{t('nomina.form.hourlyRate')}</label>
          <input type="number" step="0.01" name="hourlyRate" className="input-field" style={inputStyle} value={formData.hourlyRate} onChange={handleNumber} />
          <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
            {t('nomina.form.smiNote')}
          </div>
        </div>
        <div className="input-group" style={groupStyle}>
          <label className="input-label" style={labelStyle}>{t('nomina.form.salarioMensual')}</label>
          <div className="input-field" style={{ ...inputStyle, background: 'var(--bg-tertiary)', fontWeight: '600', color: 'var(--accent-primary)' }}>
            {formatCurrency(results.salarioBruto)}
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
            {t('nomina.form.autoCalculated')} &middot; {t('nomina.form.tramoAssigned')}: {results.tramo.tramo} ({formatCurrency(results.baseCotizacion)})
          </div>
        </div>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: '0.5rem', marginTop: '0.5rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
          <input type="checkbox" name="pagasProrrateadas" checked={formData.pagasProrrateadas} onChange={handleChange} style={{ accentColor: 'var(--accent-primary)' }} />
          {t('nomina.form.pagasProrrateadas')}
        </label>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', paddingLeft: '1.5rem' }}>
          {t('nomina.form.pagasProrrateadasHelp')}
        </div>
        {!formData.pagasProrrateadas && (
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', paddingLeft: '1.5rem', cursor: 'pointer' }}>
            <input type="checkbox" name="includePagaExtra" checked={formData.includePagaExtra} onChange={handleChange} style={{ accentColor: 'var(--accent-primary)' }} />
            Incluir Paga Extra este mes (+100% salario)
          </label>
        )}
      </div>

      {/* Advanced Mode */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.75rem', padding: '0.4rem 0.75rem', fontSize: '0.75rem', background: 'none', border: '1px solid var(--border-color)', borderRadius: '0.375rem', color: 'var(--text-secondary)', cursor: 'pointer' }}
      >
        <Settings size={14} />
        {t('nomina.form.advancedMode')}
        {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {showAdvanced && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem', padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: '0.5rem' }}>
          <div className="input-group" style={groupStyle}>
            <label className="input-label" style={labelStyle}>{t('nomina.form.overrideSalary')}</label>
            <input type="number" step="0.01" name="overrideSalary" className="input-field" style={inputStyle} value={formData.overrideSalary} onChange={handleNumber} placeholder={String(results.autoSalary)} />
          </div>
          <div className="input-group" style={groupStyle}>
            <label className="input-label" style={labelStyle}>{t('nomina.form.overrideBase')}</label>
            <input type="number" step="0.01" name="overrideBase" className="input-field" style={inputStyle} value={formData.overrideBase} onChange={handleNumber} placeholder={String(results.baseCotizacion)} />
          </div>
          <div style={{ gridColumn: '1 / -1', fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>
            {t('nomina.form.advancedModeHelp')}
          </div>
        </div>
      )}
    </div>
  );
}
