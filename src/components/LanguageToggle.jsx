import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="btn-secondary"
      style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem', gap: '0.35rem', minWidth: '70px' }}
      aria-label={language === 'en' ? 'Cambiar a Espanol' : 'Switch to English'}
    >
      <Globe size={16} />
      {language === 'en' ? 'ES' : 'EN'}
    </button>
  );
}
