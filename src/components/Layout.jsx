import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { Compass } from 'lucide-react';

export default function Layout() {
  return (
    <div className="app-container">
      <header className="header-nav">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Compass size={32} className="gradient-text" style={{ color: 'var(--accent-primary)' }} />
          <h2 style={{ margin: 0 }}>
            Expat<span className="gradient-text">Tools</span> Spain
          </h2>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/tools/nomina" className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>
            Nómina Generator
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer style={{ marginTop: '5rem', padding: '2rem 0', borderTop: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <p>© {new Date().getFullYear()} Expat Tools Spain. Designed for precision & ease.</p>
        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>All data is processed strictly locally inside your browser.</p>
      </footer>
    </div>
  );
}
