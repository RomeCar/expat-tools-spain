import jsPDF from 'jspdf';
import { formatCurrency, formatPercentage } from './formatters';

const NAVY = [30, 58, 95];       // #1e3a5f
const DARK_BLUE = [45, 74, 111]; // #2d4a6f
const GRAY = [61, 90, 128];      // #3d5a80
const TEAL = [26, 122, 109];     // #1a7a6d
const CREAM = [253, 247, 229];   // #FDF7E5
const LIGHT_GRAY = [248, 249, 251];
const WHITE = [255, 255, 255];
const BLACK = [0, 0, 0];

const PAGE_W = 210; // A4 width mm
const MARGIN = 12;
const CONTENT_W = PAGE_W - MARGIN * 2;
const ROW_H = 6;
const HEADER_H = 8;

export function generateNominaPdf(formData, results, t) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const months = t('common.months');
  const p = t('nomina.preview');
  const monthName = months[parseInt(formData.periodMonth)] || '';
  let y = MARGIN;

  // --- Helpers ---
  function setFont(size, style = 'normal') {
    doc.setFontSize(size);
    doc.setFont('helvetica', style);
  }

  function fillRect(x, yy, w, h, color) {
    doc.setFillColor(...color);
    doc.rect(x, yy, w, h, 'F');
  }

  function textAt(txt, x, yy, opts = {}) {
    doc.text(String(txt || ''), x, yy, opts);
  }

  function drawRow(cells, yy, height, bgColor, textColor, isBold) {
    fillRect(MARGIN, yy, CONTENT_W, height, bgColor);
    doc.setTextColor(...textColor);
    setFont(8, isBold ? 'bold' : 'normal');
    let x = MARGIN;
    for (const cell of cells) {
      const cellW = cell.w || (CONTENT_W / cells.length);
      if (cell.align === 'right') {
        textAt(cell.text, x + cellW - 2, yy + height / 2 + 1, { align: 'right' });
      } else {
        textAt(cell.text, x + 2, yy + height / 2 + 1);
      }
      x += cellW;
    }
    return yy + height;
  }

  // --- 1. HEADER ---
  fillRect(MARGIN, y, CONTENT_W, 11, NAVY);
  doc.setTextColor(...WHITE);
  setFont(13, 'bold');
  textAt(`${p.title}  \u2014  ${monthName.toUpperCase()} ${formData.periodYear}`, PAGE_W / 2, y + 7.5, { align: 'center' });
  y += 13;

  // --- 2. EMPLOYER / WORKER DATA ---
  const halfW = CONTENT_W / 2;
  const labelW = halfW * 0.3;
  const valW = halfW * 0.7;

  function drawDataRow(col, label, value, yy) {
    const baseX = MARGIN + col * halfW;
    fillRect(baseX, yy, labelW, ROW_H, NAVY);
    fillRect(baseX + labelW, yy, valW, ROW_H, CREAM);
    doc.setTextColor(...WHITE);
    setFont(7, 'bold');
    textAt(label, baseX + 1.5, yy + 4.2);
    doc.setTextColor(...BLACK);
    setFont(7, 'normal');
    textAt(value, baseX + labelW + 1.5, yy + 4.2);
  }

  const leftData = [
    [p.employer, formData.employerName],
    [p.cifNie, formData.employerNif],
    [p.address, formData.employerAddress],
    [p.locality, formData.employerLocality],
    [p.ccc, formData.employerCCC],
  ];
  const rightData = [
    [p.worker, formData.workerName],
    [p.nifNie, formData.workerNie],
    [p.ssNumber, formData.ssNumber],
    [p.category, formData.workerCategory],
    [p.seniority, formData.workerSeniority],
  ];

  for (let i = 0; i < 5; i++) {
    drawDataRow(0, leftData[i][0], leftData[i][1], y);
    drawDataRow(1, rightData[i][0], rightData[i][1], y);
    y += ROW_H;
  }
  y += 1;

  // --- 3. PERIOD BAR ---
  const periodParts = [
    { text: `${p.period}: ${monthName} ${formData.periodYear}`, w: CONTENT_W * 0.5, bg: GRAY },
    { text: p.hoursMonth, w: CONTENT_W * 0.15, bg: NAVY },
    { text: `${formData.hoursPerMonth} h`, w: CONTENT_W * 0.175, bg: CREAM, textColor: BLACK },
    { text: `30 ${p.days}`, w: CONTENT_W * 0.175, bg: CREAM, textColor: BLACK },
  ];
  let px = MARGIN;
  for (const part of periodParts) {
    fillRect(px, y, part.w, HEADER_H, part.bg);
    doc.setTextColor(...(part.textColor || WHITE));
    setFont(8, 'bold');
    textAt(part.text, px + part.w / 2, y + 5.5, { align: 'center' });
    px += part.w;
  }
  y += HEADER_H + 1;

  // --- 4. DEVENGOS TABLE ---
  // Header row
  y = drawRow([
    { text: p.concept, w: CONTENT_W - 30 },
    { text: p.amount, w: 30, align: 'right' },
  ], y, HEADER_H, GRAY, WHITE, true);

  // Section header
  y = drawRow([{ text: p.devengos, w: CONTENT_W }], y, ROW_H, DARK_BLUE, WHITE, true);

  // Subsection
  y = drawRow([{ text: p.percepcionesSalariales, w: CONTENT_W }], y, 5.5, [74, 109, 148], WHITE, true);

  // Salary row
  const salLabel = formData.pagasProrrateadas ? p.salarioMensual : p.salarioMensualNoProrrateo;
  y = drawRow([
    { text: salLabel, w: CONTENT_W - 30 },
    { text: formatCurrency(results.devengos.salarioBase), w: 30, align: 'right' },
  ], y, ROW_H, WHITE, BLACK, false);

  if (formData.pagasProrrateadas) {
    y = drawRow([{ text: `${p.gratificaciones} \u2014 (Prorrateadas)`, w: CONTENT_W }], y, 5.5, [74, 109, 148], WHITE, true);
    y = drawRow([
      { text: p.pagaExtraJunio, w: CONTENT_W - 30 },
      { text: formatCurrency(0), w: 30, align: 'right' },
    ], y, ROW_H, WHITE, BLACK, false);
    y = drawRow([
      { text: p.pagaExtraDiciembre, w: CONTENT_W - 30 },
      { text: formatCurrency(0), w: 30, align: 'right' },
    ], y, ROW_H, LIGHT_GRAY, BLACK, false);
  }

  if (results.devengos.pagaExtra > 0) {
    y = drawRow([
      { text: 'Paga extra abonada', w: CONTENT_W - 30 },
      { text: formatCurrency(results.devengos.pagaExtra), w: 30, align: 'right' },
    ], y, ROW_H, WHITE, BLACK, true);
  }

  // Non-salary
  y = drawRow([{ text: p.percepcionesNoSalariales, w: CONTENT_W }], y, 5.5, [74, 109, 148], WHITE, true);
  y = drawRow([
    { text: p.indemnizaciones, w: CONTENT_W - 30 },
    { text: '', w: 30, align: 'right' },
  ], y, ROW_H, WHITE, BLACK, false);

  // Total Devengado
  y = drawRow([
    { text: p.totalDevengado, w: CONTENT_W - 30, align: 'right' },
    { text: formatCurrency(results.devengos.totalDevengado), w: 30, align: 'right' },
  ], y, 7, [226, 232, 240], BLACK, true);

  y += 1;

  // --- 5. DEDUCCIONES TABLE ---
  y = drawRow([{ text: p.deducciones, w: CONTENT_W }], y, HEADER_H, DARK_BLUE, WHITE, true);

  const dedColW = [CONTENT_W * 0.42, CONTENT_W * 0.2, CONTENT_W * 0.15, CONTENT_W * 0.23];
  y = drawRow([
    { text: p.concepto, w: dedColW[0] },
    { text: p.baseCotiz, w: dedColW[1], align: 'right' },
    { text: p.tipo, w: dedColW[2], align: 'right' },
    { text: p.importe, w: dedColW[3], align: 'right' },
  ], y, ROW_H, GRAY, WHITE, true);

  // CC + MEI
  y = drawRow([
    { text: `${p.ccMei} (${formatPercentage(results.deductions.ccPlusMeiRate)})`, w: dedColW[0] },
    { text: formatCurrency(results.baseCotizacion), w: dedColW[1], align: 'right' },
    { text: formatPercentage(results.deductions.ccPlusMeiRate), w: dedColW[2], align: 'right' },
    { text: formatCurrency(results.deductions.ccPlusMei), w: dedColW[3], align: 'right' },
  ], y, ROW_H, WHITE, BLACK, false);

  // Desempleo
  y = drawRow([
    { text: `${p.desempleo} (${formatPercentage(results.deductions.desempleoRate)})`, w: dedColW[0] },
    { text: formatCurrency(results.baseCotizacion), w: dedColW[1], align: 'right' },
    { text: formatPercentage(results.deductions.desempleoRate), w: dedColW[2], align: 'right' },
    { text: formatCurrency(results.deductions.desempleo), w: dedColW[3], align: 'right' },
  ], y, ROW_H, LIGHT_GRAY, BLACK, false);

  // Anticipos
  y = drawRow([
    { text: p.anticipos, w: dedColW[0] },
    { text: '', w: dedColW[1], align: 'right' },
    { text: '', w: dedColW[2], align: 'right' },
    { text: '', w: dedColW[3], align: 'right' },
  ], y, ROW_H, WHITE, BLACK, false);

  // Total a deducir
  y = drawRow([
    { text: p.totalDeducir, w: CONTENT_W - 30, align: 'right' },
    { text: formatCurrency(results.deductions.total), w: 30, align: 'right' },
  ], y, 7, [74, 85, 104], WHITE, true);

  // LIQUIDO
  y = drawRow([
    { text: p.liquidoTotal, w: CONTENT_W - 35, align: 'right' },
    { text: formatCurrency(results.liquido), w: 35, align: 'right' },
  ], y, 9, TEAL, WHITE, true);

  y += 2;

  // --- 6. SIGNATURES ---
  doc.setTextColor(...BLACK);
  setFont(8, 'normal');
  textAt(`${p.firmaEmpleador}:`, MARGIN + 5, y + 4);
  textAt(`${p.fecha}: ${monthName} ${formData.periodYear}`, PAGE_W / 2, y + 4, { align: 'center' });
  textAt(`${p.recibi}:`, PAGE_W - MARGIN - 5, y + 4, { align: 'right' });

  // Signature lines
  doc.setDrawColor(180, 180, 180);
  doc.line(MARGIN + 5, y + 12, MARGIN + 50, y + 12);
  doc.line(PAGE_W / 2 - 20, y + 12, PAGE_W / 2 + 20, y + 12);
  doc.line(PAGE_W - MARGIN - 50, y + 12, PAGE_W - MARGIN - 5, y + 12);
  y += 16;

  // --- 7. EMPLOYER COSTS SECTION ---
  y = drawRow([{ text: p.seccionEmpleador, w: CONTENT_W }], y, HEADER_H, NAVY, WHITE, true);

  // Base cotiz row
  y = drawRow([
    { text: p.baseCotizacionTGSS, w: CONTENT_W - 30 },
    { text: formatCurrency(results.baseCotizacion), w: 30, align: 'right' },
  ], y, ROW_H, LIGHT_GRAY, BLACK, true);

  // Employer table header
  const empColW = [CONTENT_W * 0.34, CONTENT_W * 0.15, CONTENT_W * 0.15, CONTENT_W * 0.13, CONTENT_W * 0.23];
  y = drawRow([
    { text: p.concepto, w: empColW[0] },
    { text: 'Base', w: empColW[1], align: 'right' },
    { text: p.tiposBruto, w: empColW[2], align: 'right' },
    { text: p.bonificacion, w: empColW[3], align: 'right' },
    { text: p.cuotaNeta, w: empColW[4], align: 'right' },
  ], y, ROW_H, GRAY, WHITE, true);

  // Employer cost lines
  const empLines = [
    { label: p.ccBonif, data: results.employerCosts.contingenciasComunes },
    { label: `${p.meiEmpleador} (${formatPercentage(results.employerCosts.mei.grossRate)})`, data: results.employerCosts.mei },
    { label: p.atep, data: results.employerCosts.atep },
    { label: p.desempleoBonif, data: results.employerCosts.desempleo },
    { label: p.fogasaBonif, data: results.employerCosts.fogasa },
  ];

  for (let i = 0; i < empLines.length; i++) {
    const bg = i % 2 === 0 ? WHITE : LIGHT_GRAY;
    y = drawRow([
      { text: empLines[i].label, w: empColW[0] },
      { text: formatCurrency(results.baseCotizacion), w: empColW[1], align: 'right' },
      { text: formatPercentage(empLines[i].data.grossRate), w: empColW[2], align: 'right' },
      { text: empLines[i].data.bonusPercent > 0 ? formatPercentage(empLines[i].data.bonusPercent, 0) : '0%', w: empColW[3], align: 'right' },
      { text: formatCurrency(empLines[i].data.netAmount), w: empColW[4], align: 'right' },
    ], y, ROW_H, bg, BLACK, false);
  }

  // Total employer
  y = drawRow([
    { text: p.totalCuotaEmpleador, w: CONTENT_W - 30, align: 'right' },
    { text: formatCurrency(results.employerCosts.totalSS), w: 30, align: 'right' },
  ], y, 7, GRAY, WHITE, true);

  // Cargo bancario
  y = drawRow([
    { text: p.cargoBancario, w: CONTENT_W - 35, align: 'right' },
    { text: formatCurrency(results.cargoBancarioSS), w: 35, align: 'right' },
  ], y, 8, TEAL, WHITE, true);

  // Coste total
  fillRect(MARGIN, y, CONTENT_W - 30, 8, NAVY);
  fillRect(MARGIN + CONTENT_W - 30, y, 30, 8, CREAM);
  doc.setTextColor(...WHITE);
  setFont(7, 'bold');
  textAt(p.costeTotalEmpleador, MARGIN + CONTENT_W - 32, y + 5.5, { align: 'right' });
  doc.setTextColor(...BLACK);
  setFont(8, 'bold');
  textAt(formatCurrency(results.costeTotalEmpleador), MARGIN + CONTENT_W - 2, y + 5.5, { align: 'right' });
  y += 10;

  // --- 8. FOOTER ---
  doc.setTextColor(113, 128, 150);
  setFont(7, 'italic');
  const footer = `${monthName} ${formData.periodYear}  |  CCC: ${formData.employerCCC}  |  SS ${formData.workerName.split(' ')[0] || ''}: ${formData.ssNumber}`;
  textAt(footer, PAGE_W / 2, y + 3, { align: 'center' });

  // Save
  const workerSlug = (formData.workerName || 'Worker').replace(/\s+/g, '_');
  doc.save(`Nomina_${workerSlug}_${monthName}_${formData.periodYear}.pdf`);
}
