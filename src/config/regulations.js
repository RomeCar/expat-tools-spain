// regulations.js
// This file centralizes all the official parameters for the application.
// Update these values yearly or as official regulations change.

export const SPANISH_REGULATIONS = {
  NOMINA: {
    // These constants are based on the 2026 Seg. Social Guidelines for Empleadas de Hogar
    // Update these annually when the BOE (Boletín Oficial del Estado) publishes new tramos.
    
    // SMI & Limits
    SMI_HORA_MINIMUM: 9.55,
    SMI_MENSUAL_MINIMUM: 332.05, // e.g. calculated for ~34.77 hours based on SMI 2026/h
    
    // Worker Deductions
    WORKER_CONTINGENCIAS_COMUNES: 0.047, // 4.70%
    WORKER_MEI: 0.0015, // 0.15%
    WORKER_DESEMPLEO: 0.0155, // 1.55%
    
    // Employer Costs (Rates applied *after* applicable bonuses)
    // Note: Deduct the bonus manually here. 
    // Example: Contingencias Comunes base is 23.6%, minus 20% bonus = 18.88% effective.
    EMPLOYER_CONTINGENCIAS_COMUNES_EFFECTIVE: 0.1888, 
    EMPLOYER_MEI_EFFECTIVE: 0.0075, // 0.75%
    EMPLOYER_DESEMPLEO_EFFECTIVE: 0.011, // 5.5% minus 80% bonus
    EMPLOYER_FOGASA_EFFECTIVE: 0.0004, // 0.2% minus 80% bonus
    EMPLOYER_AT_EP: 0.015 // 1.5%
  }
};
