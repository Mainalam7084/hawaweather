import { Globe } from 'lucide-react';
import { useTranslation } from '../i18n/i18n';

export function EmptyState() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <Globe className="w-24 h-24 text-muted-foreground mb-6 opacity-50" />
      <h2 className="text-2xl font-bold text-foreground mb-2">
        {t('home.empty')}
      </h2>
      <p className="text-muted-foreground">
        {t('home.searchPrompt')}
      </p>
    </div>
  );
}
