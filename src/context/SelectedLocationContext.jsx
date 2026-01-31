import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const SelectedLocationContext = createContext(null);
const STORAGE_KEY = 'hawa_selectedLocation';

export function SelectedLocationProvider({ children }) {
  const [selectedLocation, setSelectedLocationState] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage ONCE on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSelectedLocationState(parsed);
      }
    } catch (error) {
      console.error('Failed to load selected location from localStorage:', error);
    }
    setHydrated(true);
  }, []);

  const setSelectedLocation = useCallback((location) => {
    // Create new object reference to ensure React detects change
    const newLocation = location ? { ...location } : null;
    setSelectedLocationState(newLocation);

    // Persist to localStorage
    if (newLocation) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newLocation));
      } catch (error) {
        console.error('Failed to save selected location to localStorage:', error);
      }
    } else {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.error('Failed to clear selected location from localStorage:', error);
      }
    }
  }, []);

  const clearSelectedLocation = useCallback(() => {
    setSelectedLocation(null);
  }, [setSelectedLocation]);

  const value = {
    selectedLocation,
    setSelectedLocation,
    clearSelectedLocation,
    hydrated,
  };

  return (
    <SelectedLocationContext.Provider value={value}>
      {children}
    </SelectedLocationContext.Provider>
  );
}

export function useSelectedLocation() {
  const context = useContext(SelectedLocationContext);
  if (!context) {
    throw new Error(
      'useSelectedLocation must be used within SelectedLocationProvider'
    );
  }
  return context;
}
