import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Calculator, FileText, ArrowRight, ShieldCheck, BookOpen, Stethoscope } from 'lucide-react';

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <div>
      <section style={{ textAlign: 'center', padding: '4rem 1rem', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', lineHeight: 1.2 }}>
          {t('landing.heroTitle1')} <br />
          <span className="gradient-text">{t('landing.heroTitle2')}</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
          {t('landing.heroSubtitle')}
        </p>
        <Link to="/tools/nomina" className="btn-primary" style={{ marginRight: '1rem' }}>
          {t('landing.ctaNomina')} <ArrowRight size={20} />
        </Link>
        <Link to="/guides/domestica" className="btn-secondary">
          {t('landing.ctaGuide')}
        </Link>
      </section>

      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          <h2 style={{ margin: 0 }}>{t('landing.modulesTitle')}</h2>
          <span style={{ padding: '0.25rem 0.75rem', background: 'var(--bg-tertiary)', borderRadius: '1rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)' }}>
            {t('landing.modulesCount')}
          </span>
        </div>

        <div className="grid-2-cols">
          <Link to="/tools/nomina" style={{ color: 'inherit' }}>
            <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '0.75rem', display: 'inline-flex' }}>
                  <Calculator size={28} style={{ color: 'var(--accent-primary)' }} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--success)' }}>{t('common.tool')}</span>
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{t('landing.nomina.title')}</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', flexGrow: 1 }}>
                {t('landing.nomina.description')}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
                <ShieldCheck size={16} /> {t('common.localProcessing')}
              </div>
            </div>
          </Link>

          <Link to="/guides/domestica" style={{ color: 'inherit' }}>
            <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '0.75rem', display: 'inline-flex' }}>
                  <BookOpen size={28} style={{ color: 'var(--accent-primary)' }} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--success)' }}>{t('common.guide')}</span>
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{t('landing.domestica.title')}</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', flexGrow: 1 }}>
                {t('landing.domestica.description')}
              </p>
            </div>
          </Link>

          <Link to="/tools/modelo149" style={{ color: 'inherit' }}>
            <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '0.75rem', display: 'inline-flex' }}>
                  <FileText size={28} style={{ color: 'var(--accent-primary)' }} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--success)' }}>{t('common.tool')}</span>
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{t('landing.modelo149.title')}</h3>
              <p style={{ color: 'var(--text-secondary)', flexGrow: 1 }}>
                {t('landing.modelo149.description')}
              </p>
            </div>
          </Link>

          <Link to="/guides/baja-medica" style={{ color: 'inherit' }}>
            <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '0.75rem', display: 'inline-flex' }}>
                  <Stethoscope size={28} style={{ color: 'var(--accent-primary)' }} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--success)' }}>{t('common.guide')}</span>
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{t('landing.bajaMedica.title')}</h3>
              <p style={{ color: 'var(--text-secondary)', flexGrow: 1 }}>
                {t('landing.bajaMedica.description')}
              </p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
