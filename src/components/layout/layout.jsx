import { Outlet } from 'react-router-dom';
import { Header } from './header.jsx';
import { WeatherScene } from '../scene/WeatherScene';
import { usePreferences } from '../../hooks/usePreferences';
import { useSelectedLocation } from '../../context/SelectedLocationContext';
import { getCachedForecast } from '../../services/weatherCache';

export function Layout() {
  const { theme, enable3d } = usePreferences();
  const { selectedLocation } = useSelectedLocation();

  // Try to get current weather code from cache for the background
  // Ideally this would be in a global store, but this is a lightweight approach
  let weatherCode = 0;
  if (selectedLocation) {
    const cacheKey = `${selectedLocation.latitude},${selectedLocation.longitude},${selectedLocation.timezone}`;
    const cached = getCachedForecast(cacheKey);
    if (cached?.current) {
      weatherCode = cached.current.weatherCode;
    }
  }

  return (
    <div className={`min-h-screen ${enable3d ? '' : 'bg-background'} transition-colors duration-300 relative`}>
      {enable3d && (
        <WeatherScene
          weatherCode={weatherCode}
          isDay={true} // Simplified
          theme={theme}
        />
      )}
      <div className="relative z-10">
        <Header />
        <Outlet />
      </div>
    </div>
  );
}
