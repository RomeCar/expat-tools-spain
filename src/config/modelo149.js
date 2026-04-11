// Modelo 149 configuration data
// Sources: AEAT sede electronica, BOE Order EHA/848/2008

export const STREET_TYPES = [
  'Calle', 'Avenida', 'Plaza', 'Paseo', 'Camino', 'Carretera',
  'Ronda', 'Travesia', 'Urbanizacion', 'Glorieta', 'Alameda',
];

export const PROVINCES = [
  'Alava', 'Albacete', 'Alicante', 'Almeria', 'Asturias', 'Avila',
  'Badajoz', 'Barcelona', 'Burgos', 'Caceres', 'Cadiz', 'Cantabria',
  'Castellon', 'Ciudad Real', 'Cordoba', 'A Coruna', 'Cuenca',
  'Girona', 'Granada', 'Guadalajara', 'Guipuzcoa', 'Huelva', 'Huesca',
  'Illes Balears', 'Jaen', 'Leon', 'Lleida', 'Lugo', 'Madrid',
  'Malaga', 'Murcia', 'Navarra', 'Ourense', 'Palencia', 'Las Palmas',
  'Pontevedra', 'La Rioja', 'Salamanca', 'Santa Cruz de Tenerife',
  'Segovia', 'Sevilla', 'Soria', 'Tarragona', 'Teruel', 'Toledo',
  'Valencia', 'Valladolid', 'Vizcaya', 'Zamora', 'Zaragoza', 'Ceuta', 'Melilla',
];

export const COMMON_COUNTRIES = [
  { code: 'US', en: 'United States', es: 'Estados Unidos' },
  { code: 'GB', en: 'United Kingdom', es: 'Reino Unido' },
  { code: 'DE', en: 'Germany', es: 'Alemania' },
  { code: 'FR', en: 'France', es: 'Francia' },
  { code: 'IT', en: 'Italy', es: 'Italia' },
  { code: 'PT', en: 'Portugal', es: 'Portugal' },
  { code: 'NL', en: 'Netherlands', es: 'Paises Bajos' },
  { code: 'BE', en: 'Belgium', es: 'Belgica' },
  { code: 'IE', en: 'Ireland', es: 'Irlanda' },
  { code: 'SE', en: 'Sweden', es: 'Suecia' },
  { code: 'NO', en: 'Norway', es: 'Noruega' },
  { code: 'DK', en: 'Denmark', es: 'Dinamarca' },
  { code: 'CH', en: 'Switzerland', es: 'Suiza' },
  { code: 'AT', en: 'Austria', es: 'Austria' },
  { code: 'PL', en: 'Poland', es: 'Polonia' },
  { code: 'BR', en: 'Brazil', es: 'Brasil' },
  { code: 'MX', en: 'Mexico', es: 'Mexico' },
  { code: 'AR', en: 'Argentina', es: 'Argentina' },
  { code: 'CO', en: 'Colombia', es: 'Colombia' },
  { code: 'VE', en: 'Venezuela', es: 'Venezuela' },
  { code: 'CL', en: 'Chile', es: 'Chile' },
  { code: 'PE', en: 'Peru', es: 'Peru' },
  { code: 'CN', en: 'China', es: 'China' },
  { code: 'JP', en: 'Japan', es: 'Japon' },
  { code: 'IN', en: 'India', es: 'India' },
  { code: 'AU', en: 'Australia', es: 'Australia' },
  { code: 'CA', en: 'Canada', es: 'Canada' },
  { code: 'RU', en: 'Russia', es: 'Rusia' },
  { code: 'ZA', en: 'South Africa', es: 'Sudafrica' },
  { code: 'OTHER', en: 'Other', es: 'Otro' },
];

export const CATEGORIES = {
  employment: { box: '41-43', icon: 'Briefcase' },
  director: { box: '47-48', icon: 'Building2' },
  entrepreneur: { box: '54', icon: 'Rocket' },
  professional: { box: '55', icon: 'GraduationCap' },
  research: { box: '56', icon: 'FlaskConical' },
};

export function calculateDeadline(ssRegistrationDate) {
  if (!ssRegistrationDate) return null;
  const date = new Date(ssRegistrationDate);
  if (isNaN(date.getTime())) return null;
  const deadline = new Date(date);
  deadline.setMonth(deadline.getMonth() + 6);
  const now = new Date();
  const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
  return { deadline, daysLeft, isExpired: daysLeft < 0 };
}

export const INITIAL_FORM_DATA = {
  // Step 1: Taxpayer type
  taxpayerType: 'primary', // 'primary' or 'associated'
  primaryNif: '',
  primaryApellidos: '',
  primaryNombre: '',
  primaryM149Ref: '',

  // Step 2: Your details
  nif: '',
  apellidos: '',
  nombre: '',
  telefonoFijo: '',
  telefonoMovil: '',
  // Address
  tipoVia: 'Calle',
  nombreVia: '',
  numero: '',
  bloque: '',
  portal: '',
  escalera: '',
  planta: '',
  puerta: '',
  codigoPostal: '',
  municipio: '',
  provincia: 'Madrid',

  // Step 3: Purpose
  purpose: 'option', // 'option', 'renunciation', 'exclusion', 'endDisplacement'
  docRegistrationCode: '',
  exclusionDate: '',
  exclusionReason: '',
  endDisplacementDate: '',

  // Step 4: Category
  category: 'employment',
  employmentType: 'newJob', // 'newJob', 'transfer', 'remote'
  employerNif: '',
  employerName: '',
  entityNif: '',
  entityName: '',
  directorType: 'standard', // 'standard', 'patrimonial'

  // Step 5: Dates
  entryDate: '',
  activityStartDate: '',
  lastTaxResidence: '',
  nationality: '',

  // Associated taxpayer
  associatedType: '', // 'spouse', 'parent', 'child'
  childDob: '',
  childDisability: false,
  associatedEntryDate: '',
};
