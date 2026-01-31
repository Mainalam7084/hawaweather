import { Sunrise, Sunset, ArrowUp, ArrowDown } from 'lucide-react';
import { useTranslation } from '../../i18n/i18n';
import { WeatherIcon } from './WeatherIcon';

export function DailyForecast({ daily, timezone }) {
  const { t, language } = useTranslation();

  const formatDate = (date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
      return '---';
    }
    return new Intl.DateTimeFormat(language === 'es' ? 'es-ES' : 'en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      timeZone: timezone,
    }).format(dateObj);
  };

  const formatTime = (date) => {
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

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-foreground mb-4">
        {t('weather.next7Days')}
      </h3>

      <div className="space-y-3">
        {daily.map((day, index) => {
          const dateKey = day.date instanceof Date ? day.date.getTime() : `day-${index}`;
          return (
            <div
              key={dateKey}
              className="bg-card text-card-foreground border border-border rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
                {/* Date */}
                <div className="col-span-1">
                  <p className="font-semibold text-foreground">
                    {formatDate(day.date)}
                  </p>
                </div>

                {/* Icon */}
                <div className="col-span-1 text-center">
                  <WeatherIcon code={day.weatherCode} size={40} className="mx-auto text-primary" />
                </div>

                {/* Temperature */}
                <div className="col-span-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="flex items-center text-xs text-muted-foreground mr-2">
                      <ArrowUp size={12} className="mr-1 text-red-500" />
                      <ArrowDown size={12} className="mr-1 text-blue-500" />
                    </span>
                  </div>
                  <p className="font-semibold text-foreground">
                    <span className="text-red-500">{Math.round(day.tempMax)}°</span>
                    <span className="mx-2 text-muted-foreground">/</span>
                    <span className="text-blue-500">{Math.round(day.tempMin)}°</span>
                  </p>
                </div>

                {/* Precipitation */}
                <div className="col-span-1">
                  {day.precipitationSum !== null && (
                    <>
                      <p className="text-sm text-muted-foreground mb-1">
                        {t('weather.precipitation')}
                      </p>
                      <p className="font-semibold text-blue-500">
                        {Math.round(day.precipitationSum)} mm
                      </p>
                    </>
                  )}
                </div>

                {/* Sunrise/Sunset */}
                <div className="col-span-2 md:col-span-1">
                  <div className="flex gap-4 text-sm">
                    {day.sunrise && (
                      <div>
                        <p className="text-muted-foreground flex items-center gap-1">
                          <Sunrise size={16} className="text-orange-500" />
                        </p>
                        <p className="text-foreground mt-1">
                          {formatTime(day.sunrise)}
                        </p>
                      </div>
                    )}
                    {day.sunset && (
                      <div>
                        <p className="text-muted-foreground flex items-center gap-1">
                          <Sunset size={16} className="text-purple-500" />
                        </p>
                        <p className="text-foreground mt-1">
                          {formatTime(day.sunset)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
