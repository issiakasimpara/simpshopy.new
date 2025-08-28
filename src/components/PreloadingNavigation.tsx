import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useRoutePreloading } from './PreloadingIndicator';
import { cn } from '../lib/utils';

interface NavigationItem {
  path: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
}

interface PreloadingNavigationProps {
  items: NavigationItem[];
  className?: string;
  variant?: 'horizontal' | 'vertical';
}

export const PreloadingNavigation: React.FC<PreloadingNavigationProps> = ({
  items,
  className = '',
  variant = 'horizontal'
}) => {
  const location = useLocation();
  const { preloadRouteOnHover } = useRoutePreloading();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const containerClasses = cn(
    'flex gap-1',
    variant === 'vertical' ? 'flex-col' : 'flex-row',
    className
  );

  return (
    <nav className={containerClasses}>
      {items.map((item) => {
        const active = isActive(item.path);
        const preloadProps = preloadRouteOnHover(item.path);

        return (
          <Link
            key={item.path}
            to={item.path}
            {...preloadProps}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
              'hover:bg-accent hover:text-accent-foreground',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              active
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
            title={item.description}
          >
            {item.icon && (
              <span className="flex-shrink-0">
                {item.icon}
              </span>
            )}
            <span>{item.label}</span>
            {active && (
              <span className="ml-auto w-2 h-2 bg-current rounded-full animate-pulse" />
            )}
          </Link>
        );
      })}
    </nav>
  );
};

// Composant de navigation pour le dashboard avec preloading
export const DashboardNavigation: React.FC = () => {
  const navigationItems: NavigationItem[] = [
    {
      path: '/dashboard',
      label: 'Tableau de bord',
      description: 'Vue d\'ensemble de votre boutique'
    },
    {
      path: '/products',
      label: 'Produits',
      description: 'Gérer vos produits et catalogues'
    },
    {
      path: '/orders',
      label: 'Commandes',
      description: 'Suivre et gérer les commandes'
    },
    {
      path: '/customers',
      label: 'Clients',
      description: 'Gérer votre base de clients'
    },
    {
      path: '/analytics',
      label: 'Analytics',
      description: 'Analyses et statistiques'
    },
    {
      path: '/settings',
      label: 'Paramètres',
      description: 'Configuration de votre boutique'
    }
  ];

  return (
    <PreloadingNavigation
      items={navigationItems}
      variant="vertical"
      className="w-full"
    />
  );
};

// Hook pour le preloading intelligent basé sur les patterns de navigation
export const useIntelligentPreloading = () => {
  const { preloadRoute } = useRoutePreloading();

  const preloadBasedOnUserBehavior = React.useCallback(() => {
    // Analyser les patterns de navigation de l'utilisateur
    const userPatterns = JSON.parse(localStorage.getItem('navigation_patterns') || '{}');
    const currentPath = window.location.pathname;

    // Routes fréquemment visitées après la page actuelle
    const commonNextRoutes = {
      '/dashboard': ['/products', '/orders', '/analytics'],
      '/products': ['/orders', '/customers', '/analytics'],
      '/orders': ['/customers', '/analytics', '/settings'],
      '/customers': ['/analytics', '/settings'],
      '/analytics': ['/settings', '/products']
    };

    const nextRoutes = commonNextRoutes[currentPath as keyof typeof commonNextRoutes] || [];
    
    // Précharger les routes probables
    nextRoutes.forEach(route => {
      setTimeout(() => preloadRoute(route), 1000);
    });

    // Sauvegarder le pattern de navigation
    if (!userPatterns[currentPath]) {
      userPatterns[currentPath] = 0;
    }
    userPatterns[currentPath]++;
    localStorage.setItem('navigation_patterns', JSON.stringify(userPatterns));
  }, [preloadRoute]);

  React.useEffect(() => {
    preloadBasedOnUserBehavior();
  }, [preloadBasedOnUserBehavior]);

  return { preloadBasedOnUserBehavior };
};
