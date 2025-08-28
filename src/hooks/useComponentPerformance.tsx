// ⚡ HOOK DE PERFORMANCE POUR COMPOSANTS
import { useEffect, useRef, useCallback } from 'react';
import { performanceManager } from '@/utils/performanceManager';

interface ComponentPerformanceOptions {
  componentName: string;
  trackRenders?: boolean;
  trackMounts?: boolean;
  logSlowRenders?: boolean;
  slowRenderThreshold?: number;
}

/**
 * Hook pour tracker les performances d'un composant spécifique
 */
export const useComponentPerformance = ({
  componentName,
  trackRenders = true,
  trackMounts = true,
  logSlowRenders = true,
  slowRenderThreshold = 16 // 16ms = 60fps
}: ComponentPerformanceOptions) => {
  const renderStartTime = useRef<number>();
  const mountTime = useRef<number>();
  const renderCount = useRef(0);

  // Track mount time
  useEffect(() => {
    if (trackMounts) {
      mountTime.current = Date.now();
      console.log(`🚀 ${componentName} mounted`);
    }

    return () => {
      if (trackMounts && mountTime.current) {
        const mountDuration = Date.now() - mountTime.current;
        console.log(`🔄 ${componentName} unmounted after ${mountDuration}ms`);
      }
    };
  }, [componentName, trackMounts]);

  // Track render performance
  useEffect(() => {
    if (trackRenders) {
      const renderEndTime = Date.now();
      renderCount.current++;

      if (renderStartTime.current) {
        const renderDuration = renderEndTime - renderStartTime.current;
        
        // Track with performance manager
        performanceManager.trackRender(componentName);
        
        // Log slow renders
        if (logSlowRenders && renderDuration > slowRenderThreshold) {
          console.warn(`🐌 Slow render: ${componentName} took ${renderDuration}ms (render #${renderCount.current})`);
        }
      }
    }
  });

  // Start render timing
  if (trackRenders) {
    renderStartTime.current = Date.now();
  }

  // Utility functions
  const trackCustomMetric = useCallback((metricName: string, value: number) => {
    performanceManager.trackQuery(`${componentName}:${metricName}`, Date.now() - value);
  }, [componentName]);

  const getRenderCount = useCallback(() => renderCount.current, []);

  const getMountDuration = useCallback(() => {
    return mountTime.current ? Date.now() - mountTime.current : 0;
  }, []);

  return {
    trackCustomMetric,
    getRenderCount,
    getMountDuration,
    componentName
  };
};

/**
 * HOC pour wrapper automatiquement les composants avec tracking de performance
 */
export const withPerformanceTracking = <P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<ComponentPerformanceOptions, 'componentName'> = {}
) => {
  const WrappedComponent = (props: P) => {
    const componentName = Component.displayName || Component.name || 'UnknownComponent';
    
    useComponentPerformance({
      componentName,
      ...options
    });

    return <Component {...props} />;
  };

  WrappedComponent.displayName = `withPerformanceTracking(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

export default useComponentPerformance;
