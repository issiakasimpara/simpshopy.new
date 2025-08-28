// ⚡ COMPOSANT DE FALLBACK OPTIMISÉ POUR LAZY LOADING
import { memo } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

interface LazyFallbackProps {
  message?: string;
  type?: 'page' | 'component' | 'modal';
}

const LazyFallback = memo<LazyFallbackProps>(({ 
  message = "Chargement...", 
  type = 'page' 
}) => {
  const containerClasses = {
    page: 'min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100',
    component: 'h-32 flex items-center justify-center',
    modal: 'h-48 flex items-center justify-center'
  };

  const spinnerSizes = {
    page: 'lg' as const,
    component: 'md' as const,
    modal: 'md' as const
  };

  return (
    <div className={containerClasses[type]}>
      <div className="text-center space-y-4">
        <LoadingSpinner 
          size={spinnerSizes[type]} 
          text={message}
        />
        {type === 'page' && (
          <div className="text-sm text-muted-foreground">
            Optimisation en cours...
          </div>
        )}
      </div>
    </div>
  );
});

LazyFallback.displayName = 'LazyFallback';

export default LazyFallback;
