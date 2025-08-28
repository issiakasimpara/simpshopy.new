
import { Template } from '@/types/template';

// Cache en mémoire pour les templates
const templateCache = new Map<string, { data: Template; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const templateCacheUtils = {
  set: (storeId: string, templateId: string, data: Template) => {
    const cacheKey = `${storeId}_${templateId}`;
    templateCache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
  },

  get: (storeId: string, templateId: string): Template | null => {
    const cacheKey = `${storeId}_${templateId}`;
    const cached = templateCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    return null;
  },

  delete: (storeId: string, templateId: string) => {
    const cacheKey = `${storeId}_${templateId}`;
    templateCache.delete(cacheKey);
  },

  clear: () => {
    templateCache.clear();
  }
};
