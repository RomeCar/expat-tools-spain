// C-133 (Certificado del Empleador para empleados de hogar) configuration
// Source: Modelo C-133 cas V.7 (INSS) — Sistema Especial de Empleados de Hogar

import { REGULATIONS_2026 } from './regulations';

export const PRESTACIONES = [
  { code: 'IT', es: 'Incapacidad temporal (baja medica)', en: 'Temporary incapacity (medical leave)' },
  { code: 'NCM', es: 'Nacimiento y cuidado de menor', en: 'Birth and childcare leave' },
  { code: 'RE', es: 'Riesgo durante el embarazo', en: 'Risk during pregnancy' },
  { code: 'RLN', es: 'Riesgo durante la lactancia natural', en: 'Risk during breastfeeding' },
  { code: 'CUME', es: 'Cuidado de menores con cancer u otra enfermedad grave', en: 'Care of minors with cancer or serious illness' },
];

export const CONTRACT_TYPES = [
  { code: 'completo', es: 'Tiempo completo', en: 'Full-time' },
  { code: 'parcial', es: 'Tiempo parcial / Fijo discontinuo', en: 'Part-time / Fixed-discontinuous' },
];

// Re-exported from regulations.js for convenience.
export const TRAMOS_2026 = REGULATIONS_2026.tramos;

// Number of monthly base rows the form renders.
// Single row is enough for tiempo completo IT; 3 rows for tiempo parcial IT;
// up to 12 for nacimiento parcial. We render 12 rows max and the user fills what applies.
export const MAX_BASE_ROWS = 12;

export const INITIAL_C133_DATA = {
  // Prestation
  prestacion: 'IT',

  // Employer
  empName: '',
  empDni: '',
  empCcc: '',
  empVia: '',
  empNumero: '',
  empBloque: '',
  empEscalera: '',
  empPiso: '',
  empPuerta: '',
  empCp: '',
  empLocalidad: '',
  empProvincia: '',
  empTelefono: '',

  // Worker
  workName: '',
  workNss: '',
  workDni: '',
  workTelefono: '',
  contractType: 'parcial',
  tramo: '',
  fechaInicio: '',          // start of activity with employer
  fechaInterrupcion: '',    // baja date
  fechaPrevistaFin: '',     // optional contract end date

  // Birth/care extra fields
  fechaInicioObligatorio: '',
  fechaFinObligatorio: '',
  fechaInicioSiguiente1: '',
  fechaFinSiguiente1: '',
  porcentajeJornada1: '',
  fechaInicioSiguiente2: '',
  fechaFinSiguiente2: '',
  porcentajeJornada2: '',

  // Contribution bases (array of {anio, mes, dias, base})
  bases: [{ anio: '', mes: '', dias: '', base: '' }],

  observaciones: '',

  // Signature
  firmaLocalidad: '',
  firmaDia: '',
  firmaMes: '',
  firmaAnio: new Date().getFullYear().toString(),
  firmaImage: '', // PNG dataURL of the user-drawn signature, embedded into the official PDF
};

// How many base rows are required by INSS depending on prestacion + contract type.
// IT / RE / RLN / CUME:
//   - completo: 1 mes (anterior)
//   - parcial:  3 meses anteriores al mes previo
// NCM:
//   - completo: 1 mes
//   - parcial:  12 meses
export function requiredBaseMonths(prestacion, contractType) {
  if (contractType === 'completo') return 1;
  if (prestacion === 'NCM') return 12;
  return 3;
}

// Suggest the base for a given tramo number (string or int)
export function getBaseForTramo(tramo) {
  const n = parseInt(tramo, 10);
  if (!n) return null;
  const tr = TRAMOS_2026.find(t => t.tramo === n);
  return tr ? tr.base : null;
}
