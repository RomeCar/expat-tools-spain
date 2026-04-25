import jsPDF from 'jspdf';
import { PRESTACIONES, CONTRACT_TYPES } from '../config/bajaMedica';

const TEXT = [31, 41, 55];
const TEXT_SEC = [107, 114, 128];
const TEXT_MUTED = [156, 163, 175];
const ACCENT = [37, 99, 235];
const BORDER = [229, 231, 235];
const M = 18;
const PAGE_W = 210;
const W = PAGE_W - M * 2;

export function generateC133Pdf(data, t, language) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const f = t('bajaMedica.form');
  const r = f.review;
  let y = M;

  function setC(c) { doc.setTextColor(...c); }
  function setF(size, style = 'normal') { doc.setFontSize(size); doc.setFont('helvetica', style); }
  function tx(txt, x, yy, opts) { doc.text(String(txt || ''), x, yy, opts); }
  function ln(yy) { doc.setDrawColor(...BORDER); doc.setLineWidth(0.3); doc.line(M, yy, M + W, yy); }
  function checkPage(needed = 10) {
    if (y + needed > 285) { doc.addPage(); y = M; }
  }

  const prestacionLabel = (() => {
    const p = PRESTACIONES.find(x => x.code === data.prestacion);
    return p ? (language === 'en' ? p.en : p.es) : data.prestacion;
  })();
  const contractLabel = (() => {
    const c = CONTRACT_TYPES.find(x => x.code === data.contractType);
    return c ? (language === 'en' ? c.en : c.es) : data.contractType;
  })();

  // ── HEADER ──
  setC(TEXT); setF(16, 'bold');
  tx('MODELO C-133', M, y + 6);
  setC(ACCENT); setF(10, 'normal');
  tx(language === 'en'
    ? 'Employer Certificate — Domestic Workers (INSS) — Preparation Summary'
    : 'Certificado del Empleador — Empleados de Hogar (INSS) — Resumen', M, y + 12);
  setC(TEXT_MUTED); setF(8, 'normal');
  tx(`ExpatTools Spain — ${new Date().toLocaleDateString()}`, M + W, y + 6, { align: 'right' });
  y += 16;
  doc.setDrawColor(...ACCENT); doc.setLineWidth(0.5); doc.line(M, y, M + W, y);
  y += 8;

  function sectionTitle(title) {
    checkPage(12);
    setC(ACCENT); setF(10, 'bold');
    tx(title, M, y);
    y += 2;
    doc.setDrawColor(...ACCENT); doc.setLineWidth(0.4); doc.line(M, y, M + W, y);
    y += 6;
  }
  function row(label, value) {
    if (!value && value !== 0) return;
    checkPage(8);
    setC(TEXT_SEC); setF(8, 'normal');
    tx(label, M, y);
    setC(TEXT); setF(8, 'bold');
    const text = String(value);
    const split = doc.splitTextToSize(text, W * 0.55);
    tx(split, M + W, y, { align: 'right' });
    const h = Math.max(5, split.length * 3.5);
    ln(y + 2);
    y += h;
  }

  // Section 1: Prestación
  sectionTitle(r.section1);
  row(f.prestacion.title, prestacionLabel);
  y += 3;

  // Section 2: Employer
  sectionTitle(r.section2);
  row(f.employer.name, data.empName);
  row(f.employer.dni, data.empDni);
  row(f.employer.ccc, data.empCcc);
  const addrLine = [data.empVia, data.empNumero].filter(Boolean).join(' ');
  const addrDetail = [data.empBloque && `Bl. ${data.empBloque}`, data.empEscalera && `Esc. ${data.empEscalera}`, data.empPiso && `${data.empPiso}`, data.empPuerta && `Pta. ${data.empPuerta}`].filter(Boolean).join(', ');
  row(f.employer.address, addrLine + (addrDetail ? `, ${addrDetail}` : ''));
  row(`${f.employer.cp} / ${f.employer.localidad} / ${f.employer.provincia}`, [data.empCp, data.empLocalidad, data.empProvincia].filter(Boolean).join(', '));
  row(f.employer.telefono, data.empTelefono);
  y += 3;

  // Section 3: Worker
  sectionTitle(r.section3);
  row(f.worker.name, data.workName);
  row(f.worker.nss, data.workNss);
  row(f.worker.dni, data.workDni);
  row(f.worker.telefono, data.workTelefono);
  row(f.worker.contractTitle, contractLabel);
  if (data.tramo) row(f.worker.tramo, `Tramo ${data.tramo}`);
  row(f.worker.fechaInicio, data.fechaInicio);
  row(data.prestacion === 'NCM' ? f.worker.fechaInterrupcionNcm : f.worker.fechaInterrupcion, data.fechaInterrupcion);
  row(f.worker.fechaPrevistaFin, data.fechaPrevistaFin);
  if (data.prestacion === 'NCM') {
    row(f.worker.fechaInicioObligatorio, data.fechaInicioObligatorio);
    row(f.worker.fechaFinObligatorio, data.fechaFinObligatorio);
  }
  y += 3;

  // Section 4: Bases
  sectionTitle(r.section4);
  const months = language === 'en' ? t('common.months') : t('common.monthsES');
  data.bases.forEach((b) => {
    if (!b.anio && !b.mes && !b.base) return;
    const monthName = b.mes ? months[parseInt(b.mes, 10) - 1] || b.mes : '—';
    row(`${b.anio || '—'} · ${monthName} · ${b.dias || '—'} ${f.bases.daysShort}`, b.base ? `${b.base} EUR` : '—');
  });
  if (data.observaciones) {
    y += 2;
    row(f.bases.observaciones, data.observaciones);
  }
  y += 3;

  // Section 5: Signature
  checkPage(20);
  sectionTitle(r.section5);
  setC(TEXT_SEC); setF(8, 'normal');
  const firmaText = data.firmaLocalidad
    ? `${data.firmaLocalidad}, ${data.firmaDia || '__'} ${language === 'en' ? 'of' : 'de'} ${data.firmaMes || '__'} ${language === 'en' ? 'of' : 'de'} ${data.firmaAnio || '____'}`
    : (language === 'en' ? '________ , ___ of ________ of 20___' : '________ , ___ de ________ de 20___');
  tx(firmaText, M, y); y += 6;
  setC(TEXT_MUTED); setF(7.5, 'italic');
  tx(language === 'en' ? 'Employer signature: ____________________________' : 'Firma del empleador: ____________________________', M, y);
  y += 8;

  // Footer
  ln(y);
  y += 4;
  setC(TEXT_MUTED); setF(7, 'italic');
  const footer1 = language === 'en'
    ? 'This is a preparation summary, NOT the official C-133 form. File it via Sede Electronica de la Seguridad Social (sede.seg-social.gob.es) or print and submit signed at an INSS office.'
    : 'Esto es un resumen de preparacion, NO el formulario C-133 oficial. Presentalo en la Sede Electronica de la Seguridad Social (sede.seg-social.gob.es) o imprimelo firmado para entregarlo en una oficina del INSS.';
  const footerLines = doc.splitTextToSize(footer1, W);
  doc.text(footerLines, PAGE_W / 2, y, { align: 'center' });
  y += footerLines.length * 3.5 + 1;
  tx('ExpatTools Spain — expat-tools-spain.vercel.app', PAGE_W / 2, y, { align: 'center' });

  doc.save(`C133_${data.workName || 'Trabajador'}_${new Date().toISOString().slice(0, 10)}.pdf`);
}
