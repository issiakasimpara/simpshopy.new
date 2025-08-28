// ⚡ WRAPPER POUR LAZY LOADING AUTOMATIQUE
import { Suspense, ComponentType } from 'react';
import LazyFallback from './LazyFallback';

interface LazyWrapperProps {
  fallbackMessage?: string;
  fallbackType?: 'page' | 'component' | 'modal';
}

/**
 * HOC pour wrapper automatiquement les composants lazy avec Suspense
 */
export const withLazyWrapper = <P extends object>(
  Component: ComponentType<P>,
  options: LazyWrapperProps = {}
) => {
  const WrappedComponent = (props: P) => (
    <Suspense 
      fallback={
        <LazyFallback 
          message={options.fallbackMessage}
          type={options.fallbackType || 'page'}
        />
      }
    >
      <Component {...props} />
    </Suspense>
  );

  WrappedComponent.displayName = `LazyWrapper(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

/**
 * Composant wrapper direct pour les routes
 */
export const LazyRoute = ({ 
  component: Component, 
  fallbackMessage,
  ...props 
}: { 
  component: ComponentType<any>;
  fallbackMessage?: string;
  [key: string]: any;
}) => (
  <Suspense fallback={<LazyFallback message={fallbackMessage} type="page" />}>
    <Component {...props} />
  </Suspense>
);

export default withLazyWrapper;
