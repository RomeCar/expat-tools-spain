import { forwardRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import './NominaPreview.css';

const NominaPreview = forwardRef(function NominaPreview({ formData, results }, ref) {
  const { t } = useLanguage();
  const p = t('nomina.preview');
  const months = t('common.months');
  const monthName = months[parseInt(formData.periodMonth)] || '';

  return (
    <div ref={ref} className="nomina-doc">
      {/* Header */}
      <div className="nomina-doc-header">
        <h1>{p.title}</h1>
        <span className="nomina-period-label">{monthName} {formData.periodYear}</span>
      </div>

      {/* Employer / Worker Info Grid */}
      <div className="nomina-info-grid">
        <div className="nomina-info-col">
          <h3>{p.employer}</h3>
          <div className="nomina-info-row"><span className="nomina-info-label">{p.cifNie}</span><span className="nomina-info-value">{formData.employerNif}</span></div>
          <div className="nomina-info-row"><span className="nomina-info-label">{p.address}</span><span className="nomina-info-value">{formData.employerAddress}</span></div>
          <div className="nomina-info-row"><span className="nomina-info-label">{p.locality}</span><span className="nomina-info-value">{formData.employerLocality}</span></div>
          <div className="nomina-info-row"><span className="nomina-info-label">{p.ccc}</span><span className="nomina-info-value">{formData.employerCCC}</span></div>
          <div className="nomina-info-row" style={{ fontWeight: 600, marginTop: 4 }}>
            <span className="nomina-info-label">{formData.employerName}</span>
          </div>
        </div>
        <div className="nomina-info-col">
          <h3>{p.worker}</h3>
          <div className="nomina-info-row"><span className="nomina-info-label">{p.nifNie}</span><span className="nomina-info-value">{formData.workerNie}</span></div>
          <div className="nomina-info-row"><span className="nomina-info-label">{p.ssNumber}</span><span className="nomina-info-value">{formData.ssNumber}</span></div>
          <div className="nomina-info-row"><span className="nomina-info-label">{p.category}</span><span className="nomina-info-value">{formData.workerCategory}</span></div>
          <div className="nomina-info-row"><span className="nomina-info-label">{p.seniority}</span><span className="nomina-info-value">{formData.workerSeniority}</span></div>
          <div className="nomina-info-row" style={{ fontWeight: 600, marginTop: 4 }}>
            <span className="nomina-info-label">{formData.workerName}</span>
          </div>
        </div>
      </div>

      {/* Period Line */}
      <div className="nomina-period-line">
        <span><strong>{p.period}:</strong> {monthName} {formData.periodYear}</span>
        <span>{formData.hoursPerMonth} h / {p.hoursMonth}</span>
        <span>30 {p.days}</span>
      </div>

      {/* DEVENGOS */}
      <h2 className="nomina-section-title">{p.devengos}</h2>
      <div style={{ marginBottom: 20 }}>
        <div className="nomina-line">
          <span className="nomina-line-label">{formData.pagasProrrateadas ? p.salarioMensual : p.salarioMensualNoProrrateo}</span>
          <span className="nomina-line-value">{formatCurrency(results.devengos.salarioBase)}</span>
        </div>
        {formData.pagasProrrateadas && (
          <>
            <div className="nomina-line">
              <span className="nomina-line-label">{p.pagaExtraJunio} <span className="nomina-line-sub"></span></span>
              <span className="nomina-line-value">{formatCurrency(0)}</span>
            </div>
            <div className="nomina-line">
              <span className="nomina-line-label">{p.pagaExtraDiciembre}</span>
              <span className="nomina-line-value">{formatCurrency(0)}</span>
            </div>
          </>
        )}
        {results.devengos.pagaExtra > 0 && (
          <div className="nomina-line" style={{ fontWeight: 600 }}>
            <span className="nomina-line-label">Paga extra abonada</span>
            <span className="nomina-line-value">{formatCurrency(results.devengos.pagaExtra)}</span>
          </div>
        )}
        <div className="nomina-subtotal">
          <span>{p.totalDevengado}</span>
          <span>{formatCurrency(results.devengos.totalDevengado)}</span>
        </div>
      </div>

      {/* DEDUCCIONES */}
      <h2 className="nomina-section-title">{p.deducciones}</h2>
      <div style={{ marginBottom: 8 }}>
        <div className="nomina-ded-row nomina-ded-header">
          <span>{p.concepto}</span>
          <span className="text-right">{p.baseCotiz}</span>
          <span className="text-right">{p.tipo}</span>
          <span className="text-right">{p.importe}</span>
        </div>
        <div className="nomina-ded-row">
          <span>{p.ccMei} ({formatPercentage(results.deductions.ccPlusMeiRate)})</span>
          <span className="text-right">{formatCurrency(results.baseCotizacion)}</span>
          <span className="text-right">{formatPercentage(results.deductions.ccPlusMeiRate)}</span>
          <span className="text-right">{formatCurrency(results.deductions.ccPlusMei)}</span>
        </div>
        <div className="nomina-ded-row">
          <span>{p.desempleo} ({formatPercentage(results.deductions.desempleoRate)})</span>
          <span className="text-right">{formatCurrency(results.baseCotizacion)}</span>
          <span className="text-right">{formatPercentage(results.deductions.desempleoRate)}</span>
          <span className="text-right">{formatCurrency(results.deductions.desempleo)}</span>
        </div>
        <div className="nomina-subtotal">
          <span>{p.totalDeducir}</span>
          <span>{formatCurrency(results.deductions.total)}</span>
        </div>
      </div>

      {/* HERO: Net Pay */}
      <div className="nomina-hero">
        <span className="nomina-hero-label">{p.liquidoTotal}</span>
        <span className="nomina-hero-amount">{formatCurrency(results.liquido)}</span>
      </div>

      {/* Signatures */}
      <div className="nomina-signatures">
        <div>
          <div>{p.firmaEmpleador}</div>
          <div className="nomina-sig-line" />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div>{p.fecha}: {monthName} {formData.periodYear}</div>
          <div className="nomina-sig-line" style={{ margin: '24px auto 0' }} />
        </div>
        <div style={{ textAlign: 'right' }}>
          <div>{p.recibi}</div>
          <div className="nomina-sig-line" style={{ marginLeft: 'auto' }} />
        </div>
      </div>

      {/* Separator */}
      <hr className="nomina-separator" />

      {/* EMPLOYER COSTS (Secondary) */}
      <h3 className="nomina-secondary-title">{p.seccionEmpleador}</h3>
      <div style={{ marginBottom: 4 }}>
        <div className="nomina-emp-row nomina-emp-header">
          <span>{p.concepto}</span>
          <span className="text-right">Base</span>
          <span className="text-right">{p.tiposBruto}</span>
          <span className="text-right">{p.bonificacion}</span>
          <span className="text-right">{p.cuotaNeta}</span>
        </div>
        {[
          { label: p.ccBonif, data: results.employerCosts.contingenciasComunes },
          { label: `${p.meiEmpleador} (${formatPercentage(results.employerCosts.mei.grossRate)})`, data: results.employerCosts.mei },
          { label: p.atep, data: results.employerCosts.atep },
          { label: p.desempleoBonif, data: results.employerCosts.desempleo },
          { label: p.fogasaBonif, data: results.employerCosts.fogasa },
        ].map((row, i) => (
          <div className="nomina-emp-row" key={i}>
            <span>{row.label}</span>
            <span className="text-right">{formatCurrency(results.baseCotizacion)}</span>
            <span className="text-right">{formatPercentage(row.data.grossRate)}</span>
            <span className="text-right">{row.data.bonusPercent > 0 ? formatPercentage(row.data.bonusPercent, 0) : '-'}</span>
            <span className="text-right" style={{ fontWeight: 500 }}>{formatCurrency(row.data.netAmount)}</span>
          </div>
        ))}
      </div>

      <div className="nomina-emp-total">
        <span>{p.totalCuotaEmpleador}</span>
        <span style={{ fontWeight: 600 }}>{formatCurrency(results.employerCosts.totalSS)}</span>
      </div>
      <div className="nomina-emp-total">
        <span>{p.cargoBancario}</span>
        <span style={{ fontWeight: 600 }}>{formatCurrency(results.cargoBancarioSS)}</span>
      </div>
      <div className="nomina-emp-total primary">
        <span>{p.costeTotalEmpleador}</span>
        <span>{formatCurrency(results.costeTotalEmpleador)}</span>
      </div>

      {/* Footer */}
      <div className="nomina-footer">
        {monthName} {formData.periodYear} | CCC: {formData.employerCCC} | SS {formData.workerName.split(' ')[0]}: {formData.ssNumber}
      </div>
    </div>
  );
});

export default NominaPreview;
