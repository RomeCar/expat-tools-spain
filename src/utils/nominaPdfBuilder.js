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
const M = 15;
const W = PAGE_W - M * 2;

export function generateNominaPdf(formData, results, t) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const lang = document.documentElement.lang || 'en';
  const isEN = lang === 'en';

  const pEN = en.nomina.preview;
  const pES = es.nomina.preview;
  // Primary language for main labels, secondary for subtitles
  const p1 = isEN ? pEN : pES;
  const p2 = isEN ? pES : null; // only show secondary when EN

  const monthsEN = en.common.months;
  const monthsES = es.common.months;
  const mi = parseInt(formData.periodMonth);
  const month1 = isEN ? monthsEN[mi] : monthsES[mi];
  const month2 = isEN ? monthsES[mi] : null;

  let y = M;

  function setC(c) { doc.setTextColor(...c); }
  function setF(size, style = 'normal') { doc.setFontSize(size); doc.setFont('helvetica', style); }
  function tx(txt, x, yy, opts) { doc.text(String(txt || ''), x, yy, opts); }
  function ln(y1, color = BORDER) {
    doc.setDrawColor(...color); doc.setLineWidth(0.3); doc.line(M, y1, M + W, y1);
  }
  function accentLn(y1) {
    doc.setDrawColor(...ACCENT); doc.setLineWidth(0.5); doc.line(M, y1, M + W, y1);
  }
  // Render main label + smaller Spanish subtitle below
  function biLabel(mainText, subText, x, yy) {
    setC(TEXT); setF(9, 'bold');
    tx(mainText, x, yy);
    if (p2 && subText) {
      setC(TEXT_MUTED); setF(6.5, 'italic');
      tx(subText, x, yy + 3);
    }
  }

  // ── HEADER ──
  setC(TEXT); setF(16, 'bold');
  tx(isEN ? 'PAYSLIP' : 'NOMINA', M, y + 5);
  if (p2) { setC(TEXT_MUTED); setF(8, 'italic'); tx('Nomina', M + 38, y + 5); }
  setC(TEXT_SEC); setF(11, 'normal');
  const headerDate = month2 ? `${month1} / ${month2} ${formData.periodYear}` : `${month1} ${formData.periodYear}`;
  tx(headerDate, M + W, y + 5, { align: 'right' });
  y += 8;
  accentLn(y);
  y += 8;

  // ── EMPLOYER / WORKER ──
  const halfW = W / 2 - 6;
  const rX = M + W / 2 + 6;

  function infoCol(x, w, title, subtitle, rows) {
    setC(ACCENT); setF(7.5, 'bold'); tx(title, x, y);
    if (subtitle) { setC(TEXT_MUTED); setF(6, 'italic'); tx(subtitle, x + doc.getTextWidth(title + ' ') - 1, y); }
    let iy = y + 4.5;
    for (const [label, value] of rows) {
      setC(TEXT_SEC); setF(7.5, 'normal'); tx(label, x, iy);
      setC(TEXT); tx(value || '', x + w, iy, { align: 'right' });
      iy += 4;
    }
    return iy;
  }

  const lEnd = infoCol(M, halfW, p1.employer, p2?.employer, [
    [p1.cifNie, formData.employerNif],
    [p1.address, formData.employerAddress],
    [p1.locality, formData.employerLocality],
    ['CCC', formData.employerCCC],
    [formData.employerName, ''],
  ]);
  infoCol(rX, halfW, p1.worker, p2?.worker, [
    [p1.nifNie, formData.workerNie],
    [p1.ssNumber, formData.ssNumber],
    [p1.category, formData.workerCategory],
    [p1.seniority, formData.workerSeniority],
    [formData.workerName, ''],
  ]);
  y = lEnd + 2;
  ln(y);
  y += 5;

  // ── PERIOD ──
  setC(TEXT_SEC); setF(8, 'normal');
  tx(`${p1.period}:`, M, y);
  setC(TEXT); setF(8, 'bold');
  tx(`${month1} ${formData.periodYear}`, M + 18, y);
  setC(TEXT_SEC); setF(8, 'normal');
  tx(`${formData.hoursPerMonth} h`, M + W / 2, y, { align: 'center' });
  tx(`30 ${p1.days}`, M + W, y, { align: 'right' });
  y += 3;
  ln(y);
  y += 7;

  // ── DEVENGOS ──
  biLabel(p1.devengos, p2?.devengos, M, y);
  y += (p2 ? 4.5 : 1.5);
  accentLn(y);
  y += 5;

  function dRow(label, value) {
    setC([75, 85, 99]); setF(8, 'normal');
    tx(label, M, y);
    setC(TEXT); tx(value, M + W, y, { align: 'right' });
    ln(y + 1.5, BORDER_LIGHT);
    y += 4.5;
  }

  dRow(p1.salarioMensual, formatCurrency(results.devengos.salarioBase));
  if (formData.pagasProrrateadas) {
    dRow(p1.pagaExtraJunio, formatCurrency(0));
    dRow(p1.pagaExtraDiciembre, formatCurrency(0));
  }
  if (results.devengos.pagaExtra > 0) {
    setC(TEXT); setF(8, 'bold');
    tx('Paga extra', M, y);
    tx(formatCurrency(results.devengos.pagaExtra), M + W, y, { align: 'right' });
    y += 4.5;
  }

  ln(y, [209, 213, 219]);
  y += 4;
  setC(TEXT); setF(9, 'bold');
  tx(p1.totalDevengado, M, y);
  tx(formatCurrency(results.devengos.totalDevengado), M + W, y, { align: 'right' });
  y += 7;

  // ── DEDUCCIONES ──
  biLabel(p1.deducciones, p2?.deducciones, M, y);
  y += (p2 ? 4.5 : 1.5);
  accentLn(y);
  y += 5;

  // Column positions
  const dC = [M, M + W * 0.55, M + W * 0.73, M + W];
  setC(TEXT_SEC); setF(7, 'bold');
  tx(p1.concepto, dC[0], y);
  tx(p1.baseCotiz, dC[1], y, { align: 'right' });
  tx(p1.tipo, dC[2], y, { align: 'right' });
  tx(p1.importe, dC[3], y, { align: 'right' });
  y += 1.5;
  ln(y);
  y += 4;

  function ddRow(label, base, rate, amount) {
    setC([75, 85, 99]); setF(8, 'normal');
    tx(label, dC[0], y);
    tx(base, dC[1], y, { align: 'right' });
    tx(rate, dC[2], y, { align: 'right' });
    setC(TEXT); tx(amount, dC[3], y, { align: 'right' });
    ln(y + 1.5, BORDER_LIGHT);
    y += 4.5;
  }

  ddRow(
    `${p1.ccMei} (${formatPercentage(results.deductions.ccPlusMeiRate)})`,
    formatCurrency(results.baseCotizacion),
    formatPercentage(results.deductions.ccPlusMeiRate),
    formatCurrency(results.deductions.ccPlusMei)
  );
  ddRow(
    `${p1.desempleo} (${formatPercentage(results.deductions.desempleoRate)})`,
    formatCurrency(results.baseCotizacion),
    formatPercentage(results.deductions.desempleoRate),
    formatCurrency(results.deductions.desempleo)
  );

  ln(y, [209, 213, 219]);
  y += 4;
  setC(TEXT); setF(9, 'bold');
  tx(p1.totalDeducir, M, y);
  tx(formatCurrency(results.deductions.total), M + W, y, { align: 'right' });
  y += 7;

  // ── HERO: NET PAY ──
  doc.setFillColor(...HERO_BG);
  doc.setDrawColor(...HERO_BORDER);
  doc.setLineWidth(0.3);
  doc.roundedRect(M, y, W, 14, 2, 2, 'FD');

  // Label on the left (primary language, compact)
  setC([30, 64, 175]); setF(7.5, 'bold');
  const heroLabel = isEN ? 'NET PAY (A - B)' : 'LIQUIDO (A - B)';
  tx(heroLabel, M + 5, y + 7);
  if (p2) {
    setC(TEXT_MUTED); setF(6, 'italic');
    tx(isEN ? 'Liquido total a percibir' : '', M + 5, y + 10.5);
  }

  // Amount on the right
  setC(HERO_TEXT); setF(18, 'bold');
  tx(formatCurrency(results.liquido), M + W - 5, y + 9, { align: 'right' });
  y += 18;

  // ── SIGNATURES ──
  setC(TEXT_SEC); setF(7, 'normal');
  tx(p1.firmaEmpleador, M, y + 3);
  tx(`${p1.fecha}: ${month1} ${formData.periodYear}`, PAGE_W / 2, y + 3, { align: 'center' });
  tx(p1.recibi, M + W, y + 3, { align: 'right' });
  doc.setDrawColor(...[209, 213, 219]); doc.setLineWidth(0.2);
  doc.line(M, y + 12, M + 40, y + 12);
  doc.line(PAGE_W / 2 - 15, y + 12, PAGE_W / 2 + 15, y + 12);
  doc.line(M + W - 40, y + 12, M + W, y + 12);
  y += 16;

  // ── SEPARATOR ──
  doc.setDrawColor(...[209, 213, 219]); doc.setLineWidth(0.2);
  doc.setLineDashPattern([1.5, 1.5], 0);
  doc.line(M, y, M + W, y);
  doc.setLineDashPattern([], 0);
  y += 5;

  // ── EMPLOYER COSTS ──
  setC(TEXT_MUTED); setF(8, 'bold');
  tx(p1.seccionEmpleador, M, y);
  if (p2) { setC(TEXT_MUTED); setF(5.5, 'italic'); tx(p2.seccionEmpleador, M, y + 3); y += 3; }
  y += 2;
  ln(y);
  y += 4;

  const eC = [M, M + W * 0.42, M + W * 0.58, M + W * 0.73, M + W];
  setC(TEXT_MUTED); setF(6.5, 'bold');
  tx(p1.concepto, eC[0], y);
  tx('Base', eC[1], y, { align: 'right' });
  tx(p1.tiposBruto, eC[2], y, { align: 'right' });
  tx(p1.bonificacion, eC[3], y, { align: 'right' });
  tx(p1.cuotaNeta, eC[4], y, { align: 'right' });
  y += 1.5;
  ln(y);
  y += 3.5;

  const empLines = [
    { label: p1.ccBonif, data: results.employerCosts.contingenciasComunes },
    { label: `${p1.meiEmpleador} (${formatPercentage(results.employerCosts.mei.grossRate)})`, data: results.employerCosts.mei },
    { label: p1.atep, data: results.employerCosts.atep },
    { label: p1.desempleoBonif, data: results.employerCosts.desempleo },
    { label: p1.fogasaBonif, data: results.employerCosts.fogasa },
  ];

  for (const row of empLines) {
    setC(TEXT_SEC); setF(7, 'normal');
    tx(row.label, eC[0], y);
    tx(formatCurrency(results.baseCotizacion), eC[1], y, { align: 'right' });
    tx(formatPercentage(row.data.grossRate), eC[2], y, { align: 'right' });
    tx(row.data.bonusPercent > 0 ? formatPercentage(row.data.bonusPercent, 0) : '-', eC[3], y, { align: 'right' });
    setC(TEXT); setF(7, 'normal');
    tx(formatCurrency(row.data.netAmount), eC[4], y, { align: 'right' });
    ln(y + 1.5, BORDER_LIGHT);
    y += 4;
  }

  y += 1;
  function eTotal(label, value, primary = false) {
    doc.setDrawColor(...(primary ? TEXT : [209, 213, 219]));
    doc.setLineWidth(primary ? 0.4 : 0.3);
    doc.line(M, y, M + W, y);
    y += 3.5;
    setC(primary ? TEXT : [75, 85, 99]);
    setF(primary ? 8.5 : 7.5, primary ? 'bold' : 'normal');
    tx(label, M, y);
    setF(primary ? 8.5 : 7.5, 'bold');
    tx(value, M + W, y, { align: 'right' });
    y += primary ? 5 : 4;
  }

  eTotal(p1.totalCuotaEmpleador, formatCurrency(results.employerCosts.totalSS));
  eTotal(p1.cargoBancario, formatCurrency(results.cargoBancarioSS));
  eTotal(p1.costeTotalEmpleador, formatCurrency(results.costeTotalEmpleador), true);

  // ── FOOTER ──
  y += 3;
  ln(y);
  y += 4;
  setC(TEXT_MUTED); setF(6.5, 'italic');
  tx(`${month1} ${formData.periodYear}  |  CCC: ${formData.employerCCC}  |  SS ${formData.workerName.split(' ')[0] || ''}: ${formData.ssNumber}`, PAGE_W / 2, y, { align: 'center' });

  const workerSlug = (formData.workerName || 'Worker').replace(/\s+/g, '_');
  doc.save(`Nomina_${workerSlug}_${month1}_${formData.periodYear}.pdf`);
}
