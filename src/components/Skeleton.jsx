import { useTranslation } from '../i18n/i18n';

export function Skeleton() {
  const { t } = useTranslation();

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-pulse">
      {/* Current Card Skeleton */}
      <div className="rounded-lg bg-muted h-[400px] shadow-lg p-8">
        <div className="h-10 w-2/3 bg-muted-foreground/20 rounded mb-4"></div>
        <div className="h-6 w-1/2 bg-muted-foreground/20 rounded mb-12"></div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex gap-4 items-center">
            <div className="w-20 h-20 bg-muted-foreground/20 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-12 w-24 bg-muted-foreground/20 rounded"></div>
              <div className="h-6 w-32 bg-muted-foreground/20 rounded"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-muted-foreground/20 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Hourly Forecast Skeleton */}
      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted-foreground/20 rounded"></div>
        <div className="h-40 rounded-lg bg-card border border-border p-6 flex gap-4 overflow-hidden">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="w-20 h-full bg-muted-foreground/10 rounded-lg flex-shrink-0"></div>
          ))}
        </div>
      </div>

      {/* Daily Forecast Skeleton */}
      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted-foreground/20 rounded"></div>
        <div className="space-y-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-lg bg-card border border-border shadow-sm"
            ></div>
          ))}
        </div>
      </div>

      {/* Loading text */}
      <p className="text-center text-muted-foreground mt-8">
        {t('states.loading')}
      </p>
    </div>
  );
}
