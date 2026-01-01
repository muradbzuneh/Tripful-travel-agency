import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getTranslation } from '../utils/translations';
import '../styles/theme-language-selector.css';

export default function ThemeLanguageSelector() {
  const { theme, language, toggleTheme, changeLanguage } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'am', name: 'አማርኛ', flag: '🇪🇹' },
    { code: 'om', name: 'Afaan Oromo', flag: '🇪🇹' },
    { code: 'ti', name: 'ትግርኛ', flag: '🇪🇹' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <div className="theme-language-selector">
      {/* Theme Toggle */}
      <button 
        className="theme-toggle"
        onClick={toggleTheme}
        title={getTranslation(theme === 'light' ? 'darkMode' : 'lightMode', language)}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      {/* Language Selector */}
      <div className="language-selector">
        <button 
          className="language-toggle"
          onClick={() => setIsOpen(!isOpen)}
          title={getTranslation('language', language)}
        >
          <span className="flag">{currentLanguage?.flag}</span>
          <span className="lang-code">{language.toUpperCase()}</span>
          <span className="arrow">{isOpen ? '▲' : '▼'}</span>
        </button>

        {isOpen && (
          <div className="language-dropdown">
            {languages.map((lang) => (
              <button
                key={lang.code}
                className={`language-option ${language === lang.code ? 'active' : ''}`}
                onClick={() => {
                  changeLanguage(lang.code);
                  setIsOpen(false);
                }}
              >
                <span className="flag">{lang.flag}</span>
                <span className="name">{lang.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Close dropdown when clicking outside */}
      {isOpen && (
        <div 
          className="dropdown-overlay" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}