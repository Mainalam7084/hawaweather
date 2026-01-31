import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, Star, X, Box } from 'lucide-react';
import { usePreferences } from '../../hooks/usePreferences';
import { useDebounce } from '../../hooks/useDebounce';
import { useSelectedLocation } from '../../context/SelectedLocationContext';
import { useTranslation } from '../../i18n/i18n';
import { searchLocations } from '../../services/openMeteoGeocoding';
import { SearchDropdown } from '../SearchDropdown';

export function Header() {
  const { theme, toggleTheme, toggleLanguage, language, enable3d, toggle3d } = usePreferences();
  const { t } = useTranslation();
  const { setSelectedLocation } = useSelectedLocation();

  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [error, setError] = useState(null);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  const debouncedQuery = useDebounce(searchInput, 300);

  // Fetch locations when debounced query changes
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    setIsLoading(true);
    setError(null);

    searchLocations(debouncedQuery)
      .then((data) => {
        setResults(data);
        setIsOpen(true);
        setActiveIndex(-1);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Search error:', err);
        setError(err.message);
        setIsLoading(false);
        setResults([]);
        setIsOpen(false);
      });
  }, [debouncedQuery]);

  // Click-outside detection
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('pointerdown', handleClickOutside);
      return () => {
        document.removeEventListener('pointerdown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const closeDropdown = () => {
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
    setSearchInput(location.name);
    closeDropdown();
    setResults([]);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' && results.length > 0) {
        setIsOpen(true);
        setActiveIndex(0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;

      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && results[activeIndex]) {
          handleSelectLocation(results[activeIndex]);
        }
        break;

      case 'Escape':
        e.preventDefault();
        closeDropdown();
        searchInputRef.current?.blur();
        break;

      default:
        break;
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    // Close dropdown if input is cleared
    if (!value) {
      setIsOpen(false);
    }
  };

  return (
    <header className="bg-card text-card-foreground shadow-md transition-colors duration-300 border-b border-border">
      <nav className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-y-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 order-1">
          <span className="text-2xl font-bold text-primary">
            HAWA
          </span>
        </Link>

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-4 order-2 md:order-3">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="px-3 py-2 rounded-lg bg-muted text-muted-foreground font-semibold hover:bg-muted/80 transition-colors text-sm sm:text-base"
            aria-label="Toggle language"
          >
            {language === 'en' ? 'EN' : 'ES'}
          </button>

          {/* 3D Mode Toggle */}
          <button
            onClick={toggle3d}
            className={`p-2 rounded-lg transition-colors ${enable3d
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
            aria-label="Toggle 3D effects"
            title="Toggle 3D Background"
          >
            <Box size={20} />
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Favorites Link */}
          <Link
            to="/favorites"
            className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm sm:text-base flex items-center gap-2"
          >
            <Star size={18} />
            <span className="hidden sm:inline">{t('nav.favorites')}</span>
          </Link>
        </div>

        {/* Search Input */}
        <div
          ref={searchContainerRef}
          className="w-full md:w-auto md:flex-1 md:mx-8 relative order-3 md:order-2"
        >
          <input
            ref={searchInputRef}
            type="text"
            placeholder={t('search.placeholder')}
            value={searchInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (results.length > 0) {
                setIsOpen(true);
              }
            }}
            aria-autocomplete="list"
            aria-expanded={isOpen}
            aria-controls="search-listbox"
            className="w-full pl-4 pr-10 py-2 rounded-lg border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          />
          {searchInput && (
            <button
              onClick={() => {
                setSearchInput('');
                setIsOpen(false);
                setResults([]);
                searchInputRef.current?.focus();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted transition-colors"
              aria-label={t('search.clear') || "Clear search"}
            >
              <X size={16} />
            </button>
          )}
          <SearchDropdown
            results={results}
            isOpen={isOpen}
            isLoading={isLoading}
            activeIndex={activeIndex}
            onSelectItem={handleSelectLocation}
            onKeyDown={handleKeyDown}
          />
        </div>
      </nav>
    </header>
  );
}
