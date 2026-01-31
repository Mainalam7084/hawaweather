import { useEffect, useRef } from 'react';
import { useTranslation } from '../i18n/i18n';
import { useReducedMotion } from '../hooks/useReducedMotion';

export function SearchDropdown({
  results,
  isOpen,
  isLoading,
  activeIndex,
  onSelectItem,
  onKeyDown,
}) {
  const { t } = useTranslation();
  const dropdownRef = useRef(null);
  const activeItemRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // Scroll active item into view
  useEffect(() => {
    if (activeItemRef.current && isOpen) {
      activeItemRef.current.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex, isOpen]);

  if (!isOpen) {
    return null;
  }

  const animationClass = prefersReducedMotion
    ? ''
    : 'animate-in fade-in zoom-in-95 duration-200';

  return (
    <div
      id="search-listbox"
      ref={dropdownRef}
      role="listbox"
      className={`absolute top-full left-0 right-0 mt-1 bg-card rounded-lg shadow-lg border border-border max-h-64 overflow-y-auto z-50 text-card-foreground ${animationClass}`}
    >
      {isLoading && (
        <div className="px-4 py-3 text-sm text-muted-foreground">
          {t('search.loading')}
        </div>
      )}

      {!isLoading && results.length === 0 && (
        <div className="px-4 py-3 text-sm text-muted-foreground">
          {t('search.noResults')}
        </div>
      )}

      {results.map((result, index) => (
        <button
          key={result.id}
          type="button"
          ref={index === activeIndex ? activeItemRef : null}
          role="option"
          aria-selected={index === activeIndex}
          onPointerDown={() => onSelectItem(result)}
          onKeyDown={(e) => onKeyDown(e, result)}
          className={`w-full text-left px-4 py-3 border-b border-border last:border-b-0 transition-colors ${index === activeIndex
            ? 'bg-muted'
            : 'hover:bg-muted/50'
            }`}
        >
          <div className="font-semibold text-foreground">
            {result.name}
          </div>
          <div className="text-sm text-muted-foreground">
            {result.admin1 && `${result.admin1}, `}
            {result.country}
          </div>
        </button>
      ))}
    </div>
  );
}
