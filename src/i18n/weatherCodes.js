// Weather Code Mappings
// Open-Meteo weather codes to descriptions and icons
// https://open-meteo.com/en/docs#weather_codes

export const weatherCodes = {
  0: { labelEn: 'Clear sky', labelEs: 'Cielo despejado', iconName: 'Sun' },
  1: { labelEn: 'Mainly clear', labelEs: 'Principalmente despejado', iconName: 'CloudSun' },
  2: { labelEn: 'Partly cloudy', labelEs: 'Parcialmente nublado', iconName: 'CloudSun' },
  3: { labelEn: 'Overcast', labelEs: 'Nublado', iconName: 'Cloud' },
  45: { labelEn: 'Foggy', labelEs: 'Niebla', iconName: 'CloudFog' },
  48: { labelEn: 'Depositing rime fog', labelEs: 'Niebla con escarcha', iconName: 'CloudFog' },
  51: { labelEn: 'Light drizzle', labelEs: 'Llovizna ligera', iconName: 'CloudDrizzle' },
  53: { labelEn: 'Moderate drizzle', labelEs: 'Llovizna moderada', iconName: 'CloudDrizzle' },
  55: { labelEn: 'Dense drizzle', labelEs: 'Llovizna densa', iconName: 'CloudDrizzle' },
  61: { labelEn: 'Slight rain', labelEs: 'Lluvia ligera', iconName: 'CloudRain' },
  63: { labelEn: 'Moderate rain', labelEs: 'Lluvia moderada', iconName: 'CloudRain' },
  65: { labelEn: 'Heavy rain', labelEs: 'Lluvia fuerte', iconName: 'CloudRain' },
  71: { labelEn: 'Slight snow', labelEs: 'Nieve ligera', iconName: 'CloudSnow' },
  73: { labelEn: 'Moderate snow', labelEs: 'Nieve moderada', iconName: 'CloudSnow' },
  75: { labelEn: 'Heavy snow', labelEs: 'Nieve fuerte', iconName: 'CloudSnow' },
  77: { labelEn: 'Snow grains', labelEs: 'Granos de nieve', iconName: 'CloudSnow' },
  80: { labelEn: 'Slight rain showers', labelEs: 'Chubascos ligeros', iconName: 'CloudRain' },
  81: { labelEn: 'Moderate rain showers', labelEs: 'Chubascos moderados', iconName: 'CloudRain' },
  82: { labelEn: 'Violent rain showers', labelEs: 'Chubascos violentos', iconName: 'CloudLightning' },
  85: { labelEn: 'Slight snow showers', labelEs: 'Chubascos de nieve ligeros', iconName: 'CloudSnow' },
  86: { labelEn: 'Heavy snow showers', labelEs: 'Chubascos de nieve pesados', iconName: 'CloudSnow' },
  95: { labelEn: 'Thunderstorm', labelEs: 'Tormenta', iconName: 'CloudLightning' },
  96: { labelEn: 'Thunderstorm with slight hail', labelEs: 'Tormenta con granizo ligero', iconName: 'CloudLightning' },
  99: { labelEn: 'Thunderstorm with heavy hail', labelEs: 'Tormenta con granizo pesado', iconName: 'CloudLightning' },
};

export function getWeatherLabel(code, language = 'en') {
  const weatherData = weatherCodes[code];
  if (!weatherData) {
    return language === 'es' ? 'Desconocido' : 'Unknown';
  }
  return language === 'es' ? weatherData.labelEs : weatherData.labelEn;
}

export function getWeatherIconName(code) {
  const weatherData = weatherCodes[code];
  return weatherData?.iconName || 'HelpCircle';
}
