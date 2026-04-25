// Fills the OFFICIAL C-133 PDF (Certificado del Empleador, Sistema Especial de
// Empleados de Hogar) with data from the wizard. The template at
// public/c133-form-template.pdf is the official form from seg-social.es,
// pre-cleaned with `qpdf --decrypt --object-streams=disable` so pdf-lib can
// read its 90 AcroForm fields. The output is the official PDF with values
// pre-filled — print, sign by hand, submit to INSS.

import { PDFDocument } from 'pdf-lib';
import { PRESTACIONES, CONTRACT_TYPES } from '../config/bajaMedica';

const TEMPLATE_URL = '/c133-form-template.pdf';

// Spanish month names — the form's signature line shows "a __ de [mes] de 20__"
const MESES_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

// Spanish prestation labels (always Spanish on the official form, regardless of UI language)
const PRESTACION_LABELS_ES = Object.fromEntries(PRESTACIONES.map(p => [p.code, p.es]));

// Helpers
const truncate = (str, max) => (str == null ? '' : String(str).slice(0, max));
const safe = (form, name, fn) => {
  try { fn(form.getTextField(name)); }
  catch (e) {
    // Field name may have shifted in a future revision — fail soft.
    if (typeof console !== 'undefined') console.warn(`[c133Filler] couldn't set field "${name}":`, e.message);
  }
};
const setText = (form, name, value, max) => safe(form, name, f => f.setText(truncate(value, max ?? 9999)));
// "YYYY-MM-DD" → "DD/MM/YYYY" (the format of the official form's date fields)
const dateDmY = (iso) => {
  if (!iso || typeof iso !== 'string') return '';
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
};

export async function generateOfficialC133Pdf(data) {
  const res = await fetch(TEMPLATE_URL);
  if (!res.ok) throw new Error(`Failed to fetch C-133 template: ${res.status}`);
  const bytes = await res.arrayBuffer();
  const pdf = await PDFDocument.load(bytes);
  const form = pdf.getForm();

  // Section 1: Header — empleador identity + which prestation is being requested
  const empFullName = data.empName || '';
  setText(form, '1.1 Nom_ape', empFullName, 99);
  setText(form, '1.2 Dni_ Nie', data.empDni, 15);
  setText(form, '1.3 Cer_pres', PRESTACION_LABELS_ES[data.prestacion] || '', 50);

  // Section 2: Datos del Empleador
  setText(form, '2.1 Ape_nom', empFullName, 99);
  setText(form, '2.2 Cód_ coti', data.empCcc, 12);
  setText(form, '2.3  Dom_ hab', data.empVia, 75);
  setText(form, '2.4 Núm', data.empNumero, 7);
  setText(form, '2.5 Blo', data.empBloque, 4);
  setText(form, '2.6 Esc', data.empEscalera, 5);
  setText(form, '2.7 Piso', data.empPiso, 2);
  setText(form, '2.8 Pue', data.empPuerta, 3);
  setText(form, '2.9 Cód_ posl', data.empCp, 10);
  setText(form, '2.10 Loc', data.empLocalidad, 34);
  setText(form, '2.11 Pro', data.empProvincia, 25);
  setText(form, '2.12 Tel', data.empTelefono, 13);

  // Section 3: Datos del Trabajador/a
  setText(form, '3.1 Ape_nom', data.workName, 99);
  setText(form, '3.2 Núm_SS', data.workNss, 13);
  setText(form, '3.3 Dni_Nie', data.workDni, 15);
  setText(form, '3.4  Tel', data.workTelefono, 13);
  setText(form, '3.6 Tra_cot', data.tramo, 2);
  setText(form, '3.7  Fec_ini', dateDmY(data.fechaInicio), 10);
  setText(form, '3.8  Fec_int', dateDmY(data.fechaInterrupcion), 10);
  setText(form, '3.9 Fec_fin', dateDmY(data.fechaPrevistaFin), 10);

  // Contract type checkbox — the form has a single checkbox; checked = tiempo parcial / fijo discontinuo
  try {
    const cb = form.getCheckBox('3.5 Tip_con');
    if (data.contractType === 'parcial') cb.check();
    else cb.uncheck();
  } catch (e) {
    if (typeof console !== 'undefined') console.warn('[c133Filler] contract checkbox missing:', e.message);
  }

  // Nacimiento-only date fields — only fill when the prestation is NCM
  if (data.prestacion === 'NCM') {
    setText(form, '3.10 Fec-Ini', dateDmY(data.fechaInicioObligatorio), 10);
    setText(form, '3.11 Fec-fin', dateDmY(data.fechaFinObligatorio), 10);
    setText(form, '3.12 Fec-Iini', dateDmY(data.fechaInicioSiguiente1), 10);
    setText(form, '3.13 Fec-fin', dateDmY(data.fechaFinSiguiente1), 10);
    setText(form, '3.14 Fec-Iini', dateDmY(data.fechaInicioSiguiente2), 10);
    setText(form, '3.15 Fec-fin', dateDmY(data.fechaFinSiguiente2), 10);
    setText(form, '2. Por_tra', data.porcentajeJornada1, 5);
    setText(form, '2. Por_tra1', data.porcentajeJornada2, 5);
  }

  // Observaciones
  setText(form, '3.30 Obs', data.observaciones, 950);

  // Bases de cotización — the official form has 13 rows, we may have fewer.
  // Field naming is "2.1 Año_N", "2.1 Mes_N", "2.1 Nún_CN", "2.1 Bas_CN" with N = 1..13.
  const bases = (data.bases || []).filter(b => b.anio || b.mes || b.dias || b.base).slice(0, 13);
  bases.forEach((row, i) => {
    const n = i + 1;
    const monthLabel = row.mes ? (MESES_ES[parseInt(row.mes, 10) - 1] || row.mes) : '';
    setText(form, `2.1 Año_${n}`, row.anio, 4);
    setText(form, `2.1 Mes_${n}`, monthLabel, 10);
    setText(form, `2.1 Nún_C${n}`, row.dias, 2);
    // Quirk: row 1's base field is named "2.1 Bas_ C1" (with extra space) in the
    // official PDF; rows 2-13 are "2.1 Bas_CN" without the space.
    setText(form, n === 1 ? '2.1 Bas_ C1' : `2.1 Bas_C${n}`, row.base, 12);
  });

  // Section 4: Firma — locality + day/month/year (year is 2 chars: "26" for 2026)
  setText(form, '4.1 Loc', data.firmaLocalidad, 34);
  setText(form, '4.2 Dia', data.firmaDia, 2);
  setText(form, '4.3 Mes', data.firmaMes, 10);
  const yearShort = data.firmaAnio ? String(data.firmaAnio).slice(-2) : '';
  setText(form, '4.4 Año', yearShort, 2);

  // Save with field appearances updated so values are visible in any PDF reader.
  // We don't flatten — leaves fields editable in case the user wants to tweak.
  form.updateFieldAppearances();
  const out = await pdf.save();

  // Trigger browser download
  const blob = new Blob([out], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `C-133_${(data.workName || 'Trabajador').replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
