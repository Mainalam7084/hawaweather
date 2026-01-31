import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'hawa_favorites';

export function useFavorites() {
  const [favorites, setFavoritesState] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFavoritesState(Array.isArray(parsed) ? parsed : []);
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Failed to load favorites:', error);
      setIsLoaded(true);
    }
  }, []);

  const saveFavorites = useCallback((newFavorites) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  }, []);

  const addFavorite = useCallback(
    (location) => {
      const newFavorite = {
        id: location.id,
        name: location.name,
        country: location.country,
        admin1: location.admin1 || null,
        latitude: location.latitude,
        longitude: location.longitude,
        timezone: location.timezone,
      };

      setFavoritesState((prev) => {
        // Check if already exists
        if (prev.some((fav) => fav.id === newFavorite.id)) {
          return prev;
        }
        const updated = [...prev, newFavorite];
        saveFavorites(updated);
        return updated;
      });
    },
    [saveFavorites]
  );

  const removeFavorite = useCallback(
    (id) => {
      setFavoritesState((prev) => {
        const updated = prev.filter((fav) => fav.id !== id);
        saveFavorites(updated);
        return updated;
      });
    },
    [saveFavorites]
  );

  const isFavorite = useCallback(
    (id) => {
      return favorites.some((fav) => fav.id === id);
    },
    [favorites]
  );

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    isLoaded,
  };
}
