import { Outlet, Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '../context/LanguageContext';
import { Compass } from 'lucide-react';

export default function Layout() {
  const { t } = useLanguage();

  return (
    <div className="app-container">
      <header className="header-nav">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Compass size={32} className="gradient-text" style={{ color: 'var(--accent-primary)' }} />
          <h2 style={{ margin: 0 }}>
            Expat<span className="gradient-text">Tools</span> Spain
          </h2>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link to="/guides/domestica" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
            {t('layout.guideLink')}
          </Link>
          <Link to="/tools/nomina" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
            {t('layout.nominaLink')}
          </Link>
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer style={{ marginTop: '5rem', padding: '2rem 0', borderTop: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <p>&copy; {new Date().getFullYear()} {t('layout.footerCopy')}</p>
        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>{t('layout.footerPrivacy')}</p>
      </footer>
    </div>
  );
}
