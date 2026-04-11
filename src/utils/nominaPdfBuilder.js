import jsPDF from 'jspdf';
import { formatCurrency, formatPercentage } from './formatters.js';
import en from '../i18n/en.json';
import es from '../i18n/es.json';

const TEXT = [31, 41, 55];
const TEXT_SEC = [107, 114, 128];
const TEXT_MUTED = [156, 163, 175];
const ACCENT = [37, 99, 235];
const HERO_BG = [239, 246, 255];
const HERO_BORDER = [191, 219, 254];
const HERO_TEXT = [30, 58, 138];
const BORDER = [229, 231, 235];
const BORDER_LIGHT = [243, 244, 246];

const PAGE_W = 210;
const PAGE_H = 297;
const M = 15; // margin
const W = PAGE_W - M * 2; // content width

export function generateNominaPdf(formData, results, t) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const lang = document.documentElement.lang || 'en';
  const isEN = lang === 'en';

  // Always load both languages for bilingual labels
  const pEN = en.nomina.preview;
  const pES = es.nomina.preview;
  const p = isEN ? pEN : pES;

  // Bilingual helper: "English / Espanol" when EN, just Spanish when ES
  function bi(enKey, esKey) {
    if (!isEN) return esKey || enKey;
    return `${enKey} / ${esKey}`;
  }

  const monthsEN = en.common.months;
  const monthsES = es.common.months;
  const monthIdx = parseInt(formData.periodMonth);
  const monthEN = monthsEN[monthIdx] || '';
  const monthES = monthsES[monthIdx] || '';
  const monthDisplay = isEN ? `${monthEN} / ${monthES}` : monthES;
  const monthName = isEN ? monthEN : monthES;

  let y = M;

  function setC(c) { doc.setTextColor(...c); }
  function setF(size, style = 'normal') { doc.setFontSize(size); doc.setFont('helvetica', style); }
  function tx(txt, x, yy, opts) { doc.text(String(txt || ''), x, yy, opts); }
  function ln(x1, y1, x2, y2, color = BORDER) {
    doc.setDrawColor(...color); doc.setLineWidth(0.3); doc.line(x1, y1, x2, y2);
  }
  function accentLn(x1, y1, x2, y2) {
    doc.setDrawColor(...ACCENT); doc.setLineWidth(0.5); doc.line(x1, y1, x2, y2);
  }

  // --- HEADER ---
  setC(TEXT); setF(16, 'bold');
  tx(bi('PAYSLIP', 'NOMINA'), M, y + 5);
  setC(TEXT_SEC); setF(11, 'normal');
  tx(monthDisplay + ' ' + formData.periodYear, M + W, y + 5, { align: 'right' });
  y += 8;
  accentLn(M, y, M + W, y);
  y += 8;

  // --- EMPLOYER / WORKER INFO ---
  const halfW = W / 2 - 6;
  const rX = M + W / 2 + 6;

  function infoCol(x, w, title, rows) {
    setC(ACCENT); setF(7, 'bold'); tx(title, x, y);
    let iy = y + 4;
    for (const [label, value] of rows) {
      setC(TEXT_SEC); setF(7.5, 'normal'); tx(label, x, iy);
      setC(TEXT); tx(value || '', x + w, iy, { align: 'right' });
      iy += 4;
    }
    return iy;
  }

  const lRows = [
    [bi(pEN.cifNie, pES.cifNie), formData.employerNif],
    [bi(pEN.address, pES.address), formData.employerAddress],
    [bi(pEN.locality, pES.locality), formData.employerLocality],
    [pEN.ccc, formData.employerCCC],
    [formData.employerName, ''],
  ];
  const rRows = [
    [bi(pEN.nifNie, pES.nifNie), formData.workerNie],
    [bi(pEN.ssNumber, pES.ssNumber), formData.ssNumber],
    [bi(pEN.category, pES.category), formData.workerCategory],
    [bi(pEN.seniority, pES.seniority), formData.workerSeniority],
    [formData.workerName, ''],
  ];

  const lEnd = infoCol(M, halfW, bi(pEN.employer, pES.employer), lRows);
  infoCol(rX, halfW, bi(pEN.worker, pES.worker), rRows);
  y = lEnd + 2;
  ln(M, y, M + W, y);
  y += 4;

  // --- PERIOD ---
  setC(TEXT_SEC); setF(8, 'normal');
  tx(`${bi(pEN.period, pES.period)}:`, M, y);
  setC(TEXT); setF(8, 'bold');
  tx(`${monthName} ${formData.periodYear}`, M + 28, y);
  setC(TEXT_SEC); setF(8, 'normal');
  tx(`${formData.hoursPerMonth} h`, M + W / 2, y, { align: 'center' });
  tx(`30 ${p.days}`, M + W, y, { align: 'right' });
  y += 3;
  ln(M, y, M + W, y);
  y += 6;

  // --- DEVENGOS ---
  setC(TEXT); setF(9, 'bold');
  tx(bi(pEN.devengos, pES.devengos), M, y);
  y += 1.5;
  accentLn(M, y, M + W, y);
  y += 5;

  function dRow(label, value, bold = false) {
    setC(bold ? TEXT : [75, 85, 99]); setF(8, bold ? 'bold' : 'normal');
    tx(label, M, y);
    setC(TEXT); setF(8, bold ? 'bold' : 'normal');
    tx(value, M + W, y, { align: 'right' });
    ln(M, y + 1.5, M + W, y + 1.5, BORDER_LIGHT);
    y += 4.5;
  }

  const salLabel = formData.pagasProrrateadas
    ? bi(pEN.salarioMensual, pES.salarioMensual)
    : bi(pEN.salarioMensualNoProrrateo, pES.salarioMensualNoProrrateo);
  dRow(salLabel, formatCurrency(results.devengos.salarioBase));

  if (formData.pagasProrrateadas) {
    dRow(bi(pEN.pagaExtraJunio, pES.pagaExtraJunio), formatCurrency(0));
    dRow(bi(pEN.pagaExtraDiciembre, pES.pagaExtraDiciembre), formatCurrency(0));
  }
  if (results.devengos.pagaExtra > 0) {
    dRow('Paga extra', formatCurrency(results.devengos.pagaExtra), true);
  }

  // Subtotal
  doc.setDrawColor(...[209, 213, 219]); doc.setLineWidth(0.3);
  doc.line(M, y, M + W, y);
  y += 4;
  setC(TEXT); setF(9, 'bold');
  tx(bi(pEN.totalDevengado, pES.totalDevengado), M, y);
  tx(formatCurrency(results.devengos.totalDevengado), M + W, y, { align: 'right' });
  y += 7;

  // --- DEDUCCIONES ---
  setC(TEXT); setF(9, 'bold');
  tx(bi(pEN.deducciones, pES.deducciones), M, y);
  y += 1.5;
  accentLn(M, y, M + W, y);
  y += 5;

  const dC = [M, M + W * 0.52, M + W * 0.7, M + W];
  setC(TEXT_SEC); setF(7, 'bold');
  tx(bi(pEN.concepto, pES.concepto), dC[0], y);
  tx(bi(pEN.baseCotiz, pES.baseCotiz), dC[1], y, { align: 'right' });
  tx(bi(pEN.tipo, pES.tipo), dC[2], y, { align: 'right' });
  tx(bi(pEN.importe, pES.importe), dC[3], y, { align: 'right' });
  y += 1.5;
  ln(M, y, M + W, y);
  y += 4;

  function ddRow(label, base, rate, amount) {
    setC([75, 85, 99]); setF(8, 'normal');
    tx(label, dC[0], y);
    tx(base, dC[1], y, { align: 'right' });
    tx(rate, dC[2], y, { align: 'right' });
    setC(TEXT); tx(amount, dC[3], y, { align: 'right' });
    ln(M, y + 1.5, M + W, y + 1.5, BORDER_LIGHT);
    y += 4.5;
  }

  ddRow(
    `${bi(pEN.ccMei, pES.ccMei)} (${formatPercentage(results.deductions.ccPlusMeiRate)})`,
    formatCurrency(results.baseCotizacion),
    formatPercentage(results.deductions.ccPlusMeiRate),
    formatCurrency(results.deductions.ccPlusMei)
  );
  ddRow(
    `${bi(pEN.desempleo, pES.desempleo)} (${formatPercentage(results.deductions.desempleoRate)})`,
    formatCurrency(results.baseCotizacion),
    formatPercentage(results.deductions.desempleoRate),
    formatCurrency(results.deductions.desempleo)
  );

  doc.setDrawColor(...[209, 213, 219]); doc.setLineWidth(0.3);
  doc.line(M, y, M + W, y);
  y += 4;
  setC(TEXT); setF(9, 'bold');
  tx(bi(pEN.totalDeducir, pES.totalDeducir), M, y);
  tx(formatCurrency(results.deductions.total), M + W, y, { align: 'right' });
  y += 7;

  // --- HERO: NET PAY ---
  doc.setFillColor(...HERO_BG);
  doc.setDrawColor(...HERO_BORDER);
  doc.setLineWidth(0.3);
  doc.roundedRect(M, y, W, 14, 2, 2, 'FD');
  setC([30, 64, 175]); setF(8, 'bold');
  tx(bi(pEN.liquidoTotal, pES.liquidoTotal), M + 6, y + 9);
  setC(HERO_TEXT); setF(16, 'bold');
  tx(formatCurrency(results.liquido), M + W - 6, y + 9.5, { align: 'right' });
  y += 18;

  // --- SIGNATURES ---
  setC(TEXT_SEC); setF(7, 'normal');
  tx(bi(pEN.firmaEmpleador, pES.firmaEmpleador), M, y + 3);
  tx(`${bi(pEN.fecha, pES.fecha)}: ${monthName} ${formData.periodYear}`, PAGE_W / 2, y + 3, { align: 'center' });
  tx(bi(pEN.recibi, pES.recibi), M + W, y + 3, { align: 'right' });
  doc.setDrawColor(...[209, 213, 219]); doc.setLineWidth(0.2);
  doc.line(M, y + 12, M + 40, y + 12);
  doc.line(PAGE_W / 2 - 15, y + 12, PAGE_W / 2 + 15, y + 12);
  doc.line(M + W - 40, y + 12, M + W, y + 12);
  y += 16;

  // --- SEPARATOR ---
  doc.setDrawColor(...[209, 213, 219]); doc.setLineWidth(0.2);
  doc.setLineDashPattern([1.5, 1.5], 0);
  doc.line(M, y, M + W, y);
  doc.setLineDashPattern([], 0);
  y += 5;

  // --- EMPLOYER COSTS ---
  setC(TEXT_MUTED); setF(8, 'bold');
  tx(bi(pEN.seccionEmpleador, pES.seccionEmpleador), M, y);
  y += 2;
  ln(M, y, M + W, y);
  y += 4;

  const eC = [M, M + W * 0.4, M + W * 0.56, M + W * 0.72, M + W];
  setC(TEXT_MUTED); setF(6.5, 'bold');
  tx(bi(pEN.concepto, pES.concepto), eC[0], y);
  tx('Base', eC[1], y, { align: 'right' });
  tx(bi(pEN.tiposBruto, pES.tiposBruto), eC[2], y, { align: 'right' });
  tx(bi(pEN.bonificacion, pES.bonificacion), eC[3], y, { align: 'right' });
  tx(bi(pEN.cuotaNeta, pES.cuotaNeta), eC[4], y, { align: 'right' });
  y += 1.5;
  ln(M, y, M + W, y);
  y += 3.5;

  const empLines = [
    { label: bi(pEN.ccBonif, pES.ccBonif), data: results.employerCosts.contingenciasComunes },
    { label: `${bi(pEN.meiEmpleador, pES.meiEmpleador)} (${formatPercentage(results.employerCosts.mei.grossRate)})`, data: results.employerCosts.mei },
    { label: bi(pEN.atep, pES.atep), data: results.employerCosts.atep },
    { label: bi(pEN.desempleoBonif, pES.desempleoBonif), data: results.employerCosts.desempleo },
    { label: bi(pEN.fogasaBonif, pES.fogasaBonif), data: results.employerCosts.fogasa },
  ];

  for (const row of empLines) {
    setC(TEXT_SEC); setF(7, 'normal');
    tx(row.label, eC[0], y);
    tx(formatCurrency(results.baseCotizacion), eC[1], y, { align: 'right' });
    tx(formatPercentage(row.data.grossRate), eC[2], y, { align: 'right' });
    tx(row.data.bonusPercent > 0 ? formatPercentage(row.data.bonusPercent, 0) : '-', eC[3], y, { align: 'right' });
    setC(TEXT); setF(7, 'normal');
    tx(formatCurrency(row.data.netAmount), eC[4], y, { align: 'right' });
    ln(M, y + 1.5, M + W, y + 1.5, BORDER_LIGHT);
    y += 4;
  }

  y += 1;
  function eTotal(label, value, primary = false) {
    doc.setDrawColor(...(primary ? TEXT : [209, 213, 219]));
    doc.setLineWidth(primary ? 0.4 : 0.3);
    doc.line(M, y, M + W, y);
    y += 3.5;
    setC(primary ? TEXT : [75, 85, 99]);
    setF(primary ? 9 : 8, primary ? 'bold' : 'normal');
    tx(label, M, y);
    setF(primary ? 9 : 8, 'bold');
    tx(value, M + W, y, { align: 'right' });
    y += primary ? 5 : 4;
  }

  eTotal(bi(pEN.totalCuotaEmpleador, pES.totalCuotaEmpleador), formatCurrency(results.employerCosts.totalSS));
  eTotal(bi(pEN.cargoBancario, pES.cargoBancario), formatCurrency(results.cargoBancarioSS));
  eTotal(bi(pEN.costeTotalEmpleador, pES.costeTotalEmpleador), formatCurrency(results.costeTotalEmpleador), true);

  // --- FOOTER ---
  y += 3;
  ln(M, y, M + W, y);
  y += 4;
  setC(TEXT_MUTED); setF(6.5, 'italic');
  const footer = `${monthName} ${formData.periodYear}  |  CCC: ${formData.employerCCC}  |  SS ${formData.workerName.split(' ')[0] || ''}: ${formData.ssNumber}`;
  tx(footer, PAGE_W / 2, y, { align: 'center' });

  const workerSlug = (formData.workerName || 'Worker').replace(/\s+/g, '_');
  doc.save(`Nomina_${workerSlug}_${monthName}_${formData.periodYear}.pdf`);
}
