import { SPANISH_REGULATIONS } from '../config/regulations';

const CONSTANTS = SPANISH_REGULATIONS.NOMINA;

export const CONSTANTS_2026 = {
  SMI_HORA: CONSTANTS.SMI_HORA_MINIMUM,
  SMI_MENSUAL: CONSTANTS.SMI_MENSUAL_MINIMUM,
};

/**
 * Calculates the complete Nómina based on input parameters
 */
export function calculateNomina(params) {
  const baseCotizacion = parseFloat(params.baseCotizacion) || 0;
  const salarioBruto = parseFloat(params.salarioBruto) || 0;
  
  // 1. Worker Deductions
  const dedContComunes = baseCotizacion * CONSTANTS.WORKER_CONTINGENCIAS_COMUNES;
  const dedMEI = baseCotizacion * CONSTANTS.WORKER_MEI;
  const dedDesempleo = baseCotizacion * CONSTANTS.WORKER_DESEMPLEO;
  
  const totalDeductions = dedContComunes + dedMEI + dedDesempleo;
  
  // 2. Net Salary
  const netSalary = salarioBruto - totalDeductions;
  
  // 3. Employer Costs
  const empContComunes = baseCotizacion * CONSTANTS.EMPLOYER_CONTINGENCIAS_COMUNES_EFFECTIVE;
  const empMEI = baseCotizacion * CONSTANTS.EMPLOYER_MEI_EFFECTIVE;
  const empDesempleo = baseCotizacion * CONSTANTS.EMPLOYER_DESEMPLEO_EFFECTIVE;
  const empFogasa = baseCotizacion * CONSTANTS.EMPLOYER_FOGASA_EFFECTIVE;
  const empATEP = baseCotizacion * CONSTANTS.EMPLOYER_AT_EP;
  
  const totalEmployerCostSS = empContComunes + empMEI + empDesempleo + empFogasa + empATEP;
  const totalCostForEmployer = salarioBruto + totalEmployerCostSS;

  return {
    deductions: {
      contingenciasComunes: dedContComunes,
      mei: dedMEI,
      desempleo: dedDesempleo,
      total: totalDeductions
    },
    netSalary,
    employerCosts: {
      contingenciasComunes: empContComunes,
      mei: empMEI,
      desempleo: empDesempleo,
      fogasa: empFogasa,
      atep: empATEP,
      totalSS: totalEmployerCostSS,
      totalCost: totalCostForEmployer
    }
  };
}
