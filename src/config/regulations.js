// regulations.js
// Social Security regulations for Sistema Especial de Empleados de Hogar.
//
// SOURCING RULE: every value below comes from a government primary source — the
// BOE (boe.es) or seg-social.es. Tax-blog summaries are NOT authoritative; they
// contradict each other and are often stale. If you need to update a number,
// link to the BOE article in the commit message.
//
// Sources for the figures below:
//   * Tramos + employer/worker rates — Orden PJC/297/2026 of 30 March 2026,
//     art. 15 (Sistema Especial de Empleados de Hogar): BOE-A-2026-7296
//     https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-7296
//   * SMI 2026 — Real Decreto 126/2026 of 18 February 2026, art. 4.2 (per-hour
//     rate for empleados de hogar = 9,55 €/hora efectivamente trabajada):
//     BOE-A-2026-3815
//     https://www.boe.es/buscar/act.php?id=BOE-A-2026-3815
//   * 2022 reform giving empleadas de hogar full IT/desempleo access —
//     RDL 16/2022: BOE-A-2022-14680
//
// NOTE for users: gestorías may temporarily issue nóminas using 2025 figures
// until they roll over their software to the post-March-2026 order. TGSS will
// regularize the difference. The figures below are the legally correct ones for
// 2026, sourced directly from the BOE.

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

  // TGSS Base de Cotización brackets — Orden PJC/297/2026 art. 15
  // (BOE-A-2026-7296). These are the 2026 official figures.
  tramos: [
    { tramo: 1, min: 0,       max: 329.00,  base: 306.00 },
    { tramo: 2, min: 329.01,  max: 510.00,  base: 436.00 },
    { tramo: 3, min: 510.01,  max: 693.00,  base: 602.00 },
    { tramo: 4, min: 693.01,  max: 877.00,  base: 785.00 },
    { tramo: 5, min: 877.01,  max: 1061.00, base: 970.00 },
    { tramo: 6, min: 1061.01, max: 1242.00, base: 1151.00 },
    { tramo: 7, min: 1242.01, max: 1424.40, base: 1424.40 },
    { tramo: 8, min: 1424.41, max: 5101.20, base: null }, // base = actual salary
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
