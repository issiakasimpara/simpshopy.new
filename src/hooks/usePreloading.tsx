import { useEffect, useCallback, useState } from 'react';

export interface PreloadResource {
  href: string;
  as: 'script' | 'style' | 'image' | 'font' | 'fetch' | 'document';
  type?: string;
  crossorigin?: boolean;
  media?: string;
  importance?: 'high' | 'low' | 'auto';
}

export interface PreloadConfig {
  critical: PreloadResource[];
  important: PreloadResource[];
  optional: PreloadResource[];
  fonts: PreloadResource[];
  images: PreloadResource[];
}

export const usePreloading = () => {
  const [preloadedResources, setPreloadedResources] = useState<Set<string>>(new Set());
  const [isPreloading, setIsPreloading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Configuration des ressources à précharger
  const preloadConfig: PreloadConfig = {
    // Ressources critiques (chargement immédiat)
    critical: [
      {
        href: '/src/index.css',
        as: 'style',
        type: 'text/css'
      },
      {
        href: '/src/App.css',
        as: 'style',
        type: 'text/css'
      }
    ],

    // Ressources importantes (après le rendu initial)
    important: [
      // Seulement les ressources vraiment utilisées
      {
        href: '/api/products',
        as: 'fetch',
        type: 'application/json'
      }
    ],

    // Polices
    fonts: [
      {
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
        as: 'style',
        type: 'text/css'
      },
      {
        href: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
        as: 'font',
        type: 'font/woff2',
        crossorigin: true
      }
    ],

    // Images importantes
    images: [
      {
        href: '/logo-simpshopy.png',
        as: 'image',
        type: 'image/png'
      },
      {
        href: '/simpfavicon.png',
        as: 'image',
        type: 'image/png'
      }
    ],

    // Ressources optionnelles (lazy loading) - réduites au minimum
    optional: []
  };

  // Fonction pour créer un élément link de preload
  const createPreloadLink = useCallback((resource: PreloadResource): HTMLLinkElement => {
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
  const preloadResource = useCallback(async (resource: PreloadResource): Promise<boolean> => {
    return new Promise((resolve) => {
      try {
        const link = createPreloadLink(resource);
        
        link.onload = () => {
          setPreloadedResources(prev => new Set(prev).add(resource.href));
          resolve(true);
        };
        
        link.onerror = () => {
          console.warn(`Échec du preload: ${resource.href}`);
          resolve(false);
        };
        
        document.head.appendChild(link);
      } catch (error) {
        console.warn(`Erreur lors du preload de ${resource.href}:`, error);
        resolve(false);
      }
    });
  }, [createPreloadLink]);

  // Fonction pour précharger un groupe de ressources
  const preloadGroup = useCallback(async (resources: PreloadResource[]): Promise<void> => {
    const promises = resources.map(resource => preloadResource(resource));
    await Promise.allSettled(promises);
  }, [preloadResource]);

  // Fonction pour précharger les ressources critiques immédiatement
  const preloadCritical = useCallback(async (): Promise<void> => {
    if (isPreloading) return;
    
    setIsPreloading(true);
    
    try {
      // Précharger les ressources critiques en parallèle
      await preloadGroup(preloadConfig.critical);
      
      // Précharger les polices importantes
      await preloadGroup(preloadConfig.fonts);
      
      console.log('✅ Ressources critiques préchargées');
    } catch (error) {
      console.warn('⚠️ Erreur lors du preload des ressources critiques:', error);
    } finally {
      setIsPreloading(false);
    }
  }, [preloadGroup, preloadConfig, isPreloading]);

  // Fonction pour précharger les ressources importantes après le rendu initial
  const preloadImportant = useCallback(async (): Promise<void> => {
    try {
      // Attendre que le DOM soit prêt
      if (document.readyState === 'loading') {
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve, { once: true });
        });
      }
      
      // Précharger les ressources importantes
      await preloadGroup(preloadConfig.important);
      
      // Précharger les images importantes
      await preloadGroup(preloadConfig.images);
      
      console.log('✅ Ressources importantes préchargées');
    } catch (error) {
      console.warn('⚠️ Erreur lors du preload des ressources importantes:', error);
    }
  }, [preloadGroup, preloadConfig]);

  // Fonction pour précharger les ressources optionnelles (lazy loading)
  const preloadOptional = useCallback(async (): Promise<void> => {
    try {
      // Attendre que l'utilisateur soit inactif
      await new Promise(resolve => {
        const timeout = setTimeout(resolve, 2000); // 2 secondes d'inactivité
        
        const resetTimeout = () => {
          clearTimeout(timeout);
          setTimeout(resolve, 2000);
        };
        
        ['mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
          document.addEventListener(event, resetTimeout, { passive: true });
        });
      });
      
      await preloadGroup(preloadConfig.optional);
      console.log('✅ Ressources optionnelles préchargées');
    } catch (error) {
      console.warn('⚠️ Erreur lors du preload des ressources optionnelles:', error);
    }
  }, [preloadGroup, preloadConfig]);

  // Fonction pour précharger une route spécifique
  const preloadRoute = useCallback(async (routePath: string): Promise<void> => {
    const routeResource: PreloadResource = {
      href: `/api/${routePath}`,
      as: 'fetch',
      type: 'application/json'
    };
    
    await preloadResource(routeResource);
  }, [preloadResource]);

  // Fonction pour précharger une image spécifique
  const preloadImage = useCallback(async (imagePath: string): Promise<void> => {
    const imageResource: PreloadResource = {
      href: imagePath,
      as: 'image'
    };
    
    await preloadResource(imageResource);
  }, [preloadResource]);

  // Initialisation du preloading - DÉLAIÉ pour ne pas ralentir le Storefront
  useEffect(() => {
    if (initialized) return;
    
    const initializePreloading = async () => {
      setInitialized(true);
      
      // Attendre que la page soit complètement chargée avant de précharger
      if (document.readyState !== 'complete') {
        await new Promise(resolve => {
          window.addEventListener('load', resolve, { once: true });
        });
      }
      
      // Attendre encore 2 secondes pour laisser le Storefront se charger
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Précharger les ressources critiques en arrière-plan
      preloadCritical();
      
      // Précharger les ressources importantes après un délai supplémentaire
      setTimeout(() => {
        preloadImportant();
      }, 1000);
      
      // Précharger les ressources optionnelles en dernier
      setTimeout(() => {
        preloadOptional();
      }, 3000);
    };

    initializePreloading();
  }, [initialized, preloadCritical, preloadImportant, preloadOptional]);

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
