import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { useTranslation } from '../i18n/i18n';
import { useSelectedLocation } from '../context/SelectedLocationContext';
import { useFavorites } from '../hooks/useFavorites';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { fetchForecast } from '../services/openMeteoForecast';
import { getCachedForecast, setCachedForecast } from '../services/weatherCache';
import { normalizeWeather } from '../utils/normalizeWeather';
import { EmptyState } from '../components/EmptyState';
import { Skeleton } from '../components/Skeleton';
import { ErrorState } from '../components/ErrorState';
import { CurrentCard } from '../components/weather/CurrentCard';
import { HourlyForecast } from '../components/weather/HourlyForecast';
import { DailyForecast } from '../components/weather/DailyForecast';

export function Home() {
  const { t } = useTranslation();
  const { selectedLocation, hydrated } = useSelectedLocation();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const prefersReducedMotion = useReducedMotion();

  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch forecast when location changes
  useEffect(() => {
    if (!hydrated || !selectedLocation) {
      setWeatherData(null);
      setError(null);
      return;
    }


    const cacheKey = `${selectedLocation.latitude},${selectedLocation.longitude},${selectedLocation.timezone}`;

    // Check cache first
    const cached = getCachedForecast(cacheKey);
    if (cached) {
      setWeatherData(cached);
      setLoading(false);
      setError(null);
      return;
    }

    // Fetch new data
    setLoading(true);
    setError(null);

    fetchForecast({
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      timezone: selectedLocation.timezone,
    })
      .then((apiData) => {
        const normalized = normalizeWeather(apiData, selectedLocation);
        setWeatherData(normalized);
        setCachedForecast(cacheKey, normalized);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Forecast error:', err);
        setError(err.message || 'Failed to load forecast');
        setLoading(false);
      });
  }, [selectedLocation?.latitude, selectedLocation?.longitude, selectedLocation?.timezone, hydrated]);

  if (!hydrated) {
    return null;
  }

  return (
    <div className="w-full transition-colors duration-300">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-foreground mb-8">
          {t('app.title')}
        </h1>

        {!selectedLocation ? (
          <EmptyState />
        ) : loading ? (
          <Skeleton />
        ) : error ? (
          <ErrorState error={error} />
        ) : weatherData ? (
          <div className={prefersReducedMotion ? '' : 'animate-in fade-in slide-in-from-bottom-4 duration-700'}>
            {/* Favorites Button */}
            <div className="flex justify-end mb-6">
              <button
                onClick={() => {
                  if (isFavorite(selectedLocation.id)) {
                    removeFavorite(selectedLocation.id);
                  } else {
                    addFavorite(selectedLocation);
                  }
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all active:scale-95 flex items-center gap-2 ${isFavorite(selectedLocation.id)
                  ? 'bg-destructive/10 text-destructive hover:bg-destructive/20 text-red-600'
                  : 'bg-primary/10 text-primary hover:bg-primary/20'
                  }`}
              >
                <Star className={isFavorite(selectedLocation.id) ? "fill-current" : ""} size={20} />
                {isFavorite(selectedLocation.id)
                  ? t('buttons.removeFavorite')
                  : t('buttons.addFavorite')}
              </button>
            </div>

            <CurrentCard
              current={weatherData.current}
              location={weatherData.location}
            />
            <HourlyForecast
              hourly={weatherData.hourly}
              timezone={weatherData.location.timezone}
            />
            <DailyForecast
              daily={weatherData.daily}
              timezone={weatherData.location.timezone}
            />
          </div>
        ) : null}
      </main>
    </div>
  );
}
