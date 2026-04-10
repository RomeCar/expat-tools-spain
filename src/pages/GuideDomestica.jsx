import React from 'react';
import { BookOpen, ExternalLink, FileText, CheckCircle, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GuideDomestica() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '3rem' }}>
        <Link to="/" style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)', display: 'inline-block', marginBottom: '1.5rem' }}>
          ← Back to Tools
        </Link>
        <h1 style={{ fontSize: '3rem', lineHeight: '1.2' }}>
          How to Hire a <br/><span className="gradient-text">Domestic Worker in Spain</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
          A step-by-step complete guide according to the new 2026 Seg. Social rules.
        </p>
      </div>

      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          <Info size={24} style={{ color: 'var(--accent-primary)' }}/>
          Quick Summary of 2026 Rules
        </h2>
        <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', padding: '0', margin: '0' }}>
          <li style={{ marginBottom: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
            <CheckCircle size={18} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '0.125rem' }} />
            <span><strong>Minimum Wage (SMI):</strong> 332.05€ per month for ~35 hours. The minimum hourly wage is 9.55€.</span>
          </li>
          <li style={{ marginBottom: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
            <CheckCircle size={18} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '0.125rem' }} />
            <span><strong>Bonuses are applied automatically</strong> when registering correctly on the Social Security portal (20% bonus on contingencies and 80% on FOGASA/Desempleo).</span>
          </li>
          <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
            <CheckCircle size={18} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '0.125rem' }} />
            <span><strong>Desempleo:</strong> Domestic workers now have full access to unemployment benefits.</span>
          </li>
        </ul>
      </div>

      <div style={{ padding: '0 1rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Step 1: Get Your Documentation Ready</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Before starting, both you (the employer) and your new employee need specific documents.</p>
        <ul style={{ color: 'var(--text-secondary)', marginBottom: '2rem', paddingLeft: '1.5rem', lineHeight: '1.7' }}>
          <li><strong>For the Employer:</strong> DNI or NIE, and your Social Security Employer Code (Código de Cuenta de Cotización para Empleadores de Hogar). You can get this online if you don't have it.</li>
          <li><strong>For the Employee:</strong> DNI or TIE (residence permit with work authorization), and their Social Security Number.</li>
          <li><strong>Bank Account (IBAN):</strong> An account where the Seg. Social will automatically deduct your employer quotes each month.</li>
        </ul>

        <h2 style={{ marginBottom: '1.5rem' }}>Step 2: Sign the Employment Contract</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>You must sign a written contract specifying the hours, schedule, salary, and vacation days (usually 30 calendar days). Keep copies for both parties.</p>
        <a href="https://www.mites.gob.es/es/Guia/texto/guia_5/contenidos/guia_5_12_4.htm" target="_blank" rel="noreferrer" className="btn-secondary" style={{ marginBottom: '2rem' }}>
          <FileText size={18} /> Download Official Ministry Contract Templates <ExternalLink size={16} />
        </a>

        <h2 style={{ marginBottom: '1.5rem' }}>Step 3: Register the Worker with Social Security ("Dar el Alta")</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          You must officially register your employee <strong>before</strong> they start working. This is done entirely online via the IMPORT@SS portal of the Seg. Social using your Digital Certificate or Cl@ve.
        </p>
        <div style={{ background: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>IMPORT@SS Portal</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.875rem' }}>Access the section "Alta en Empleo de Hogar" to input the contract hours, salary, and your IBAN.</p>
          <a href="https://portal.seg-social.gob.es/wps/portal/importass/importass/Categorias/Altas%2C+bajas+y+modificaciones/Alta+empleado+hogar" target="_blank" rel="noreferrer" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
            Go to IMPORT@SS <ExternalLink size={16} />
          </a>
        </div>

        <h2 style={{ marginBottom: '1.5rem' }}>Step 4: Generate Monthly Payslips (Nóminas)</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          At the end of every month, you must provide your employee with a formal receipt of their salary that outlines all Seg. Social deductions (like MEI, contingencies, and desempleo).
        </p>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          We have built a tool specifically for this. It takes the official TGSS parameter base for your employee and automates the calculation so you don't have to use complex Excel sheets!
        </p>
        <Link to="/tools/nomina" className="btn-primary">
          <BookOpen size={18} /> Use the Nómina Generator Tool
        </Link>
      </div>
    </div>
  );
}
