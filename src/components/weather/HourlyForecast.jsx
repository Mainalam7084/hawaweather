import { useTranslation } from '../../i18n/i18n';
import { WeatherIcon } from './WeatherIcon';

export function HourlyForecast({ hourly, timezone }) {
  const { t, language } = useTranslation();

  const formatHour = (date) => {
    // Ensure date is a Date object
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
      return '--:--';
    }
    return new Intl.DateTimeFormat(language === 'es' ? 'es-ES' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: timezone,
    }).format(dateObj);
  };

  // Get next 24 hours or available data
  const next24 = hourly.slice(0, 24);

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-foreground mb-4">
        {t('weather.next24Hours')}
      </h3>

      <div className="bg-card text-card-foreground rounded-lg shadow-lg p-6 overflow-x-auto border border-border">
        <div className="flex gap-4 min-w-max">
          {next24.map((hour, index) => {
            const timeKey = hour.time instanceof Date ? hour.time.getTime() : `fallback-${index}`;
            return (
              <div
                key={timeKey}
                className="flex flex-col items-center gap-2 pb-2 px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors min-w-[80px]"
              >
                <p className="text-sm font-semibold text-muted-foreground">
                  {formatHour(hour.time)}
                </p>

                <div className="my-2">
                  <WeatherIcon code={hour.weatherCode} size={32} className="text-primary" />
                </div>

                <p className="text-lg font-bold text-foreground">
                  {Math.round(hour.temperature)}°
                </p>

                {hour.precipitationProb !== null && hour.precipitationProb > 0 && (
                  <p className="text-xs font-medium text-blue-500">
                    {hour.precipitationProb}%
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
