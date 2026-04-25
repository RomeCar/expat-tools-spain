// regulations.js
// Social Security regulations for Sistema Especial de Empleados de Hogar.
//
// Important caveat about the tramos table below: TGSS is currently applying the
// 2025-final values because the 2026 Orden de Cotización ("Orden PJC/2026") had
// not been published as of last verification. Provisional 2026 figures circulating
// online (e.g. tramo 1 base 305-306 EUR after a 3.1% bump) are NOT what TGSS is
// actually charging. We use the values that match real, current nóminas — so the
// website and a user's gestoría agree.
//
// When the 2026 Orden de Cotización publishes, swap these for the new figures
// AND bump lastVerified. Guides surface this date so users see how fresh the data is.
//
// Sources: 2025 Orden de Cotización (BOE-A-2025-XXXX) + cross-checked against
// real-world nóminas issued by gestorías in early 2026.

export const REGULATIONS_2026 = {
  year: 2026,
  lastVerified: '2026-04-25', // YYYY-MM-DD — bump this when any number in this file changes

  smi: {
    hourly: 9.55,           // EUR/hour — includes vacation + pagas extra proration (for hourly contracts)
    hourlyBase: 8.90,       // EUR/hour — when vacation/pagas paid separately
    monthlyFull14: 1221.00, // EUR/month full-time (14 pagas)
    monthlyFull12: 1424.50, // EUR/month full-time (12 pagas, extras prorated)
    annual: 17094.00,       // EUR/year
  },

  // Worker contribution rates (deducted from gross salary)
  worker: {
    contingenciasComunes: 0.047,  // 4.70%
    mei: 0.0015,                  // 0.15%
    desempleo: {
      indefinido: 0.0155,        // 1.55%
      temporal: 0.016,           // 1.60%
    },
  },

  // Employer contribution rates (paid by employer on top of salary)
  employer: {
    contingenciasComunes: { grossRate: 0.236, bonusPercent: 0.20 },  // 23.60%, 20% reduction
    mei:                  { grossRate: 0.0075, bonusPercent: 0 },     // 0.75%, no bonus
    atep:                 { grossRate: 0.015, bonusPercent: 0 },      // 1.50%, no bonus
    desempleo: {
      indefinido:         { grossRate: 0.055, bonusPercent: 0.80 },   // 5.50%, 80% bonus
      temporal:           { grossRate: 0.067, bonusPercent: 0.80 },   // 6.70%, 80% bonus
    },
    fogasa:               { grossRate: 0.002, bonusPercent: 0.80 },   // 0.20%, 80% bonus
  },

  // TGSS Base de Cotización brackets — currently applying 2025-final figures
  // (see file header for why). Update when 2026 Orden de Cotización publishes.
  tramos: [
    { tramo: 1, min: 0,       max: 343.33,  base: 296.00 },
    { tramo: 2, min: 343.34,  max: 533.33,  base: 425.50 },
    { tramo: 3, min: 533.34,  max: 723.33,  base: 597.50 },
    { tramo: 4, min: 723.34,  max: 913.34,  base: 778.50 },
    { tramo: 5, min: 913.35,  max: 1103.33, base: 962.00 },
    { tramo: 6, min: 1103.34, max: 1293.33, base: 1144.00 },
    { tramo: 7, min: 1293.34, max: 1486.66, base: 1486.66 },
    { tramo: 8, min: 1486.67, max: 5101.20, base: null }, // base = actual salary
  ],

  maxBaseCotizacion: 5101.20,
};

// Helper: find the tramo for a given monthly salary
export function findTramo(monthlySalary) {
  const salary = parseFloat(monthlySalary) || 0;
  const tramos = REGULATIONS_2026.tramos;
  for (const t of tramos) {
    if (salary <= t.max) {
      return { ...t, base: t.base ?? Math.min(salary, REGULATIONS_2026.maxBaseCotizacion) };
    }
  }
  // Above all tramos — use actual salary capped at max
  return {
    tramo: 8,
    min: tramos[tramos.length - 1].min,
    max: REGULATIONS_2026.maxBaseCotizacion,
    base: Math.min(salary, REGULATIONS_2026.maxBaseCotizacion),
  };
}

// Backward compatibility export
export const SPANISH_REGULATIONS = {
  NOMINA: {
    SMI_HORA_MINIMUM: REGULATIONS_2026.smi.hourly,
    SMI_MENSUAL_MINIMUM: REGULATIONS_2026.smi.monthlyFull12,
    WORKER_CONTINGENCIAS_COMUNES: REGULATIONS_2026.worker.contingenciasComunes,
    WORKER_MEI: REGULATIONS_2026.worker.mei,
    WORKER_DESEMPLEO: REGULATIONS_2026.worker.desempleo.indefinido,
    EMPLOYER_CONTINGENCIAS_COMUNES_EFFECTIVE: REGULATIONS_2026.employer.contingenciasComunes.grossRate * (1 - REGULATIONS_2026.employer.contingenciasComunes.bonusPercent),
    EMPLOYER_MEI_EFFECTIVE: REGULATIONS_2026.employer.mei.grossRate,
    EMPLOYER_DESEMPLEO_EFFECTIVE: REGULATIONS_2026.employer.desempleo.indefinido.grossRate * (1 - REGULATIONS_2026.employer.desempleo.indefinido.bonusPercent),
    EMPLOYER_FOGASA_EFFECTIVE: REGULATIONS_2026.employer.fogasa.grossRate * (1 - REGULATIONS_2026.employer.fogasa.bonusPercent),
    EMPLOYER_AT_EP: REGULATIONS_2026.employer.atep.grossRate,
  }
};
