import { AlertTriangle } from 'lucide-react';
import { useTranslation } from '../i18n/i18n';

export function ErrorState({ error }) {
  const { t } = useTranslation();

  return (
    <div className="rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900 p-8 shadow-lg">
      <div className="flex items-center gap-4 mb-4">
        <AlertTriangle className="text-red-500 w-10 h-10" />
        <h2 className="text-2xl font-bold text-red-900 dark:text-red-100">
          {t('errors.forecastError')}
        </h2>
      </div>

      <p className="text-red-800 dark:text-red-200 mb-4">
        {error || t('errors.network')}
      </p>
    </div>
  );
}
