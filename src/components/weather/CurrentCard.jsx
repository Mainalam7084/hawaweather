import { Thermometer, Droplets, Wind, Umbrella } from 'lucide-react';
import { useTranslation } from '../../i18n/i18n';
import { getWeatherLabel } from '../../i18n/weatherCodes';
import { WeatherIcon } from './WeatherIcon';

export function CurrentCard({ current, location }) {
  const { t, language } = useTranslation();

  const formatTime = (date) => {
    try {
      return new Intl.DateTimeFormat(language === 'es' ? 'es-ES' : 'en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: location.timezone,
      }).format(date);
    } catch (e) {
      return date.toLocaleTimeString();
    }
  };

  const weatherLabel = getWeatherLabel(current.weatherCode, language);

  return (
    <div className="rounded-lg bg-gradient-to-br from-primary to-blue-600 text-white p-8 shadow-lg mb-8">
      {/* Location Header */}
      <div className="mb-6">
        <h2 className="text-4xl font-bold mb-2">{location.name}</h2>
        <p className="text-blue-100">
          {location.admin1 && `${location.admin1}, `}
          {location.country}
        </p>
      </div>

      {/* Main Temperature */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex items-center gap-6">
          <WeatherIcon code={current.weatherCode} size={88} className="text-white" />
          <div>
            <p className="text-6xl font-bold">{Math.round(current.temperature)}°</p>
            <p className="text-lg text-blue-100">{weatherLabel}</p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          {current.apparentTemperature !== null && (
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-1">
                <Thermometer size={16} className="text-blue-100" />
                <p className="text-sm text-blue-100">{t('weather.feelsLike')}</p>
              </div>
              <p className="text-2xl font-semibold">
                {Math.round(current.apparentTemperature)}°
              </p>
            </div>
          )}

          {current.humidity !== null && (
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-1">
                <Droplets size={16} className="text-blue-100" />
                <p className="text-sm text-blue-100">{t('weather.humidity')}</p>
              </div>
              <p className="text-2xl font-semibold">{current.humidity}%</p>
            </div>
          )}

          {current.windSpeed !== null && (
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-1">
                <Wind size={16} className="text-blue-100" />
                <p className="text-sm text-blue-100">{t('weather.windSpeed')}</p>
              </div>
              <p className="text-2xl font-semibold">{Math.round(current.windSpeed)} km/h</p>
            </div>
          )}

          {current.precipitation !== null && (
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-1">
                <Umbrella size={16} className="text-blue-100" />
                <p className="text-sm text-blue-100">{t('weather.precipitation')}</p>
              </div>
              <p className="text-2xl font-semibold">{current.precipitation} mm</p>
            </div>
          )}
        </div>
      </div>

      {/* Last Updated */}
      <div className="mt-8 text-sm text-blue-100 border-t border-white/20 pt-4">
        {t('weather.lastUpdated')}: {formatTime(new Date())}
      </div>
    </div>
  );
}
