// Open-Meteo Forecast Service
// https://open-meteo.com/en/docs/forecast-api

const FORECAST_API = 'https://api.open-meteo.com/v1/forecast';

export async function fetchForecast({ latitude, longitude, timezone }) {
  if (!latitude || !longitude || !timezone) {
    throw new Error('Missing required parameters: latitude, longitude, timezone');
  }

  try {
    const params = new URLSearchParams({
      latitude,
      longitude,
      timezone,
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m',
      hourly: 'temperature_2m,precipitation_probability,weather_code,wind_speed_10m',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset',
      forecast_days: 7,
    });

    const response = await fetch(`${FORECAST_API}?${params}`);

    if (!response.ok) {
      throw new Error(`Forecast API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Forecast fetch error:', error);
    throw {
      message: 'Failed to fetch forecast',
      originalError: error,
    };
  }
}
