// ⚡ COMPOSANTS UI OPTIMISÉS POUR LA PERFORMANCE
import React, { memo, useMemo, useCallback, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { useComponentPerformance } from '@/hooks/useComponentPerformance';

// 🎯 Types pour les props optimisées
interface OptimizedProps {
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

/**
 * ⚡ Bouton optimisé avec memoization intelligente
 */
export const OptimizedButton = memo(forwardRef<HTMLButtonElement, OptimizedProps & {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}>(({ 
  className, 
  children, 
  onClick, 
  disabled, 
  variant = 'default', 
  size = 'default',
  ...props 
}, ref) => {
  useComponentPerformance({
    componentName: 'OptimizedButton',
    trackRenders: true,
    slowRenderThreshold: 8 // Boutons doivent être très rapides
  });

  // Memoization des classes CSS
  const buttonClasses = useMemo(() => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
    
    const variantClasses = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'underline-offset-4 hover:underline text-primary'
    };

    const sizeClasses = {
      default: 'h-10 py-2 px-4',
      sm: 'h-9 px-3 rounded-md',
      lg: 'h-11 px-8 rounded-md',
      icon: 'h-10 w-10'
    };

    return cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className
    );
  }, [variant, size, className]);

  // Callback optimisé
  const handleClick = useCallback(() => {
    if (!disabled && onClick) {
      onClick();
    }
  }, [onClick, disabled]);

  return (
    <button
      ref={ref}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}));

OptimizedButton.displayName = 'OptimizedButton';

/**
 * ⚡ Card optimisée avec lazy rendering
 */
export const OptimizedCard = memo<OptimizedProps & {
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  lazy?: boolean;
}>(({ 
  className, 
  children, 
  title, 
  description, 
  footer, 
  lazy = false 
}) => {
  usePerformanceTracker('OptimizedCard');

  // Lazy rendering pour les cartes non visibles
  const [isVisible, setIsVisible] = React.useState(!lazy);
  const cardRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!lazy || isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, isVisible]);

  const cardClasses = useMemo(() => cn(
    'rounded-lg border bg-card text-card-foreground shadow-sm',
    className
  ), [className]);

  if (lazy && !isVisible) {
    return (
      <div 
        ref={cardRef}
        className={cn(cardClasses, 'h-32 animate-pulse bg-muted')}
      />
    );
  }

  return (
    <div ref={cardRef} className={cardClasses}>
      {(title || description) && (
        <div className="flex flex-col space-y-1.5 p-6">
          {title && (
            <h3 className="text-2xl font-semibold leading-none tracking-tight">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}
      {children && (
        <div className="p-6 pt-0">
          {children}
        </div>
      )}
      {footer && (
        <div className="flex items-center p-6 pt-0">
          {footer}
        </div>
      )}
    </div>
  );
});

OptimizedCard.displayName = 'OptimizedCard';

/**
 * ⚡ Liste virtualisée pour de grandes quantités de données
 */
export const OptimizedList = memo<{
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  itemHeight?: number;
  containerHeight?: number;
  className?: string;
}>(({ 
  items, 
  renderItem, 
  itemHeight = 60, 
  containerHeight = 400, 
  className 
}) => {
  usePerformanceTracker('OptimizedList');

  const [scrollTop, setScrollTop] = React.useState(0);

  // Calculer les éléments visibles
  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );

    return {
      startIndex: Math.max(0, startIndex),
      endIndex,
      items: items.slice(startIndex, endIndex)
    };
  }, [items, scrollTop, itemHeight, containerHeight]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleItems.startIndex * itemHeight;

  return (
    <div 
      className={cn('overflow-auto', className)}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.items.map((item, index) => (
            <div key={visibleItems.startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, visibleItems.startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

OptimizedList.displayName = 'OptimizedList';

/**
 * ⚡ Skeleton optimisé pour le loading
 */
export const OptimizedSkeleton = memo<{
  className?: string;
  lines?: number;
  avatar?: boolean;
}>(({ className, lines = 3, avatar = false }) => {
  const skeletonLines = useMemo(() => 
    Array.from({ length: lines }, (_, i) => (
      <div 
        key={i}
        className={cn(
          'h-4 bg-muted rounded animate-pulse',
          i === lines - 1 ? 'w-3/4' : 'w-full'
        )}
      />
    )), [lines]
  );

  return (
    <div className={cn('space-y-3', className)}>
      {avatar && (
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-muted rounded-full animate-pulse" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
            <div className="h-3 bg-muted rounded animate-pulse w-1/3" />
          </div>
        </div>
      )}
      <div className="space-y-2">
        {skeletonLines}
      </div>
    </div>
  );
});

OptimizedSkeleton.displayName = 'OptimizedSkeleton';

/**
 * ⚡ Badge optimisé
 */
export const OptimizedBadge = memo<{
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
  children: React.ReactNode;
}>(({ variant = 'default', className, children }) => {
  const badgeClasses = useMemo(() => {
    const baseClasses = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';
    
    const variantClasses = {
      default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
      secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
      destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
      outline: 'text-foreground'
    };

    return cn(baseClasses, variantClasses[variant], className);
  }, [variant, className]);

  return (
    <div className={badgeClasses}>
      {children}
    </div>
  );
});

OptimizedBadge.displayName = 'OptimizedBadge';
