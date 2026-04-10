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
      <div className="nomina-header">
        {p.title} &mdash; {monthName.toUpperCase()} {formData.periodYear}
      </div>

      {/* Employer / Worker Data */}
      <div className="nomina-data-grid">
        <div className="nomina-data-col">
          <div className="nomina-label">{p.employer}</div>
          <div className="nomina-value">{formData.employerName}</div>
          <div className="nomina-label">{p.cifNie}</div>
          <div className="nomina-value">{formData.employerNif}</div>
          <div className="nomina-label">{p.address}</div>
          <div className="nomina-value">{formData.employerAddress}</div>
          <div className="nomina-label">{p.locality}</div>
          <div className="nomina-value">{formData.employerLocality}</div>
          <div className="nomina-label">{p.ccc}</div>
          <div className="nomina-value">{formData.employerCCC}</div>
        </div>
        <div className="nomina-data-col">
          <div className="nomina-label">{p.worker}</div>
          <div className="nomina-value">{formData.workerName}</div>
          <div className="nomina-label">{p.nifNie}</div>
          <div className="nomina-value">{formData.workerNie}</div>
          <div className="nomina-label">{p.ssNumber}</div>
          <div className="nomina-value">{formData.ssNumber}</div>
          <div className="nomina-label">{p.category}</div>
          <div className="nomina-value">{formData.workerCategory}</div>
          <div className="nomina-label">{p.seniority}</div>
          <div className="nomina-value">{formData.workerSeniority}</div>
        </div>
      </div>

      {/* Period Bar */}
      <div className="nomina-period-bar">
        <div className="nomina-period-main">{p.period}: {monthName} {formData.periodYear}</div>
        <div className="nomina-period-detail">{p.hoursMonth}</div>
        <div className="nomina-period-value">{formData.hoursPerMonth} h</div>
        <div className="nomina-period-value" style={{ borderLeft: '1px solid #e2e8f0' }}>30 {p.days}</div>
      </div>

      {/* Devengos + Deducciones Table */}
      <table className="nomina-table">
        <thead>
          <tr>
            <th className="text-left">{p.concept}</th>
            <th className="text-right" style={{ width: 120 }}>{p.amount}</th>
          </tr>
        </thead>
        <tbody>
          <tr><td colSpan="2" className="nomina-section-header">{p.devengos}</td></tr>
          <tr><td colSpan="2" className="nomina-subsection-header">{p.percepcionesSalariales}</td></tr>
          <tr>
            <td>{formData.pagasProrrateadas ? p.salarioMensual : p.salarioMensualNoProrrateo}</td>
            <td className="text-right">{formatCurrency(results.devengos.salarioBase)}</td>
          </tr>
          {formData.pagasProrrateadas && (
            <>
              <tr><td colSpan="2" className="nomina-subsection-header">
                {p.gratificaciones} &mdash; ({formData.pagasProrrateadas ? 'Prorrateadas' : ''})
              </td></tr>
              <tr>
                <td>{p.pagaExtraJunio}</td>
                <td className="text-right">{formatCurrency(0)}</td>
              </tr>
              <tr>
                <td>{p.pagaExtraDiciembre}</td>
                <td className="text-right">{formatCurrency(0)}</td>
              </tr>
            </>
          )}
          {results.devengos.pagaExtra > 0 && (
            <tr>
              <td style={{ fontWeight: 'bold' }}>Paga extra abonada en este periodo</td>
              <td className="text-right" style={{ fontWeight: 'bold' }}>{formatCurrency(results.devengos.pagaExtra)}</td>
            </tr>
          )}
          <tr><td colSpan="2" className="nomina-subsection-header">{p.percepcionesNoSalariales}</td></tr>
          <tr><td>{p.indemnizaciones}</td><td className="text-right"></td></tr>
          <tr className="nomina-row-total">
            <td>{p.totalDevengado}</td>
            <td className="text-right">{formatCurrency(results.devengos.totalDevengado)}</td>
          </tr>
        </tbody>
      </table>

      {/* Deducciones Table */}
      <table className="nomina-table">
        <thead>
          <tr><th colSpan="4" className="nomina-section-header" style={{ textAlign: 'left' }}>{p.deducciones}</th></tr>
          <tr>
            <th className="text-left">{p.concepto}</th>
            <th className="text-right">{p.baseCotiz}</th>
            <th className="text-right">{p.tipo}</th>
            <th className="text-right" style={{ width: 120 }}>{p.importe}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{p.ccMei} ({formatPercentage(results.deductions.ccPlusMeiRate)})</td>
            <td className="text-right">{formatCurrency(results.baseCotizacion)}</td>
            <td className="text-right">{formatPercentage(results.deductions.ccPlusMeiRate)}</td>
            <td className="text-right">{formatCurrency(results.deductions.ccPlusMei)}</td>
          </tr>
          <tr>
            <td>{p.desempleo} ({formatPercentage(results.deductions.desempleoRate)})</td>
            <td className="text-right">{formatCurrency(results.baseCotizacion)}</td>
            <td className="text-right">{formatPercentage(results.deductions.desempleoRate)}</td>
            <td className="text-right">{formatCurrency(results.deductions.desempleo)}</td>
          </tr>
          <tr>
            <td>{p.anticipos}</td>
            <td className="text-right"></td>
            <td className="text-right"></td>
            <td className="text-right"></td>
          </tr>
          <tr className="nomina-row-deducir">
            <td colSpan="3">{p.totalDeducir}</td>
            <td className="text-right">{formatCurrency(results.deductions.total)}</td>
          </tr>
          <tr className="nomina-row-liquido">
            <td colSpan="3">{p.liquidoTotal}</td>
            <td className="text-right" style={{ fontSize: '13px' }}>{formatCurrency(results.liquido)}</td>
          </tr>
        </tbody>
      </table>

      {/* Signatures */}
      <div className="nomina-signatures">
        <div>{p.firmaEmpleador}:</div>
        <div style={{ fontStyle: 'italic' }}>{p.fecha}: {monthName} {formData.periodYear}</div>
        <div>{p.recibi}:</div>
      </div>

      {/* Employer Costs Section */}
      <table className="nomina-table" style={{ marginTop: '8px' }}>
        <thead>
          <tr><th colSpan="5" className="nomina-section-header" style={{ textAlign: 'left' }}>{p.seccionEmpleador}</th></tr>
          <tr>
            <td colSpan="4" style={{ background: '#f8f9fb', padding: '5px 8px', fontSize: '10.5px' }}>{p.baseCotizacionTGSS}</td>
            <td className="text-right" style={{ fontWeight: 'bold', padding: '5px 8px', fontSize: '10.5px' }}>{formatCurrency(results.baseCotizacion)}</td>
          </tr>
          <tr>
            <th className="text-left">{p.concepto}</th>
            <th className="text-right">Base</th>
            <th className="text-right">{p.tiposBruto}</th>
            <th className="text-right">{p.bonificacion}</th>
            <th className="text-right" style={{ width: 120 }}>{p.cuotaNeta}</th>
          </tr>
        </thead>
        <tbody>
          {[
            { label: p.ccBonif, data: results.employerCosts.contingenciasComunes },
            { label: p.meiEmpleador + ` (${formatPercentage(results.employerCosts.mei.grossRate)})`, data: results.employerCosts.mei },
            { label: p.atep, data: results.employerCosts.atep },
            { label: p.desempleoBonif, data: results.employerCosts.desempleo },
            { label: p.fogasaBonif, data: results.employerCosts.fogasa },
          ].map((row, i) => (
            <tr key={i}>
              <td>{row.label}</td>
              <td className="text-right">{formatCurrency(results.baseCotizacion)}</td>
              <td className="text-right">{formatPercentage(row.data.grossRate)}</td>
              <td className="text-right">{row.data.bonusPercent > 0 ? formatPercentage(row.data.bonusPercent, 0) : '0%'}</td>
              <td className="text-right">{formatCurrency(row.data.netAmount)}</td>
            </tr>
          ))}
          <tr className="nomina-row-employer-total">
            <td colSpan="4">{p.totalCuotaEmpleador}</td>
            <td className="text-right">{formatCurrency(results.employerCosts.totalSS)}</td>
          </tr>
          <tr className="nomina-row-cargo">
            <td colSpan="4">{p.cargoBancario}</td>
            <td className="text-right">{formatCurrency(results.cargoBancarioSS)}</td>
          </tr>
          <tr className="nomina-row-coste">
            <td colSpan="4">{p.costeTotalEmpleador}</td>
            <td className="text-right">{formatCurrency(results.costeTotalEmpleador)}</td>
          </tr>
        </tbody>
      </table>

      {/* Footer */}
      <div className="nomina-footer">
        {monthName} {formData.periodYear} | CCC: {formData.employerCCC} | SS {formData.workerName.split(' ')[0]}: {formData.ssNumber}
      </div>
    </div>
  );
});

export default NominaPreview;
