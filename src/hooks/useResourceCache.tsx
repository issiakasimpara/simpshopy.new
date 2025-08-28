
import { useCallback } from 'react';

interface CachedResource {
  url: string;
  data: string | Blob;
  timestamp: number;
  type: 'image' | 'video' | 'template';
}

const RESOURCE_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const MAX_CACHE_SIZE = 50; // Maximum number of cached items

export const useResourceCache = () => {
  const getCacheKey = useCallback((url: string, type: string) => {
    return `resource_${type}_${btoa(url).slice(0, 20)}`;
  }, []);

  const getCachedResource = useCallback(async (url: string, type: 'image' | 'video' | 'template'): Promise<string | null> => {
    try {
      const cacheKey = getCacheKey(url, type);
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        const resource: CachedResource = JSON.parse(cached);
        if (Date.now() - resource.timestamp < RESOURCE_CACHE_DURATION) {
          return typeof resource.data === 'string' ? resource.data : URL.createObjectURL(resource.data);
        }
        localStorage.removeItem(cacheKey);
      }
    } catch (error) {
      console.warn('Resource cache read error:', error);
    }
    return null;
  }, [getCacheKey]);

  const setCachedResource = useCallback(async (url: string, data: string | Blob, type: 'image' | 'video' | 'template') => {
    try {
      // Check cache size and clean if needed
      const cacheKeys = Object.keys(localStorage).filter(key => key.startsWith('resource_'));
      if (cacheKeys.length >= MAX_CACHE_SIZE) {
        // Remove oldest entries
        const entries = cacheKeys.map(key => ({
          key,
          timestamp: JSON.parse(localStorage.getItem(key) || '{}').timestamp || 0
        })).sort((a, b) => a.timestamp - b.timestamp);
        
        entries.slice(0, 10).forEach(entry => {
          localStorage.removeItem(entry.key);
        });
      }

      const cacheKey = getCacheKey(url, type);
      const resource: CachedResource = {
        url,
        data,
        timestamp: Date.now(),
        type
      };
      
      localStorage.setItem(cacheKey, JSON.stringify(resource));
    } catch (error) {
      console.warn('Resource cache write error:', error);
    }
  }, [getCacheKey]);

  const clearResourceCache = useCallback(() => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('resource_')) {
        localStorage.removeItem(key);
      }
    });
  }, []);

  const preloadImage = useCallback(async (url: string): Promise<string> => {
    const cached = await getCachedResource(url, 'image');
    if (cached) return cached;

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        setCachedResource(url, url, 'image');
        resolve(url);
      };
      img.onerror = reject;
      img.src = url;
    });
  }, [getCachedResource, setCachedResource]);

  return {
    getCachedResource,
    setCachedResource,
    clearResourceCache,
    preloadImage
  };
};
