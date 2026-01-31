import { createContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'hawa_preferences';

const defaultPreferences = {
    theme: 'light',
    language: 'en',
    enable3d: false,
};

export const PreferencesContext = createContext(null);

export function PreferencesProvider({ children }) {
    const [preferences, setPreferences] = useState(defaultPreferences);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                setPreferences({ ...defaultPreferences, ...parsed });
            }
            setIsLoaded(true);
        } catch (error) {
            console.error('Failed to load preferences:', error);
            setIsLoaded(true);
        }
    }, []);

    // Apply theme to DOM
    useEffect(() => {
        if (isLoaded) {
            const html = document.documentElement;
            if (preferences.theme === 'dark') {
                html.classList.add('dark');
            } else {
                html.classList.remove('dark');
            }
        }
    }, [preferences.theme, isLoaded]);

    // Persist to localStorage
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
            } catch (error) {
                console.error('Failed to save preferences:', error);
            }
        }
    }, [preferences, isLoaded]);

    const toggleTheme = useCallback(() => {
        setPreferences((prev) => ({
            ...prev,
            theme: prev.theme === 'light' ? 'dark' : 'light',
        }));
    }, []);

    const toggleLanguage = useCallback(() => {
        setPreferences((prev) => ({
            ...prev,
            language: prev.language === 'en' ? 'es' : 'en',
        }));
    }, []);

    const toggle3d = useCallback(() => {
        setPreferences((prev) => ({
            ...prev,
            enable3d: !prev.enable3d,
        }));
    }, []);

    const value = {
        theme: preferences.theme,
        language: preferences.language,
        enable3d: preferences.enable3d,
        toggleTheme,
        toggleLanguage,
        toggle3d,
        isLoaded,
    };

    return (
        <PreferencesContext.Provider value={value}>
            {children}
        </PreferencesContext.Provider>
    );
}
