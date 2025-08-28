import React from 'react';
import { usePreloading } from '../hooks/usePreloading';

interface PreloadingIndicatorProps {
  showProgress?: boolean;
  showDetails?: boolean;
  className?: string;
}

export const PreloadingIndicator: React.FC<PreloadingIndicatorProps> = ({
  showProgress = true,
  showDetails = false,
  className = ''
}) => {
  const { isPreloading, preloadedResources, preloadConfig } = usePreloading();

  // Calculer le pourcentage de progression
  const totalResources = 
    preloadConfig.critical.length + 
    preloadConfig.important.length + 
    preloadConfig.fonts.length + 
    preloadConfig.images.length;
  
  const progress = totalResources > 0 ? (preloadedResources.size / totalResources) * 100 : 0;

  if (!isPreloading && preloadedResources.size >= totalResources) {
    return null;
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm ${className}`}>
      <div className="relative w-64 p-6 bg-card rounded-lg shadow-lg border">
        {/* Logo SimpShopy */}
        <div className="flex items-center justify-center mb-4">
          <img 
            src="/logo-simpshopy.png" 
            alt="SimpShopy" 
            className="h-8 w-auto opacity-80"
          />
        </div>

        {/* Titre */}
        <h3 className="text-center text-lg font-semibold text-foreground mb-4">
          Chargement de SimpShopy
        </h3>

        {/* Barre de progression */}
        {showProgress && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Optimisation en cours...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Détails du preloading */}
        {showDetails && (
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Ressources critiques:</span>
              <span className="text-green-500">
                {preloadedResources.size >= preloadConfig.critical.length ? '✅' : '⏳'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Polices:</span>
              <span className="text-green-500">
                {preloadedResources.size >= preloadConfig.critical.length + preloadConfig.fonts.length ? '✅' : '⏳'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Images:</span>
              <span className="text-green-500">
                {preloadedResources.size >= totalResources - preloadConfig.optional.length ? '✅' : '⏳'}
              </span>
            </div>
          </div>
        )}

        {/* Animation de chargement */}
        <div className="flex justify-center mt-4">
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-primary rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        </div>

        {/* Message d'optimisation */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          Optimisation des performances en cours...
        </p>
      </div>
    </div>
  );
};

// Composant de preloading minimal pour les transitions de route
export const RoutePreloadingIndicator: React.FC<{ routeName: string }> = ({ routeName }) => {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/60 backdrop-blur-sm">
      <div className="bg-card rounded-lg shadow-lg border p-4">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="text-sm font-medium text-foreground">
            Chargement de {routeName}...
          </span>
        </div>
      </div>
    </div>
  );
};

// Hook pour le preloading de route
export const useRoutePreloading = () => {
  const { preloadRoute } = usePreloading();

  const preloadRouteOnHover = React.useCallback((routePath: string) => {
    return {
      onMouseEnter: () => preloadRoute(routePath),
      onFocus: () => preloadRoute(routePath)
    };
  }, [preloadRoute]);

  const preloadRouteOnClick = React.useCallback((routePath: string) => {
    return {
      onClick: () => preloadRoute(routePath)
    };
  }, [preloadRoute]);

  return {
    preloadRouteOnHover,
    preloadRouteOnClick,
    preloadRoute
  };
};
