import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to 'light'
    return localStorage.getItem('tripful-theme') || 'light';
  });

  const [language, setLanguage] = useState(() => {
    // Get language from localStorage or default to 'en'
    return localStorage.getItem('tripful-language') || 'en';
  });

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('tripful-theme', theme);
  }, [theme]);

  useEffect(() => {
    // Save language to localStorage
    localStorage.setItem('tripful-language', language);
  }, [language]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const value = {
    theme,
    language,
    toggleTheme,
    changeLanguage,
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};