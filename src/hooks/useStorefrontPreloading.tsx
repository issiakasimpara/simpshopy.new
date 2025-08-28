import { useEffect, useCallback, useState } from 'react';

export interface StorefrontPreloadResource {
  href: string;
  as: 'script' | 'style' | 'image' | 'font' | 'fetch' | 'document';
  type?: string;
  crossorigin?: boolean;
  media?: string;
  importance?: 'high' | 'low' | 'auto';
}

export interface StorefrontPreloadConfig {
  critical: StorefrontPreloadResource[];
  important: StorefrontPreloadResource[];
  optional: StorefrontPreloadResource[];
}

/**
 * Hook de preloading optimisé pour le Storefront
 * Ne se déclenche qu'APRÈS que la boutique soit complètement chargée
 */
export const useStorefrontPreloading = (isStorefrontLoaded: boolean = false) => {
  const [preloadedResources, setPreloadedResources] = useState<Set<string>>(new Set());
  const [isPreloading, setIsPreloading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Configuration des ressources spécifiques au Storefront
  const preloadConfig: StorefrontPreloadConfig = {
    // Ressources critiques (après chargement du Storefront)
    critical: [
      {
        href: '/api/products',
        as: 'fetch',
        type: 'application/json'
      },
      {
        href: '/api/store-data',
        as: 'fetch',
        type: 'application/json'
      }
    ],

    // Ressources importantes (après les critiques)
    important: [
      {
        href: '/api/analytics',
        as: 'fetch',
        type: 'application/json'
      },
      {
        href: '/api/customers',
        as: 'fetch',
        type: 'application/json'
      }
    ],

    // Ressources optionnelles (en dernier)
    optional: [
      {
        href: '/api/orders',
        as: 'fetch',
        type: 'application/json'
      }
    ]
  };

  // Fonction pour créer un élément link de preload
  const createPreloadLink = useCallback((resource: StorefrontPreloadResource): HTMLLinkElement => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    
    if (resource.type) {
      link.type = resource.type;
    }
    
    if (resource.crossorigin) {
      link.crossOrigin = 'anonymous';
    }
    
    if (resource.media) {
      link.media = resource.media;
    }
    
    return link;
  }, []);

  // Fonction pour précharger une ressource
  const preloadResource = useCallback(async (resource: StorefrontPreloadResource): Promise<boolean> => {
    return new Promise((resolve) => {
      try {
        const link = createPreloadLink(resource);
        
        link.onload = () => {
          setPreloadedResources(prev => new Set(prev).add(resource.href));
          resolve(true);
        };
        
        link.onerror = () => {
          console.warn(`Échec du preload Storefront: ${resource.href}`);
          resolve(false);
        };
        
        document.head.appendChild(link);
      } catch (error) {
        console.warn(`Erreur lors du preload Storefront de ${resource.href}:`, error);
        resolve(false);
      }
    });
  }, [createPreloadLink]);

  // Fonction pour précharger un groupe de ressources
  const preloadGroup = useCallback(async (resources: StorefrontPreloadResource[]): Promise<void> => {
    const promises = resources.map(resource => preloadResource(resource));
    await Promise.allSettled(promises);
  }, [preloadResource]);

  // Fonction pour précharger les ressources critiques
  const preloadCritical = useCallback(async (): Promise<void> => {
    if (isPreloading) return;
    
    setIsPreloading(true);
    
    try {
      console.log('🔄 Preloading Storefront: Ressources critiques...');
      await preloadGroup(preloadConfig.critical);
      console.log('✅ Preloading Storefront: Ressources critiques terminé');
    } catch (error) {
      console.warn('⚠️ Erreur lors du preload des ressources critiques Storefront:', error);
    } finally {
      setIsPreloading(false);
    }
  }, [preloadGroup, preloadConfig, isPreloading]);

  // Fonction pour précharger les ressources importantes
  const preloadImportant = useCallback(async (): Promise<void> => {
    try {
      console.log('🔄 Preloading Storefront: Ressources importantes...');
      await preloadGroup(preloadConfig.important);
      console.log('✅ Preloading Storefront: Ressources importantes terminé');
    } catch (error) {
      console.warn('⚠️ Erreur lors du preload des ressources importantes Storefront:', error);
    }
  }, [preloadGroup, preloadConfig]);

  // Fonction pour précharger les ressources optionnelles
  const preloadOptional = useCallback(async (): Promise<void> => {
    try {
      console.log('🔄 Preloading Storefront: Ressources optionnelles...');
      await preloadGroup(preloadConfig.optional);
      console.log('✅ Preloading Storefront: Ressources optionnelles terminé');
    } catch (error) {
      console.warn('⚠️ Erreur lors du preload des ressources optionnelles Storefront:', error);
    }
  }, [preloadGroup, preloadConfig]);

  // Initialisation du preloading - SEULEMENT après chargement du Storefront
  useEffect(() => {
    if (initialized || !isStorefrontLoaded) return;
    
    const initializeStorefrontPreloading = async () => {
      setInitialized(true);
      
      console.log('🚀 Démarrage du preloading Storefront...');
      
      // Attendre que le Storefront soit complètement rendu
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Précharger les ressources critiques
      await preloadCritical();
      
      // Précharger les ressources importantes après un délai
      setTimeout(() => {
        preloadImportant();
      }, 2000);
      
      // Précharger les ressources optionnelles en dernier
      setTimeout(() => {
        preloadOptional();
      }, 5000);
    };

    initializeStorefrontPreloading();
  }, [initialized, isStorefrontLoaded, preloadCritical, preloadImportant, preloadOptional]);

  // Fonction pour précharger une route spécifique
  const preloadRoute = useCallback(async (routePath: string): Promise<void> => {
    const routeResource: StorefrontPreloadResource = {
      href: `/api/${routePath}`,
      as: 'fetch',
      type: 'application/json'
    };
    
    await preloadResource(routeResource);
  }, [preloadResource]);

  // Fonction pour précharger une image spécifique
  const preloadImage = useCallback(async (imagePath: string): Promise<void> => {
    const imageResource: StorefrontPreloadResource = {
      href: imagePath,
      as: 'image'
    };
    
    await preloadResource(imageResource);
  }, [preloadResource]);

  return {
    isPreloading,
    preloadedResources,
    initialized,
    preloadCritical,
    preloadImportant,
    preloadOptional,
    preloadRoute,
    preloadImage,
    preloadConfig
  };
};
