// ⚡ OPTIMISEUR DE REQUÊTES
// Gère automatiquement les retry, le cache et les fallbacks

interface QueryConfig {
  retryAttempts: number;
  retryDelay: number;
  cacheTime: number;
  staleTime: number;
  enableOfflineCache: boolean;
  enableBackgroundSync: boolean;
}

interface QueryResult<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isStale: boolean;
  lastUpdated: number;
}

interface CachedQuery<T> {
  data: T;
  timestamp: number;
  version: number;
}

class QueryOptimizer {
  private static instance: QueryOptimizer;
  private cache: Map<string, CachedQuery<any>> = new Map();
  private pendingQueries: Map<string, Promise<any>> = new Map();
  private offlineQueue: Array<{ key: string; action: () => Promise<void> }> = [];
  
  private config: QueryConfig = {
    retryAttempts: 3,
    retryDelay: 1000,
    cacheTime: 5 * 60 * 1000, // 5 minutes
    staleTime: 2 * 60 * 1000, // 2 minutes
    enableOfflineCache: true,
    enableBackgroundSync: true
  };

  private constructor() {
    this.setupOfflineHandling();
  }

  static getInstance(): QueryOptimizer {
    if (!QueryOptimizer.instance) {
      QueryOptimizer.instance = new QueryOptimizer();
    }
    return QueryOptimizer.instance;
  }

  /**
   * 🌐 Configurer la gestion hors ligne
   */
  private setupOfflineHandling(): void {
    if (!this.config.enableOfflineCache) return;

    window.addEventListener('online', () => {
      this.processOfflineQueue();
    });

    window.addEventListener('offline', () => {
      console.log('📱 Mode hors ligne activé - Utilisation du cache local');
    });
  }

  /**
   * ⚡ Exécuter une requête optimisée
   */
  async executeQuery<T>(
    key: string,
    queryFn: () => Promise<T>,
    options?: Partial<QueryConfig>
  ): Promise<QueryResult<T>> {
    const config = { ...this.config, ...options };
    
    // Vérifier le cache d'abord
    const cached = this.getCachedData<T>(key);
    if (cached && !this.isStale(cached.timestamp, config.staleTime)) {
      return {
        data: cached.data,
        error: null,
        isLoading: false,
        isStale: false,
        lastUpdated: cached.timestamp
      };
    }

    // Vérifier si une requête similaire est en cours
    if (this.pendingQueries.has(key)) {
      try {
        const data = await this.pendingQueries.get(key);
        return {
          data,
          error: null,
          isLoading: false,
          isStale: false,
          lastUpdated: Date.now()
        };
      } catch (error) {
        return {
          data: null,
          error: error as Error,
          isLoading: false,
          isStale: false,
          lastUpdated: Date.now()
        };
      }
    }

    // Exécuter la requête avec retry
    const queryPromise = this.executeWithRetry(key, queryFn, config);
    this.pendingQueries.set(key, queryPromise);

    try {
      const data = await queryPromise;
      
      // Mettre en cache
      this.cacheData(key, data);
      
      return {
        data,
        error: null,
        isLoading: false,
        isStale: false,
        lastUpdated: Date.now()
      };
    } catch (error) {
      // Retourner les données du cache si disponibles
      const cached = this.getCachedData<T>(key);
      if (cached) {
        return {
          data: cached.data,
          error: error as Error,
          isLoading: false,
          isStale: true,
          lastUpdated: cached.timestamp
        };
      }
      
      return {
        data: null,
        error: error as Error,
        isLoading: false,
        isStale: false,
        lastUpdated: Date.now()
      };
    } finally {
      this.pendingQueries.delete(key);
    }
  }

  /**
   * 🔄 Exécuter avec retry automatique
   */
  private async executeWithRetry<T>(
    key: string,
    queryFn: () => Promise<T>,
    config: QueryConfig
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= config.retryAttempts; attempt++) {
      try {
        return await queryFn();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === config.retryAttempts) {
          throw lastError;
        }
        
        // Attendre avant de retenter
        await new Promise(resolve => setTimeout(resolve, config.retryDelay * attempt));
        
        console.warn(`🔄 Tentative ${attempt}/${config.retryAttempts} échouée pour ${key}:`, error);
      }
    }
    
    throw lastError!;
  }

  /**
   * 💾 Mettre en cache
   */
  private cacheData<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      version: this.getCacheVersion(key) + 1
    });
    
    // Nettoyer le cache si nécessaire
    this.cleanupCache();
  }

  /**
   * 📖 Obtenir les données du cache
   */
  private getCachedData<T>(key: string): CachedQuery<T> | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    // Vérifier si les données ne sont pas expirées
    if (Date.now() - cached.timestamp > this.config.cacheTime) {
      this.cache.delete(key);
      return null;
    }
    
    return cached;
  }

  /**
   * 🔄 Vérifier si les données sont périmées
   */
  private isStale(timestamp: number, staleTime: number): boolean {
    return Date.now() - timestamp > staleTime;
  }

  /**
   * 🧹 Nettoyer le cache
   */
  private cleanupCache(): void {
    const now = Date.now();
    const maxAge = this.config.cacheTime;
    
    for (const [key, cached] of this.cache.entries()) {
      if (now - cached.timestamp > maxAge) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * 🔢 Obtenir la version du cache
   */
  private getCacheVersion(key: string): number {
    const cached = this.cache.get(key);
    return cached ? cached.version : 0;
  }

  /**
   * 📱 Traiter la file d'attente hors ligne
   */
  private async processOfflineQueue(): Promise<void> {
    if (this.offlineQueue.length === 0) return;
    
    console.log(`📱 Traitement de ${this.offlineQueue.length} actions en attente...`);
    
    const queue = [...this.offlineQueue];
    this.offlineQueue = [];
    
    for (const item of queue) {
      try {
        await item.action();
        console.log(`✅ Action traitée: ${item.key}`);
      } catch (error) {
        console.error(`❌ Échec du traitement: ${item.key}`, error);
        // Remettre dans la file d'attente
        this.offlineQueue.push(item);
      }
    }
  }

  /**
   * 📱 Ajouter à la file d'attente hors ligne
   */
  addToOfflineQueue(key: string, action: () => Promise<void>): void {
    if (!this.config.enableOfflineCache) return;
    
    this.offlineQueue.push({ key, action });
    console.log(`📱 Action ajoutée à la file d'attente: ${key}`);
  }

  /**
   * 🗑️ Invalider le cache
   */
  invalidateCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * 🔄 Précharger des données
   */
  async prefetch<T>(key: string, queryFn: () => Promise<T>): Promise<void> {
    try {
      const data = await queryFn();
      this.cacheData(key, data);
    } catch (error) {
      console.warn(`⚠️ Échec du préchargement pour ${key}:`, error);
    }
  }

  /**
   * 📊 Obtenir les statistiques du cache
   */
  getCacheStats(): {
    totalEntries: number;
    totalSize: number;
    offlineQueueLength: number;
  } {
    let totalSize = 0;
    for (const cached of this.cache.values()) {
      totalSize += JSON.stringify(cached.data).length;
    }
    
    return {
      totalEntries: this.cache.size,
      totalSize,
      offlineQueueLength: this.offlineQueue.length
    };
  }

  /**
   * 🧹 Nettoyer complètement
   */
  cleanup(): void {
    this.cache.clear();
    this.pendingQueries.clear();
    this.offlineQueue = [];
  }
}

// Instance globale
export const queryOptimizer = QueryOptimizer.getInstance();

// Hook React pour utiliser l'optimiseur de requêtes
export const useOptimizedQuery = <T>(
  key: string,
  queryFn: () => Promise<T>,
  options?: Partial<QueryConfig>
) => {
  const [result, setResult] = React.useState<QueryResult<T>>({
    data: null,
    error: null,
    isLoading: true,
    isStale: false,
    lastUpdated: 0
  });

  React.useEffect(() => {
    let isMounted = true;
    
    const executeQuery = async () => {
      try {
        const queryResult = await queryOptimizer.executeQuery(key, queryFn, options);
        
        if (isMounted) {
          setResult(queryResult);
        }
      } catch (error) {
        if (isMounted) {
          setResult({
            data: null,
            error: error as Error,
            isLoading: false,
            isStale: false,
            lastUpdated: Date.now()
          });
        }
      }
    };

    executeQuery();

    return () => {
      isMounted = false;
    };
  }, [key, JSON.stringify(options)]);

  const refetch = React.useCallback(async () => {
    setResult(prev => ({ ...prev, isLoading: true }));
    
    try {
      const queryResult = await queryOptimizer.executeQuery(key, queryFn, options);
      setResult(queryResult);
    } catch (error) {
      setResult({
        data: null,
        error: error as Error,
        isLoading: false,
        isStale: false,
        lastUpdated: Date.now()
      });
    }
  }, [key, queryFn, options]);

  return { ...result, refetch };
}; 