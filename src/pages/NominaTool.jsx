import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { calculateNomina, CONSTANTS_2026 } from '../utils/nominaCalculator';
import { Download, ShieldCheck, FileText } from 'lucide-react';

export default function NominaTool() {
  const [formData, setFormData] = useState({
    employerName: 'John Doe',
    employerNif: 'Z1234567X',
    employerAddress: 'C/ Ejemplo 1, Madrid 28015',
    employerCCC: '0138 28 273492605',
    workerName: 'Maryorith Doe',
    workerNie: 'Y8326724W',
    ssNumber: '28 1604956579',
    workerCategory: 'Empleada de Hogar',
    workerSeniority: '01/12/2025',
    periodMonth: 'Marzo',
    periodYear: '2026',
    hoursPerMonth: '34.77',
    salarioBruto: 332.05,
    baseCotizacion: 296.00,
    pagasProrrateadas: true,
    includePagaExtra: false
  });

  const pdfRef = useRef();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const results = calculateNomina(formData);

  const formatCurrency = (val) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(val || 0);

  // If not prorated and including extra pay this month, we add the base salary again as "Paga Extra"
  // For simplicity, we assume the extra pay equals the base salary.
  const baseSalaryNum = parseFloat(formData.salarioBruto) || 0;
  const pagaExtraValue = (!formData.pagasProrrateadas && formData.includePagaExtra) ? baseSalaryNum : 0;
  const totalDevengado = baseSalaryNum + pagaExtraValue;

  // The deductions are calculated from the Base de Cotización, which the user provides statically.
  // The net salary needs to account for the total Devengado (which includes the extra pay if applicable).
  const netSalaryAdjusted = totalDevengado - results.deductions.total;

  const exportPDF = async () => {
    const element = pdfRef.current;
    
    // The element is already forced to look like a document, but let's ensure no scrollbars mess up the height
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, logging: false });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Nomina_${formData.workerName.replace(/\s+/g,'_')}_${formData.periodMonth}_${formData.periodYear}.pdf`);
    } catch (e) {
      console.error(e);
    }
  };

  // Professional Formal Styles matching the reference document
  const styles = {
    docContainer: {
      fontFamily: "'Arial', 'Helvetica', sans-serif",
      background: '#ffffff',
      color: '#000000',
      width: '100%',
      maxWidth: '210mm',
      margin: '0 auto',
      fontSize: '11px',
      border: '1px solid #ccc',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    },
    headerRow: { background: '#2B4261', color: '#ffffff', fontWeight: 'bold' },
    subHeaderRow: { background: '#44648A', color: '#ffffff', fontWeight: 'bold', padding: '4px 8px' },
    lightRow: { background: '#F8F9FA' },
    dataCell: { padding: '4px 8px', border: '1px solid #E2E8F0' },
    valueCell: { padding: '4px 8px', border: '1px solid #E2E8F0', textAlign: 'right' },
    labelDark: { background: '#2B4261', color: '#ffffff', padding: '4px 8px', fontWeight: 'bold' },
    valLight: { background: '#FDF7E5', color: '#000000', padding: '4px 8px', textAlign: 'right' },
    tealRow: { background: '#BCE3DF', color: '#000000', fontWeight: 'bold' }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Nómina Generator <span className="gradient-text">2026</span></h1>
        <p style={{ color: 'var(--text-secondary)' }}>Fill out the details, configure 12/14 payments, and export the formal PDF.</p>
      </div>

      <div className="grid-2-cols" style={{ gap: '2rem' }}>
        {/* Form Column - Made Compact */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem' }}>
            <FileText size={18} className="gradient-text" style={{ color: 'var(--accent-primary)' }}/> 
            Parameters
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="input-group" style={{ marginBottom: '0.5rem' }}>
              <label className="input-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Employer Name</label>
              <input type="text" name="employerName" className="input-field" style={{ padding: '0.5rem', fontSize: '0.875rem' }} value={formData.employerName} onChange={handleInputChange} />
            </div>
            <div className="input-group" style={{ marginBottom: '0.5rem' }}>
              <label className="input-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Employer NIF/NIE</label>
              <input type="text" name="employerNif" className="input-field" style={{ padding: '0.5rem', fontSize: '0.875rem' }} value={formData.employerNif} onChange={handleInputChange} />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="input-group" style={{ marginBottom: '0.5rem' }}>
              <label className="input-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Employer Address</label>
              <input type="text" name="employerAddress" className="input-field" style={{ padding: '0.5rem', fontSize: '0.875rem' }} value={formData.employerAddress} onChange={handleInputChange} />
            </div>
            <div className="input-group" style={{ marginBottom: '0.5rem' }}>
              <label className="input-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Employer CCC</label>
              <input type="text" name="employerCCC" className="input-field" style={{ padding: '0.5rem', fontSize: '0.875rem' }} value={formData.employerCCC} onChange={handleInputChange} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
            <div className="input-group" style={{ marginBottom: '0.5rem' }}>
              <label className="input-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Worker Name</label>
              <input type="text" name="workerName" className="input-field" style={{ padding: '0.5rem', fontSize: '0.875rem' }} value={formData.workerName} onChange={handleInputChange} />
            </div>
            <div className="input-group" style={{ marginBottom: '0.5rem' }}>
              <label className="input-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Worker NIE</label>
              <input type="text" name="workerNie" className="input-field" style={{ padding: '0.5rem', fontSize: '0.875rem' }} value={formData.workerNie} onChange={handleInputChange} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="input-group" style={{ marginBottom: '0.5rem' }}>
              <label className="input-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Nº Afiliación SS</label>
              <input type="text" name="ssNumber" className="input-field" style={{ padding: '0.5rem', fontSize: '0.875rem' }} value={formData.ssNumber} onChange={handleInputChange} />
            </div>
            <div className="input-group" style={{ marginBottom: '0.5rem' }}>
              <label className="input-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Seniority Date</label>
              <input type="text" name="workerSeniority" className="input-field" style={{ padding: '0.5rem', fontSize: '0.875rem' }} value={formData.workerSeniority} onChange={handleInputChange} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
            <div className="input-group" style={{ marginBottom: '0.5rem' }}>
              <label className="input-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Month</label>
              <input type="text" name="periodMonth" className="input-field" style={{ padding: '0.5rem', fontSize: '0.875rem' }} value={formData.periodMonth} onChange={handleInputChange} />
            </div>
            <div className="input-group" style={{ marginBottom: '0.5rem' }}>
              <label className="input-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Year</label>
              <input type="text" name="periodYear" className="input-field" style={{ padding: '0.5rem', fontSize: '0.875rem' }} value={formData.periodYear} onChange={handleInputChange} />
            </div>
            <div className="input-group" style={{ marginBottom: '0.5rem' }}>
              <label className="input-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Hours/mo</label>
              <input type="text" name="hoursPerMonth" className="input-field" style={{ padding: '0.5rem', fontSize: '0.875rem' }} value={formData.hoursPerMonth} onChange={handleInputChange} />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="input-group" style={{ marginBottom: '0.5rem' }}>
              <label className="input-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Salario Mensual (€)</label>
              <input type="number" step="0.01" name="salarioBruto" className="input-field" style={{ padding: '0.5rem', fontSize: '0.875rem' }} value={formData.salarioBruto} onChange={handleInputChange} />
            </div>
            <div className="input-group" style={{ marginBottom: '0.5rem' }}>
              <label className="input-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Base Cotización TGSS (€)</label>
              <input type="number" step="0.01" name="baseCotizacion" className="input-field" style={{ padding: '0.5rem', fontSize: '0.875rem' }} value={formData.baseCotizacion} onChange={handleInputChange} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
              <input type="checkbox" name="pagasProrrateadas" checked={formData.pagasProrrateadas} onChange={handleInputChange} style={{ accentColor: 'var(--accent-primary)' }}/>
              Pagas Extra Prorrateadas (12 Pagas)
            </label>
            {!formData.pagasProrrateadas && (
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', paddingLeft: '1.5rem', cursor: 'pointer' }}>
                <input type="checkbox" name="includePagaExtra" checked={formData.includePagaExtra} onChange={handleInputChange} style={{ accentColor: 'var(--accent-primary)' }}/>
                Incluir Paga Extra este mes (+100% salario)
              </label>
            )}
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button className="btn-primary" onClick={exportPDF} style={{ width: '100%', fontSize: '1rem', padding: '0.75rem' }}>
              <Download size={18} /> Export Formal PDF
            </button>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--success)', fontSize: '0.75rem' }}>
              <ShieldCheck size={14} /> Local browser processing
            </div>
          </div>
        </div>

        {/* Live Preview Column - Formal Redesign */}
        <div style={{ overflowX: 'auto', alignSelf: 'flex-start' }}>
          <div ref={pdfRef} style={styles.docContainer}>
             {/* Header */}
             <div style={{ ...styles.headerRow, padding: '12px', textAlign: 'center', fontSize: '16px', letterSpacing: '1px' }}>
                NÓMINA — {formData.periodMonth.toUpperCase()} {formData.periodYear}
             </div>

             {/* Personal Details */}
             <div style={{ display: 'flex', borderBottom: '2px solid #ffffff' }}>
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(100px, 30%) 70%' }}>
                   <div style={styles.labelDark}>EMPLEADOR/A</div><div style={styles.valLight}>{formData.employerName}</div>
                   <div style={styles.labelDark}>CIF/NIE</div><div style={styles.valLight}>{formData.employerNif}</div>
                   <div style={styles.labelDark}>DOMICILIO</div><div style={styles.valLight}>{formData.employerAddress}</div>
                   <div style={styles.labelDark}>CCC</div><div style={styles.valLight}>{formData.employerCCC}</div>
                </div>
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(100px, 30%) 70%' }}>
                   <div style={styles.labelDark}>TRABAJADOR/A</div><div style={styles.valLight}>{formData.workerName}</div>
                   <div style={styles.labelDark}>NIF/NIE</div><div style={styles.valLight}>{formData.workerNie}</div>
                   <div style={styles.labelDark}>Nº SS</div><div style={styles.valLight}>{formData.ssNumber}</div>
                   <div style={styles.labelDark}>CATEGORÍA</div><div style={styles.valLight}>{formData.workerCategory}</div>
                   <div style={styles.labelDark}>ANTIGÜEDAD</div><div style={styles.valLight}>{formData.workerSeniority}</div>
                </div>
             </div>

             {/* Period Bar */}
             <div style={{ display: 'flex', background: '#4A5568', color: '#ffffff', fontWeight: 'bold' }}>
                <div style={{ flex: 1, padding: '6px 12px', textAlign: 'center' }}>Período: {formData.periodMonth} {formData.periodYear}</div>
                <div style={{ padding: '6px 12px', background: '#2B4261', borderLeft: '1px solid #718096' }}>Horas/mes</div>
                <div style={{ padding: '6px 12px', background: '#FDF7E5', color: '#000', width: '80px', textAlign: 'center' }}>{formData.hoursPerMonth} h</div>
                <div style={{ padding: '6px 12px', background: '#FDF7E5', color: '#000', width: '80px', textAlign: 'center', borderLeft: '1px solid #E2E8F0' }}>30 días</div>
             </div>

             <table style={{ width: '100%', borderCollapse: 'collapse' }}>
               <thead>
                 <tr>
                   <th style={{ ...styles.headerRow, padding: '6px 12px', textAlign: 'center' }}>CONCEPTO</th>
                   <th style={{ ...styles.headerRow, padding: '6px 12px', textAlign: 'right', width: '120px' }}>IMPORTE</th>
                 </tr>
               </thead>
               <tbody>
                 <tr><td colSpan="2" style={styles.subHeaderRow}>I. DEVENGOS</td></tr>
                 <tr><td colSpan="2" style={{...styles.subHeaderRow, background: '#5C7C9E', fontSize: '10px'}}>1. Percepciones salariales</td></tr>
                 <tr>
                   <td style={styles.dataCell}>Salario mensual bruto {formData.pagasProrrateadas ? '(vacaciones + pagas extra prorrateadas)' : ''}</td>
                   <td style={styles.valueCell}>{formatCurrency(formData.salarioBruto)}</td>
                 </tr>
                 
                 <tr><td colSpan="2" style={{...styles.subHeaderRow, background: '#5C7C9E', fontSize: '10px'}}>Gratificaciones extraordinarias — (Pagas extra: {formData.pagasProrrateadas ? 'Prorrateadas' : (formData.includePagaExtra ? 'Sí 100%' : 'No')})</td></tr>
                 <tr>
                   <td style={styles.dataCell}>Paga extra {formData.includePagaExtra ? 'abonada en este periodo' : '(valor 0 aquí)'}</td>
                   <td style={styles.valueCell}>{formatCurrency(pagaExtraValue)}</td>
                 </tr>

                 <tr>
                   <td style={{ ...styles.dataCell, background: '#E2E8F0', fontWeight: 'bold', textAlign: 'right' }}>A. TOTAL DEVENGADO (Salario bruto total)</td>
                   <td style={{ ...styles.valueCell, fontWeight: 'bold', background: '#F8F9FA' }}>{formatCurrency(totalDevengado)}</td>
                 </tr>

                 <tr><td colSpan="2" style={styles.subHeaderRow}>II. DEDUCCIONES — Aportación trabajador/a a la Seguridad Social</td></tr>
               </tbody>
             </table>

             <table style={{ width: '100%', borderCollapse: 'collapse' }}>
               <thead>
                 <tr>
                   <th style={{ ...styles.headerRow, background: '#4A5568', padding: '4px 8px', textAlign: 'left' }}>Concepto</th>
                   <th style={{ ...styles.headerRow, background: '#4A5568', padding: '4px 8px', textAlign: 'right' }}>Base cotiz.</th>
                   <th style={{ ...styles.headerRow, background: '#4A5568', padding: '4px 8px', textAlign: 'right' }}>Tipo</th>
                   <th style={{ ...styles.headerRow, background: '#4A5568', padding: '4px 8px', textAlign: 'right', width: '120px' }}>Importe</th>
                 </tr>
               </thead>
               <tbody>
                 <tr>
                   <td style={styles.dataCell}>Contingencias comunes + MEI (4,70% + 0,15%)</td>
                   <td style={styles.valueCell}>{formatCurrency(formData.baseCotizacion)}</td>
                   <td style={styles.valueCell}>4,85%</td>
                   <td style={{ ...styles.valueCell }}>{formatCurrency(results.deductions.contingenciasComunes + results.deductions.mei)}</td>
                 </tr>
                 <tr>
                   <td style={styles.dataCell}>Desempleo (1,55%)</td>
                   <td style={styles.valueCell}>{formatCurrency(formData.baseCotizacion)}</td>
                   <td style={styles.valueCell}>1,55%</td>
                   <td style={{ ...styles.valueCell }}>{formatCurrency(results.deductions.desempleo)}</td>
                 </tr>
                 <tr>
                   <td style={{ ...styles.dataCell, background: '#64748B', color: '#fff', fontWeight: 'bold', textAlign: 'right' }} colSpan="3">B. TOTAL A DEDUCIR</td>
                   <td style={{ ...styles.valueCell, fontWeight: 'bold', background: '#F1F5F9' }}>{formatCurrency(results.deductions.total)}</td>
                 </tr>
                 <tr>
                   <td style={{ ...styles.tealRow, padding: '8px 12px', textAlign: 'right', textTransform: 'uppercase', color: '#ffffff', background: '#2D9C90' }} colSpan="3">
                     LÍQUIDO TOTAL A PERCIBIR (A - B) → TRANSFERIR A TRABAJADORA
                   </td>
                   <td style={{ ...styles.tealRow, padding: '8px 12px', textAlign: 'right', fontSize: '13px' }}>
                     {formatCurrency(netSalaryAdjusted)}
                   </td>
                 </tr>
               </tbody>
             </table>

             <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 24px', fontSize: '10px' }}>
               <div>Madrid, firma empleador/a:</div>
               <div style={{ fontStyle: 'italic' }}>Fecha: {formData.periodMonth} {formData.periodYear}</div>
               <div>Recibí:</div>
             </div>

             <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px' }}>
               <thead>
                 <tr><th colSpan="5" style={{...styles.subHeaderRow, background: '#2B4261', textAlign: 'left'}}>III. BASE COTIZACIÓN Y CUOTA EMPLEADOR/A → CARGO BANCARIO SS</th></tr>
                 <tr>
                   <td colSpan="4" style={{...styles.dataCell, background: '#F8F9FA'}}>Base de cotización mensual asignada por TGSS (tramo fijo)</td>
                   <td style={{...styles.valueCell, fontWeight: 'bold'}}>{formatCurrency(formData.baseCotizacion)}</td>
                 </tr>
                 <tr>
                   <th style={{ ...styles.headerRow, background: '#4A5568', padding: '4px 8px', textAlign: 'left' }}>Concepto</th>
                   <th style={{ ...styles.headerRow, background: '#4A5568', padding: '4px 8px', textAlign: 'right' }}>Base</th>
                   <th style={{ ...styles.headerRow, background: '#4A5568', padding: '4px 8px', textAlign: 'right' }}>Tipo bruto</th>
                   <th style={{ ...styles.headerRow, background: '#4A5568', padding: '4px 8px', textAlign: 'right' }}>Bonif.</th>
                   <th style={{ ...styles.headerRow, background: '#4A5568', padding: '4px 8px', textAlign: 'right', width: '120px' }}>Cuota neta</th>
                 </tr>
               </thead>
               <tbody>
                 <tr>
                   <td style={styles.dataCell}>Contingencias comunes (−20% bonif.)</td>
                   <td style={styles.valueCell}>{formatCurrency(formData.baseCotizacion)}</td>
                   <td style={styles.valueCell}>23,60%</td>
                   <td style={styles.valueCell}>20,00%</td>
                   <td style={styles.valueCell}>{formatCurrency(results.employerCosts.contingenciasComunes)}</td>
                 </tr>
                 <tr>
                   <td style={styles.dataCell}>MEI empleador/a (0,75%)</td>
                   <td style={styles.valueCell}>{formatCurrency(formData.baseCotizacion)}</td>
                   <td style={styles.valueCell}>0,75%</td>
                   <td style={styles.valueCell}>0,00%</td>
                   <td style={styles.valueCell}>{formatCurrency(results.employerCosts.mei)}</td>
                 </tr>
                 <tr>
                   <td style={styles.dataCell}>AT/EP (accidente trabajo)</td>
                   <td style={styles.valueCell}>{formatCurrency(formData.baseCotizacion)}</td>
                   <td style={styles.valueCell}>1,50%</td>
                   <td style={styles.valueCell}>0,00%</td>
                   <td style={styles.valueCell}>{formatCurrency(results.employerCosts.atep)}</td>
                 </tr>
                 <tr>
                   <td style={styles.dataCell}>Desempleo (−80% bonif.)</td>
                   <td style={styles.valueCell}>{formatCurrency(formData.baseCotizacion)}</td>
                   <td style={styles.valueCell}>5,50%</td>
                   <td style={styles.valueCell}>80,00%</td>
                   <td style={styles.valueCell}>{formatCurrency(results.employerCosts.desempleo)}</td>
                 </tr>
                 <tr>
                   <td style={styles.dataCell}>FOGASA (−80% bonif.)</td>
                   <td style={styles.valueCell}>{formatCurrency(formData.baseCotizacion)}</td>
                   <td style={styles.valueCell}>0,20%</td>
                   <td style={styles.valueCell}>80,00%</td>
                   <td style={styles.valueCell}>{formatCurrency(results.employerCosts.fogasa)}</td>
                 </tr>
                 <tr>
                   <td style={{ ...styles.dataCell, background: '#4A5568', color: '#fff', fontWeight: 'bold', textAlign: 'right', textTransform: 'uppercase' }} colSpan="4">TOTAL CUOTA EMPLEADOR/A (lo que paga el empleador a la SS)</td>
                   <td style={{ ...styles.valueCell, fontWeight: 'bold', background: '#F8F9FA' }}>{formatCurrency(results.employerCosts.totalSS)}</td>
                 </tr>
                 <tr>
                   <td style={{ ...styles.tealRow, padding: '6px 12px', textAlign: 'right', textTransform: 'uppercase', color: '#ffffff', background: '#2D9C90' }} colSpan="4">
                     CARGO BANCARIO SS  (empleador/a + trabajador/a  →  domiciliado IBAN empleador)
                   </td>
                   <td style={{ ...styles.tealRow, padding: '6px 12px', textAlign: 'right' }}>
                     {formatCurrency(results.employerCosts.totalSS + results.deductions.total)}
                   </td>
                 </tr>
                 <tr>
                   <td style={{ ...styles.headerRow, padding: '6px 12px', textAlign: 'right', textTransform: 'uppercase' }} colSpan="4">
                     COSTE TOTAL MENSUAL EMPLEADOR/A (salario bruto + cuota empleador SS)
                   </td>
                   <td style={{ ...styles.valueCell, padding: '6px 12px', textAlign: 'right', background: '#FDF7E5', fontWeight: 'bold' }}>
                     {formatCurrency(totalDevengado + results.employerCosts.totalSS)}
                   </td>
                 </tr>
               </tbody>
             </table>
             
             <div style={{ textAlign: 'center', margin: '12px 0 8px', fontSize: '9px', fontStyle: 'italic', color: '#718096' }}>
               {formData.periodMonth} {formData.periodYear} | CCC: {formData.employerCCC} | Nº SS {formData.workerName.split(' ')[0]}: {formData.ssNumber} | Transferencia salarial a IBAN:
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
