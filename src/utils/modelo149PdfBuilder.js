import jsPDF from 'jspdf';
import { COMMON_COUNTRIES, calculateDeadline } from '../config/modelo149';

const TEXT = [31, 41, 55];
const TEXT_SEC = [107, 114, 128];
const TEXT_MUTED = [156, 163, 175];
const ACCENT = [37, 99, 235];
const BORDER = [229, 231, 235];
const M = 18;
const PAGE_W = 210;
const W = PAGE_W - M * 2;

export function generateModelo149Pdf(data, t, language) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const f = t('modelo149.form');
  const r = f.review;
  let y = M;

  function setC(c) { doc.setTextColor(...c); }
  function setF(size, style = 'normal') { doc.setFontSize(size); doc.setFont('helvetica', style); }
  function tx(txt, x, yy, opts) { doc.text(String(txt || ''), x, yy, opts); }
  function ln(yy) { doc.setDrawColor(...BORDER); doc.setLineWidth(0.3); doc.line(M, yy, M + W, yy); }

  const countryName = (code) => {
    const c = COMMON_COUNTRIES.find(x => x.code === code);
    return c ? (language === 'en' ? c.en : c.es) : code || '';
  };

  const purposeLabels = { option: f.purpose.option, renunciation: f.purpose.renunciation, exclusion: f.purpose.exclusion, endDisplacement: f.purpose.endDisplacement };
  const categoryLabels = { employment: f.situation.employment, director: f.situation.director, entrepreneur: f.situation.entrepreneur, professional: f.situation.professional, research: f.situation.research };
  const empTypeLabels = { newJob: f.situation.newJob, transfer: f.situation.transfer, remote: f.situation.remote };

  // ── HEADER ──
  setC(TEXT); setF(16, 'bold');
  tx('MODELO 149', M, y + 6);
  setC(ACCENT); setF(10, 'normal');
  tx(language === 'en' ? 'Beckham Law — Preparation Summary' : 'Ley Beckham — Resumen de Preparacion', M, y + 12);
  setC(TEXT_MUTED); setF(8, 'normal');
  tx(`ExpatTools Spain — ${new Date().toLocaleDateString()}`, M + W, y + 6, { align: 'right' });
  y += 16;
  doc.setDrawColor(...ACCENT); doc.setLineWidth(0.5); doc.line(M, y, M + W, y);
  y += 8;

  // ── Helpers ──
  function sectionTitle(title) {
    setC(ACCENT); setF(10, 'bold');
    tx(title, M, y);
    y += 2;
    doc.setDrawColor(...ACCENT); doc.setLineWidth(0.4); doc.line(M, y, M + W, y);
    y += 6;
  }

  function row(box, label, value) {
    if (!value) return;
    setC(ACCENT); setF(7.5, 'bold');
    if (box) tx(`Box ${box}`, M, y);
    setC(TEXT_SEC); setF(8, 'normal');
    tx(label, M + (box ? 18 : 0), y);
    setC(TEXT); setF(8, 'bold');
    tx(value, M + W, y, { align: 'right' });
    ln(y + 2);
    y += 5;
  }

  // ── Section 1: Taxpayer ──
  sectionTitle(r.section1);
  row('06/07', f.taxpayerType.title, data.taxpayerType === 'primary' ? f.taxpayerType.primary : f.taxpayerType.associated);
  row('01', f.details.nif, data.nif);
  row('02', f.details.apellidos, data.apellidos);
  row('03', f.details.nombre, data.nombre);
  row('05', f.details.telefonoMovil, data.telefonoMovil);
  if (data.taxpayerType === 'associated') {
    row('08', f.taxpayerType.primaryNif, data.primaryNif);
    row('09-10', f.taxpayerType.primaryName, data.primaryApellidos);
    row('11', f.taxpayerType.primaryRef, data.primaryM149Ref);
  }
  y += 3;

  // ── Section 2: Address ──
  sectionTitle(r.section2);
  const addr = [data.tipoVia, data.nombreVia, data.numero].filter(Boolean).join(' ');
  const addrDetail = [data.bloque, data.portal, data.escalera, data.planta, data.puerta].filter(Boolean).join(', ');
  row(null, f.details.addressTitle, addr + (addrDetail ? `, ${addrDetail}` : ''));
  row(null, f.details.codigoPostal, data.codigoPostal);
  row(null, f.details.municipio + ' / ' + f.details.provincia, `${data.municipio}, ${data.provincia}`);
  y += 3;

  // ── Section 3: Purpose ──
  sectionTitle(r.section3);
  row('31-34', f.purpose.title, purposeLabels[data.purpose]);
  if (data.purpose === 'option') row('32', f.purpose.docCode, data.docRegistrationCode);
  if (data.purpose === 'exclusion') {
    row('35', f.purpose.exclusionDate, data.exclusionDate);
    row('36', f.purpose.exclusionReason, data.exclusionReason);
  }
  if (data.purpose === 'endDisplacement') row('38', f.purpose.endDate, data.endDisplacementDate);
  y += 3;

  // ── Section 4: Situation & Dates ──
  sectionTitle(r.section4);
  if (data.taxpayerType === 'primary') {
    row('41-56', f.situation.categoryLabel, categoryLabels[data.category]);
    if (data.category === 'employment') {
      row('41-43', f.situation.empType, empTypeLabels[data.employmentType]);
      row('44', f.situation.employerNif, data.employerNif);
      row('45-46', f.situation.employerName, data.employerName);
    }
    if (data.category === 'director' || data.category === 'professional' || data.category === 'research') {
      row('49/57', f.situation.entityNif, data.entityNif);
      row('50/58', f.situation.entityName, data.entityName);
    }
  }
  if (data.taxpayerType === 'associated') {
    row('61-63', f.dates.associatedRelation, data.associatedType);
  }
  row('51', f.dates.entryDate, data.entryDate);
  row('52', f.dates.activityStart, data.activityStartDate);
  row('53', f.dates.lastResidence, countryName(data.lastTaxResidence));
  row('67', f.dates.nationality, countryName(data.nationality));
  y += 5;

  // ── Deadline Reminder ──
  const deadline = calculateDeadline(data.activityStartDate);
  if (deadline) {
    doc.setFillColor(239, 246, 255);
    doc.setDrawColor(191, 219, 254);
    doc.roundedRect(M, y, W, 12, 2, 2, 'FD');
    setC([30, 64, 175]); setF(9, 'bold');
    if (deadline.isExpired) {
      tx(language === 'en' ? 'DEADLINE EXPIRED — Consult a tax advisor immediately' : 'PLAZO VENCIDO — Consulta un asesor fiscal inmediatamente', M + 5, y + 7.5);
    } else {
      tx(`${language === 'en' ? 'Deadline' : 'Plazo'}: ${deadline.deadline.toLocaleDateString()} (${deadline.daysLeft} ${language === 'en' ? 'days left' : 'dias restantes'})`, M + 5, y + 7.5);
    }
    y += 16;
  }

  // ── Footer ──
  ln(y);
  y += 4;
  setC(TEXT_MUTED); setF(7, 'italic');
  tx(language === 'en'
    ? 'This is a preparation summary, NOT an official form. File the official Modelo 149 at sede.agenciatributaria.gob.es'
    : 'Esto es un resumen de preparacion, NO un formulario oficial. Presenta el Modelo 149 oficial en sede.agenciatributaria.gob.es',
    PAGE_W / 2, y, { align: 'center' });
  y += 4;
  tx('ExpatTools Spain — expat-tools-spain.vercel.app', PAGE_W / 2, y, { align: 'center' });

  doc.save(`Modelo149_Summary_${data.apellidos || 'Taxpayer'}_${new Date().toISOString().slice(0, 10)}.pdf`);
}
