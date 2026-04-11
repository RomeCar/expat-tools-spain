import { REGULATIONS_2026, findTramo } from '../config/regulations.js';
import { round2 } from './formatters.js';

const R = REGULATIONS_2026;

/**
 * Full nomina calculation.
 *
 * @param {Object} params
 * @param {number} params.hoursPerMonth - Hours worked per month
 * @param {number} params.hourlyRate - Hourly rate (defaults to SMI 9.55)
 * @param {number} [params.salarioBruto] - Override: manual gross salary
 * @param {number} [params.baseCotizacion] - Override: manual contribution base
 * @param {boolean} params.pagasProrrateadas - True if extra pay is prorated (12 payments)
 * @param {boolean} params.includePagaExtra - True if this month includes a paga extra (14-pay mode)
 * @param {string} params.contractType - 'indefinido', 'temporal', or 'fijoDiscontinuo'
 * @returns {Object} Complete calculation result
 */
export function calculateNominaFull(params) {
  const hours = parseFloat(params.hoursPerMonth) || 0;
  const rate = parseFloat(params.hourlyRate) || R.smi.hourly;
  const contractType = params.contractType || 'indefinido';

  // 1. Salary calculation
  const autoSalary = round2(hours * rate);
  const salarioBruto = params.salarioBruto ? round2(parseFloat(params.salarioBruto)) : autoSalary;

  // 2. Paga extra (only in 14-pay mode when it's a paga extra month)
  const pagaExtraValue = (!params.pagasProrrateadas && params.includePagaExtra) ? salarioBruto : 0;
  const totalDevengado = round2(salarioBruto + pagaExtraValue);

  // 3. Base de cotizacion (auto from tramo or manual override)
  const tramo = findTramo(salarioBruto);
  const baseCotizacion = params.baseCotizacion
    ? round2(parseFloat(params.baseCotizacion))
    : tramo.base;

  // 4. Worker deductions (calculated on base de cotizacion)
  const workerCC = round2(baseCotizacion * R.worker.contingenciasComunes);
  const workerMEI = round2(baseCotizacion * R.worker.mei);
  const desempleoRate = contractType === 'temporal'
    ? R.worker.desempleo.temporal
    : R.worker.desempleo.indefinido;
  const workerDesempleo = round2(baseCotizacion * desempleoRate);
  const totalWorkerSS = round2(workerCC + workerMEI + workerDesempleo);

  // 5. Net salary
  const liquido = round2(totalDevengado - totalWorkerSS);

  // 6. Employer costs (calculated on base de cotizacion)
  function calcEmployerLine(config) {
    const gross = round2(baseCotizacion * config.grossRate);
    const bonus = round2(gross * config.bonusPercent);
    const net = round2(gross - bonus);
    return { grossRate: config.grossRate, bonusPercent: config.bonusPercent, grossAmount: gross, bonusAmount: bonus, netAmount: net };
  }

  const empCC = calcEmployerLine(R.employer.contingenciasComunes);
  const empMEI = calcEmployerLine(R.employer.mei);
  const empATEP = calcEmployerLine(R.employer.atep);
  const empDesempleoConfig = contractType === 'temporal'
    ? R.employer.desempleo.temporal
    : R.employer.desempleo.indefinido;
  const empDesempleo = calcEmployerLine(empDesempleoConfig);
  const empFogasa = calcEmployerLine(R.employer.fogasa);

  const totalEmployerSS = round2(
    empCC.netAmount + empMEI.netAmount + empATEP.netAmount +
    empDesempleo.netAmount + empFogasa.netAmount
  );

  const cargoBancarioSS = round2(totalEmployerSS + totalWorkerSS);
  const costeTotalEmpleador = round2(totalDevengado + totalEmployerSS);

  return {
    // Inputs used
    autoSalary,
    salarioBruto,
    baseCotizacion,
    tramo,

    // Devengos
    devengos: {
      salarioBase: salarioBruto,
      pagaExtra: pagaExtraValue,
      totalDevengado,
    },

    // Worker deductions
    deductions: {
      contingenciasComunes: workerCC,
      mei: workerMEI,
      ccPlusMei: round2(workerCC + workerMEI),
      ccPlusMeiRate: round2((R.worker.contingenciasComunes + R.worker.mei) * 100) / 100,
      desempleo: workerDesempleo,
      desempleoRate,
      total: totalWorkerSS,
    },

    // Net salary
    liquido,

    // Employer costs
    employerCosts: {
      contingenciasComunes: empCC,
      mei: empMEI,
      atep: empATEP,
      desempleo: empDesempleo,
      fogasa: empFogasa,
      totalSS: totalEmployerSS,
    },

    cargoBancarioSS,
    costeTotalEmpleador,
  };
}

// Backward compatibility
export { REGULATIONS_2026 as CONSTANTS_2026 };
export function calculateNomina(params) {
  const result = calculateNominaFull({
    ...params,
    hoursPerMonth: params.hoursPerMonth || 0,
    hourlyRate: R.smi.hourly,
  });
  return {
    deductions: {
      contingenciasComunes: result.deductions.contingenciasComunes,
      mei: result.deductions.mei,
      desempleo: result.deductions.desempleo,
      total: result.deductions.total,
    },
    netSalary: result.liquido,
    employerCosts: {
      contingenciasComunes: result.employerCosts.contingenciasComunes.netAmount,
      mei: result.employerCosts.mei.netAmount,
      desempleo: result.employerCosts.desempleo.netAmount,
      fogasa: result.employerCosts.fogasa.netAmount,
      atep: result.employerCosts.atep.netAmount,
      totalSS: result.employerCosts.totalSS,
      totalCost: result.costeTotalEmpleador,
    },
  };
}
