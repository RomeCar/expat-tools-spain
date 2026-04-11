import jsPDF from 'jspdf';
import { formatCurrency, formatPercentage } from './formatters.js';

// Clean color palette
const TEXT = [31, 41, 55];        // #1f2937
const TEXT_SEC = [107, 114, 128]; // #6b7280
const TEXT_MUTED = [156, 163, 175]; // #9ca3af
const ACCENT = [37, 99, 235];    // #2563eb
const HERO_BG = [239, 246, 255]; // #eff6ff
const HERO_BORDER = [191, 219, 254]; // #bfdbfe
const HERO_TEXT = [30, 58, 138]; // #1e3a8a
const BORDER = [229, 231, 235];  // #e5e7eb
const BORDER_LIGHT = [243, 244, 246]; // #f3f4f6
const WHITE = [255, 255, 255];

const PAGE_W = 210;
const MARGIN = 20;
const CONTENT_W = PAGE_W - MARGIN * 2;

export function generateNominaPdf(formData, results, t) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const months = t('common.months');
  const p = t('nomina.preview');
  const monthName = months[parseInt(formData.periodMonth)] || '';
  let y = MARGIN;

  function setColor(c) { doc.setTextColor(...c); }
  function setFont(size, style = 'normal') { doc.setFontSize(size); doc.setFont('helvetica', style); }
  function text(txt, x, yy, opts) { doc.text(String(txt || ''), x, yy, opts); }
  function line(x1, y1, x2, y2, color = BORDER) {
    doc.setDrawColor(...color);
    doc.setLineWidth(0.3);
    doc.line(x1, y1, x2, y2);
  }
  function thickLine(x1, y1, x2, y2, color = ACCENT) {
    doc.setDrawColor(...color);
    doc.setLineWidth(0.6);
    doc.line(x1, y1, x2, y2);
  }

  // --- 1. HEADER ---
  setColor(TEXT);
  setFont(18, 'bold');
  text(p.title, MARGIN, y + 6);
  setColor(TEXT_SEC);
  setFont(13, 'normal');
  text(`${monthName} ${formData.periodYear}`, MARGIN + CONTENT_W, y + 6, { align: 'right' });
  y += 10;
  thickLine(MARGIN, y, MARGIN + CONTENT_W, y, ACCENT);
  y += 12;

  // --- 2. EMPLOYER / WORKER INFO ---
  const halfW = CONTENT_W / 2 - 8;
  const rightX = MARGIN + CONTENT_W / 2 + 8;

  function drawInfoCol(x, w, title, rows) {
    setColor(ACCENT);
    setFont(8, 'bold');
    text(title, x, y);
    let iy = y + 5;
    for (const [label, value] of rows) {
      setColor(TEXT_SEC);
      setFont(8, 'normal');
      text(label, x, iy);
      setColor(TEXT);
      setFont(8, 'normal');
      text(value || '', x + w, iy, { align: 'right' });
      iy += 5;
    }
    return iy;
  }

  const leftRows = [
    [p.cifNie, formData.employerNif],
    [p.address, formData.employerAddress],
    [p.locality, formData.employerLocality],
    [p.ccc, formData.employerCCC],
    [formData.employerName, ''],
  ];
  const rightRows = [
    [p.nifNie, formData.workerNie],
    [p.ssNumber, formData.ssNumber],
    [p.category, formData.workerCategory],
    [p.seniority, formData.workerSeniority],
    [formData.workerName, ''],
  ];

  const leftEnd = drawInfoCol(MARGIN, halfW, p.employer, leftRows);
  drawInfoCol(rightX, halfW, p.worker, rightRows);
  y = leftEnd + 4;
  line(MARGIN, y, MARGIN + CONTENT_W, y);
  y += 6;

  // --- 3. PERIOD LINE ---
  setColor(TEXT_SEC);
  setFont(9, 'normal');
  text(`${p.period}: `, MARGIN, y);
  setColor(TEXT);
  setFont(9, 'bold');
  text(`${monthName} ${formData.periodYear}`, MARGIN + 22, y);
  setColor(TEXT_SEC);
  setFont(9, 'normal');
  text(`${formData.hoursPerMonth} h / ${p.hoursMonth}`, MARGIN + CONTENT_W / 2, y, { align: 'center' });
  text(`30 ${p.days}`, MARGIN + CONTENT_W, y, { align: 'right' });
  y += 4;
  line(MARGIN, y, MARGIN + CONTENT_W, y);
  y += 10;

  // --- 4. DEVENGOS ---
  setColor(TEXT);
  setFont(10, 'bold');
  text(p.devengos, MARGIN, y);
  y += 2;
  thickLine(MARGIN, y, MARGIN + CONTENT_W, y, ACCENT);
  y += 7;

  function dataRow(label, value, bold = false) {
    setColor(bold ? TEXT : [75, 85, 99]);
    setFont(9, bold ? 'bold' : 'normal');
    text(label, MARGIN, y);
    setColor(TEXT);
    setFont(9, bold ? 'bold' : 'normal');
    text(value, MARGIN + CONTENT_W, y, { align: 'right' });
    line(MARGIN, y + 2, MARGIN + CONTENT_W, y + 2, BORDER_LIGHT);
    y += 6;
  }

  const salLabel = formData.pagasProrrateadas ? p.salarioMensual : p.salarioMensualNoProrrateo;
  dataRow(salLabel, formatCurrency(results.devengos.salarioBase));

  if (formData.pagasProrrateadas) {
    dataRow(p.pagaExtraJunio, formatCurrency(0));
    dataRow(p.pagaExtraDiciembre, formatCurrency(0));
  }
  if (results.devengos.pagaExtra > 0) {
    dataRow('Paga extra abonada', formatCurrency(results.devengos.pagaExtra), true);
  }

  // Subtotal
  y += 1;
  doc.setDrawColor(...[209, 213, 219]);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y, MARGIN + CONTENT_W, y);
  y += 5;
  setColor(TEXT);
  setFont(10, 'bold');
  text(p.totalDevengado, MARGIN, y);
  text(formatCurrency(results.devengos.totalDevengado), MARGIN + CONTENT_W, y, { align: 'right' });
  y += 10;

  // --- 5. DEDUCCIONES ---
  setColor(TEXT);
  setFont(10, 'bold');
  text(p.deducciones, MARGIN, y);
  y += 2;
  thickLine(MARGIN, y, MARGIN + CONTENT_W, y, ACCENT);
  y += 7;

  // Header row
  const dedCols = [MARGIN, MARGIN + CONTENT_W * 0.5, MARGIN + CONTENT_W * 0.68, MARGIN + CONTENT_W];
  setColor(TEXT_SEC);
  setFont(8, 'bold');
  text(p.concepto, dedCols[0], y);
  text(p.baseCotiz, dedCols[1], y, { align: 'right' });
  text(p.tipo, dedCols[2], y, { align: 'right' });
  text(p.importe, dedCols[3], y, { align: 'right' });
  y += 2;
  line(MARGIN, y, MARGIN + CONTENT_W, y);
  y += 5;

  function dedRow(label, base, rate, amount) {
    setColor([75, 85, 99]);
    setFont(9, 'normal');
    text(label, dedCols[0], y);
    text(base, dedCols[1], y, { align: 'right' });
    text(rate, dedCols[2], y, { align: 'right' });
    setColor(TEXT);
    text(amount, dedCols[3], y, { align: 'right' });
    line(MARGIN, y + 2, MARGIN + CONTENT_W, y + 2, BORDER_LIGHT);
    y += 6;
  }

  dedRow(
    `${p.ccMei} (${formatPercentage(results.deductions.ccPlusMeiRate)})`,
    formatCurrency(results.baseCotizacion),
    formatPercentage(results.deductions.ccPlusMeiRate),
    formatCurrency(results.deductions.ccPlusMei)
  );
  dedRow(
    `${p.desempleo} (${formatPercentage(results.deductions.desempleoRate)})`,
    formatCurrency(results.baseCotizacion),
    formatPercentage(results.deductions.desempleoRate),
    formatCurrency(results.deductions.desempleo)
  );

  // Subtotal
  y += 1;
  doc.setDrawColor(...[209, 213, 219]);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y, MARGIN + CONTENT_W, y);
  y += 5;
  setColor(TEXT);
  setFont(10, 'bold');
  text(p.totalDeducir, MARGIN, y);
  text(formatCurrency(results.deductions.total), MARGIN + CONTENT_W, y, { align: 'right' });
  y += 10;

  // --- 6. HERO: NET PAY ---
  doc.setFillColor(...HERO_BG);
  doc.setDrawColor(...HERO_BORDER);
  doc.setLineWidth(0.3);
  doc.roundedRect(MARGIN, y, CONTENT_W, 18, 3, 3, 'FD');
  setColor([30, 64, 175]); // #1e40af
  setFont(10, 'bold');
  text(p.liquidoTotal, MARGIN + 10, y + 11);
  setColor(HERO_TEXT);
  setFont(20, 'bold');
  text(formatCurrency(results.liquido), MARGIN + CONTENT_W - 10, y + 12, { align: 'right' });
  y += 24;

  // --- 7. SIGNATURES ---
  setColor(TEXT_SEC);
  setFont(8, 'normal');
  text(p.firmaEmpleador, MARGIN, y + 4);
  text(`${p.fecha}: ${monthName} ${formData.periodYear}`, PAGE_W / 2, y + 4, { align: 'center' });
  text(p.recibi, MARGIN + CONTENT_W, y + 4, { align: 'right' });
  doc.setDrawColor(...[209, 213, 219]);
  doc.setLineWidth(0.2);
  doc.line(MARGIN, y + 16, MARGIN + 45, y + 16);
  doc.line(PAGE_W / 2 - 18, y + 16, PAGE_W / 2 + 18, y + 16);
  doc.line(MARGIN + CONTENT_W - 45, y + 16, MARGIN + CONTENT_W, y + 16);
  y += 22;

  // --- 8. SEPARATOR ---
  doc.setDrawColor(...[209, 213, 219]);
  doc.setLineWidth(0.2);
  doc.setLineDashPattern([2, 2], 0);
  doc.line(MARGIN, y, MARGIN + CONTENT_W, y);
  doc.setLineDashPattern([], 0);
  y += 8;

  // --- 9. EMPLOYER COSTS (secondary) ---
  setColor(TEXT_MUTED);
  setFont(9, 'bold');
  text(p.seccionEmpleador, MARGIN, y);
  y += 3;
  line(MARGIN, y, MARGIN + CONTENT_W, y);
  y += 6;

  // Header
  const empCols = [MARGIN, MARGIN + CONTENT_W * 0.38, MARGIN + CONTENT_W * 0.55, MARGIN + CONTENT_W * 0.72, MARGIN + CONTENT_W];
  setColor(TEXT_MUTED);
  setFont(7, 'bold');
  text(p.concepto, empCols[0], y);
  text('Base', empCols[1], y, { align: 'right' });
  text(p.tiposBruto, empCols[2], y, { align: 'right' });
  text(p.bonificacion, empCols[3], y, { align: 'right' });
  text(p.cuotaNeta, empCols[4], y, { align: 'right' });
  y += 2;
  line(MARGIN, y, MARGIN + CONTENT_W, y);
  y += 4.5;

  const empLines = [
    { label: p.ccBonif, data: results.employerCosts.contingenciasComunes },
    { label: `${p.meiEmpleador} (${formatPercentage(results.employerCosts.mei.grossRate)})`, data: results.employerCosts.mei },
    { label: p.atep, data: results.employerCosts.atep },
    { label: p.desempleoBonif, data: results.employerCosts.desempleo },
    { label: p.fogasaBonif, data: results.employerCosts.fogasa },
  ];

  for (const row of empLines) {
    setColor(TEXT_SEC);
    setFont(8, 'normal');
    text(row.label, empCols[0], y);
    text(formatCurrency(results.baseCotizacion), empCols[1], y, { align: 'right' });
    text(formatPercentage(row.data.grossRate), empCols[2], y, { align: 'right' });
    text(row.data.bonusPercent > 0 ? formatPercentage(row.data.bonusPercent, 0) : '-', empCols[3], y, { align: 'right' });
    setColor(TEXT);
    setFont(8, 'normal');
    text(formatCurrency(row.data.netAmount), empCols[4], y, { align: 'right' });
    line(MARGIN, y + 2, MARGIN + CONTENT_W, y + 2, BORDER_LIGHT);
    y += 5;
  }

  // Totals
  y += 2;
  function empTotal(label, value, isPrimary = false) {
    if (isPrimary) {
      doc.setDrawColor(...TEXT);
      doc.setLineWidth(0.5);
      doc.line(MARGIN, y, MARGIN + CONTENT_W, y);
      y += 5;
      setColor(TEXT);
      setFont(10, 'bold');
    } else {
      doc.setDrawColor(...[209, 213, 219]);
      doc.setLineWidth(0.3);
      doc.line(MARGIN, y, MARGIN + CONTENT_W, y);
      y += 4;
      setColor([75, 85, 99]);
      setFont(9, 'normal');
    }
    text(label, MARGIN, y);
    setFont(isPrimary ? 10 : 9, isPrimary ? 'bold' : 'bold');
    text(value, MARGIN + CONTENT_W, y, { align: 'right' });
    y += isPrimary ? 6 : 5;
  }

  empTotal(p.totalCuotaEmpleador, formatCurrency(results.employerCosts.totalSS));
  empTotal(p.cargoBancario, formatCurrency(results.cargoBancarioSS));
  empTotal(p.costeTotalEmpleador, formatCurrency(results.costeTotalEmpleador), true);

  // --- 10. FOOTER ---
  y += 4;
  line(MARGIN, y, MARGIN + CONTENT_W, y);
  y += 5;
  setColor(TEXT_MUTED);
  setFont(7, 'italic');
  const footer = `${monthName} ${formData.periodYear}  |  CCC: ${formData.employerCCC}  |  SS ${formData.workerName.split(' ')[0] || ''}: ${formData.ssNumber}`;
  text(footer, PAGE_W / 2, y, { align: 'center' });

  // Save
  const workerSlug = (formData.workerName || 'Worker').replace(/\s+/g, '_');
  doc.save(`Nomina_${workerSlug}_${monthName}_${formData.periodYear}.pdf`);
}
