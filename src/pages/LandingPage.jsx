import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, FileText, ArrowRight, ShieldCheck, BookOpen } from 'lucide-react';

export default function LandingPage() {
  return (
    <div>
      <section style={{ textAlign: 'center', padding: '4rem 1rem', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', lineHeight: '1.2' }}>
          Navigating Spain <br />
          <span className="gradient-text">made beautifully simple.</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
          Premium tools crafted for expats. From hiring domestic help to calculating taxes, 
          manage your life in Spain with confidence and total privacy.
        </p>
        <Link to="/tools/nomina" className="btn-primary" style={{ marginRight: '1rem' }}>
          Try the Nómina Generator <ArrowRight size={20} />
        </Link>
        <Link to="/guides/domestica" className="btn-secondary">
          Read the 2026 Hiring Guide
        </Link>
      </section>

      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          <h2 style={{ margin: 0 }}>Available Modules</h2>
          <span style={{ padding: '0.25rem 0.75rem', background: 'var(--bg-tertiary)', borderRadius: '1rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)' }}>2 Available</span>
        </div>

        <div className="grid-2-cols">
          <Link to="/tools/nomina" style={{ color: 'inherit' }}>
            <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '0.75rem', display: 'inline-flex' }}>
                  <Calculator size={28} style={{ color: 'var(--accent-primary)' }} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--success)' }}>Tool</span>
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Domestic Worker Nómina</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', flexGrow: 1 }}>
                Generate official payslips (nóminas) for your domestic worker. Automatically calculates 
                Seguridad Social bases, MEI, Desempleo, and net payouts based on 2026 regulations.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
                <ShieldCheck size={16} /> 100% Local Processing
              </div>
            </div>
          </Link>

          <Link to="/guides/domestica" style={{ color: 'inherit' }}>
            <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '0.75rem', display: 'inline-flex' }}>
                  <BookOpen size={28} style={{ color: 'var(--accent-primary)' }} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--success)' }}>Guide</span>
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>How to Hire a Domestica</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', flexGrow: 1 }}>
                A complete roadmap on how to legally hire a domestic worker in Spain. We cover BOE laws, IMPORT@SS Seg. Social Portal, employment contracts, and documentation.
              </p>
            </div>
          </Link>

          <div className="glass-card" style={{ opacity: 0.6, cursor: 'not-allowed', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '0.75rem', display: 'inline-flex' }}>
                  <FileText size={28} style={{ color: 'var(--text-secondary)' }} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)' }}>Coming Soon</span>
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Modelo 149 Generator</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Apply for the Beckham Law (Régimen Especial de Trabajadores Desplazados) automatically with pre-filled forms.
              </p>
          </div>
        </div>
      </section>
    </div>
  );
}
