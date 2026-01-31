import { useNavigate } from 'react-router-dom';
import { Trash2, MapPin, Star } from 'lucide-react';
import { useTranslation } from '../i18n/i18n';
import { useFavorites } from '../hooks/useFavorites';
import { useSelectedLocation } from '../context/SelectedLocationContext';
import { getCachedForecast } from '../services/weatherCache';

export function Favorites() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { favorites, removeFavorite, isLoaded } = useFavorites();
  const { setSelectedLocation } = useSelectedLocation();

  if (!isLoaded) {
    return null;
  }

  const handleSelectFavorite = (location) => {
    setSelectedLocation(location);
    navigate('/');
  };

  const handleRemoveFavorite = (e, id) => {
    e.stopPropagation();
    removeFavorite(id);
  };

  const getCachedTemp = (location) => {
    const cacheKey = `${location.latitude},${location.longitude},${location.timezone}`;
    const cached = getCachedForecast(cacheKey);
    if (cached && cached.current) {
      return cached.current.temperature;
    }
    return null;
  };

  return (
    <div className="w-full transition-colors duration-300">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-2">
          <Star className="text-yellow-500 fill-yellow-500" /> {t('nav.favorites')}
        </h1>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <MapPin className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {t('favorites.noFavorites')}
            </h2>
            <p className="text-muted-foreground text-center max-w-md">
              {t('favorites.noFavoritesDesc')}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map((favorite) => {
              const cachedTemp = getCachedTemp(favorite);
              return (
                <div
                  key={favorite.id}
                  onClick={() => handleSelectFavorite(favorite)}
                  className="group bg-card border border-border rounded-lg shadow-sm p-6 hover:shadow-md transition-all cursor-pointer hover:border-primary"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-card-foreground">
                        {favorite.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {favorite.admin1 && `${favorite.admin1}, `}
                        {favorite.country}
                      </p>
                      {favorite.timezone && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {favorite.timezone}
                        </p>
                      )}
                    </div>
                    {cachedTemp !== null && (
                      <div className="text-right">
                        <p className="text-3xl font-bold text-primary">
                          {Math.round(cachedTemp)}°
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={(e) => handleRemoveFavorite(e, favorite.id)}
                    className="w-full mt-4 px-3 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors font-medium flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 size={18} />
                    {t('buttons.removeFavorite')}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
