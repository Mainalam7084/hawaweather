// Weather Cache Service with TTL
// In-memory + localStorage caching for forecast data

const CACHE_STORAGE_KEY = 'hawa_forecast_cache';
const DEFAULT_TTL_MS = 10 * 60 * 1000; // 10 minutes

// In-memory cache
let memoryCache = {};

export function getCachedForecast(key) {
  // Check memory cache first
  if (memoryCache[key]) {
    const { data, expiresAt } = memoryCache[key];
    if (Date.now() < expiresAt) {
      return data;
    }
    delete memoryCache[key];
  }

  // Check localStorage
  try {
    const stored = localStorage.getItem(CACHE_STORAGE_KEY);
    if (stored) {
      const allCaches = JSON.parse(stored);
      if (allCaches[key]) {
        const { data, expiresAt } = allCaches[key];
        if (Date.now() < expiresAt) {
          // Restore to memory cache
          memoryCache[key] = { data, expiresAt };
          return data;
        }
        // Remove expired cache
        delete allCaches[key];
        localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(allCaches));
      }
    }
  } catch (error) {
    console.warn('Cache retrieval error:', error);
  }

  return null;
}

export function setCachedForecast(key, data, ttlMs = DEFAULT_TTL_MS) {
  const expiresAt = Date.now() + ttlMs;

  // Store in memory
  memoryCache[key] = { data, expiresAt };

  // Store in localStorage
  try {
    const stored = localStorage.getItem(CACHE_STORAGE_KEY) || '{}';
    const allCaches = JSON.parse(stored);
    allCaches[key] = { data, expiresAt };
    localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(allCaches));
  } catch (error) {
    console.warn('Cache storage error:', error);
  }
}

export function clearCache(key) {
  if (key) {
    delete memoryCache[key];
    try {
      const stored = localStorage.getItem(CACHE_STORAGE_KEY);
      if (stored) {
        const allCaches = JSON.parse(stored);
        delete allCaches[key];
        localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(allCaches));
      }
    } catch (error) {
      console.warn('Cache clear error:', error);
    }
  } else {
    memoryCache = {};
    try {
      localStorage.removeItem(CACHE_STORAGE_KEY);
    } catch (error) {
      console.warn('Cache clear error:', error);
    }
  }
}
