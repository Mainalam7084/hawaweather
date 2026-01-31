// Weather Data Normalization
// Normalize Open-Meteo API responses to internal format

export function normalizeWeather(apiData, location) {
  if (!apiData || !location) {
    return null;
  }

  const {
    current = {},
    hourly = {},
    daily = {},
    timezone,
  } = apiData;

  // Parse current data
  const currentTime = current.time ? new Date(current.time) : new Date();

  const normalized = {
    location: {
      name: location.name,
      country: location.country,
      admin1: location.admin1 || null,
      latitude: location.latitude,
      longitude: location.longitude,
      timezone: timezone || location.timezone,
    },
    current: {
      time: currentTime,
      temperature: current.temperature_2m ?? null,
      apparentTemperature: current.apparent_temperature ?? null,
      windSpeed: current.wind_speed_10m ?? null,
      windDirection: current.wind_direction_10m ?? null,
      humidity: current.relative_humidity_2m ?? null,
      precipitation: current.precipitation ?? null,
      weatherCode: current.weather_code ?? null,
    },
    hourly: [],
    daily: [],
    meta: {
      fetchedAt: new Date().toISOString(),
    },
  };

  // Parse hourly data
  if (hourly.time && hourly.time.length > 0) {
    normalized.hourly = hourly.time.map((timeStr, index) => {
      const timeObj = typeof timeStr === 'string' ? new Date(timeStr) : timeStr;
      return {
        time: timeObj,
        temperature: hourly.temperature_2m?.[index] ?? null,
        precipitationProb: hourly.precipitation_probability?.[index] ?? null,
        weatherCode: hourly.weather_code?.[index] ?? null,
        windSpeed: hourly.wind_speed_10m?.[index] ?? null,
      };
    });
  }

  // Parse daily data
  if (daily.time && daily.time.length > 0) {
    normalized.daily = daily.time.map((dateStr, index) => {
      const dateObj = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
      const sunriseStr = daily.sunrise?.[index];
      const sunsetStr = daily.sunset?.[index];
      return {
        date: dateObj,
        tempMin: daily.temperature_2m_min?.[index] ?? null,
        tempMax: daily.temperature_2m_max?.[index] ?? null,
        precipitationSum: daily.precipitation_sum?.[index] ?? null,
        weatherCode: daily.weather_code?.[index] ?? null,
        sunrise: sunriseStr ? (typeof sunriseStr === 'string' ? new Date(sunriseStr) : sunriseStr) : null,
        sunset: sunsetStr ? (typeof sunsetStr === 'string' ? new Date(sunsetStr) : sunsetStr) : null,
      };
    });
  }

  return normalized;
}
