import React from 'react';

interface ImagePreloadOptions {
  priority?: 'high' | 'low' | 'auto';
  timeout?: number;
  retries?: number;
  onLoad?: (src: string) => void;
  onError?: (src: string, error: Error) => void;
}

interface PreloadedImage {
  src: string;
  loaded: boolean;
  error?: Error;
  timestamp: number;
}

class ImagePreloader {
  private cache = new Map<string, PreloadedImage>();
  private loadingQueue: Set<string> = new Set();
  private maxCacheSize = 100; // Nombre maximum d'images en cache

  /**
   * Précharge une image avec gestion d'erreurs et retry
   */
  async preloadImage(
    src: string, 
    options: ImagePreloadOptions = {}
  ): Promise<boolean> {
    const {
      priority = 'auto',
      timeout = 10000,
      retries = 2,
      onLoad,
      onError
    } = options;

    // Vérifier le cache
    const cached = this.cache.get(src);
    if (cached && Date.now() - cached.timestamp < 300000) { // 5 minutes
      return cached.loaded;
    }

    // Éviter les doublons
    if (this.loadingQueue.has(src)) {
      return new Promise((resolve) => {
        const checkLoaded = () => {
          const cached = this.cache.get(src);
          if (cached) {
            resolve(cached.loaded);
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
      });
    }

    this.loadingQueue.add(src);

    try {
      const success = await this.loadImageWithRetry(src, retries, timeout);
      
      this.cache.set(src, {
        src,
        loaded: success,
        timestamp: Date.now()
      });

      // Gérer la taille du cache
      this.manageCacheSize();

      if (success && onLoad) {
        onLoad(src);
      } else if (!success && onError) {
        onError(src, new Error(`Failed to load image: ${src}`));
      }

      return success;
    } finally {
      this.loadingQueue.delete(src);
    }
  }

  /**
   * Charge une image avec retry automatique
   */
  private async loadImageWithRetry(
    src: string, 
    retries: number, 
    timeout: number
  ): Promise<boolean> {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const success = await this.loadImage(src, timeout);
        if (success) return true;
      } catch (error) {
        console.warn(`Attempt ${attempt + 1} failed for image ${src}:`, error);
        if (attempt === retries) {
          console.error(`All attempts failed for image ${src}`);
          return false;
        }
        // Attendre avant de réessayer
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
    return false;
  }

  /**
   * Charge une image avec timeout
   */
  private loadImage(src: string, timeout: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const timer = setTimeout(() => {
        img.src = '';
        reject(new Error(`Image load timeout: ${src}`));
      }, timeout);

      img.onload = () => {
        clearTimeout(timer);
        resolve(true);
      };

      img.onerror = () => {
        clearTimeout(timer);
        reject(new Error(`Image load error: ${src}`));
      };

      img.src = src;
    });
  }

  /**
   * Précharge plusieurs images en parallèle
   */
  async preloadImages(
    sources: string[], 
    options: ImagePreloadOptions = {}
  ): Promise<Map<string, boolean>> {
    const results = new Map<string, boolean>();
    
    // Grouper par priorité
    const highPriority = sources.slice(0, 3); // Premières 3 images en priorité haute
    const lowPriority = sources.slice(3);

    // Charger les images prioritaires d'abord
    const highPriorityPromises = highPriority.map(src => 
      this.preloadImage(src, { ...options, priority: 'high' })
        .then(success => results.set(src, success))
    );

    await Promise.allSettled(highPriorityPromises);

    // Charger les autres images en arrière-plan
    const lowPriorityPromises = lowPriority.map(src => 
      this.preloadImage(src, { ...options, priority: 'low' })
        .then(success => results.set(src, success))
    );

    await Promise.allSettled(lowPriorityPromises);

    return results;
  }

  /**
   * Gère la taille du cache
   */
  private manageCacheSize(): void {
    if (this.cache.size <= this.maxCacheSize) return;

    // Supprimer les entrées les plus anciennes
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    const toRemove = entries.slice(0, this.cache.size - this.maxCacheSize);
    toRemove.forEach(([src]) => this.cache.delete(src));
  }

  /**
   * Vérifie si une image est déjà préchargée
   */
  isPreloaded(src: string): boolean {
    const cached = this.cache.get(src);
    return cached?.loaded || false;
  }

  /**
   * Nettoie le cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Obtient les statistiques du cache
   */
  getCacheStats(): { size: number; maxSize: number; hitRate: number } {
    const totalRequests = this.cache.size + this.loadingQueue.size;
    const hits = Array.from(this.cache.values()).filter(img => img.loaded).length;
    
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      hitRate: totalRequests > 0 ? hits / totalRequests : 0
    };
  }
}

// Instance singleton
export const imagePreloader = new ImagePreloader();

// Hook React pour le preloading d'images
export const useImagePreloader = () => {
  const preloadImage = React.useCallback((
    src: string, 
    options?: ImagePreloadOptions
  ) => {
    return imagePreloader.preloadImage(src, options);
  }, []);

  const preloadImages = React.useCallback((
    sources: string[], 
    options?: ImagePreloadOptions
  ) => {
    return imagePreloader.preloadImages(sources, options);
  }, []);

  const isPreloaded = React.useCallback((src: string) => {
    return imagePreloader.isPreloaded(src);
  }, []);

  return {
    preloadImage,
    preloadImages,
    isPreloaded,
    getCacheStats: imagePreloader.getCacheStats.bind(imagePreloader)
  };
};

// Composant React pour le preloading automatique d'images
export const PreloadImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}> = ({ src, alt, className, priority = false, onLoad, onError }) => {
  const { preloadImage, isPreloaded } = useImagePreloader();
  const [isLoading, setIsLoading] = React.useState(!isPreloaded(src));

  React.useEffect(() => {
    if (!isPreloaded(src)) {
      setIsLoading(true);
      preloadImage(src, {
        priority: priority ? 'high' : 'low',
        onLoad: () => {
          setIsLoading(false);
          onLoad?.();
        },
        onError: () => {
          setIsLoading(false);
          onError?.();
        }
      });
    }
  }, [src, priority, preloadImage, isPreloaded, onLoad, onError]);

  if (isLoading) {
    return (
      <div className={`animate-pulse bg-muted ${className}`}>
        <div className="w-full h-full bg-muted rounded" />
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={className}
      loading={priority ? 'eager' : 'lazy'}
    />
  );
};
