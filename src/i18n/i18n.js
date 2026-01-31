import { usePreferences } from '../hooks/usePreferences';
import { translations } from './translations';

// Hook version that components should use
export function useTranslation() {
  const { language, isLoaded } = usePreferences();

  const translate = (key) => {
    // Use 'en' as fallback if not loaded yet
    const lang = isLoaded ? language : 'en';
    const dict = translations[lang] || translations.en;
    const value = dict[key];

    if (value === undefined) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }

    return value;
  };

  return { t: translate, language: isLoaded ? language : 'en' };
}

// Simple version that uses current language from localStorage
export function t(key) {
  try {
    const stored = localStorage.getItem('hawa_preferences');
    const preferences = stored ? JSON.parse(stored) : { language: 'en' };
    const language = preferences.language || 'en';

    const dict = translations[language] || translations.en;
    const value = dict[key];

    if (value === undefined) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }

    return value;
  } catch (error) {
    console.error('Translation error:', error);
    return key;
  }
}
