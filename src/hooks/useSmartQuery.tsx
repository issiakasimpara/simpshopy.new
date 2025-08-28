// ⚡ HOOK QUERY INTELLIGENT - OPTIMISÉ POUR LA PERFORMANCE
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useRef } from 'react';
import { performanceManager } from '@/utils/performanceManager';

interface SmartQueryOptions<T> {
  queryKey: (string | number)[];
  queryFn: () => Promise<T>;
  // Configuration intelligente basée sur le type de données
  dataType?: 'critical' | 'normal' | 'background';
  // Options avancées
  staleTime?: number;
  cacheTime?: number;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
  refetchInterval?: number;
  enabled?: boolean;
  retry?: number;
}

/**
 * ⚡ Configurations prédéfinies par type de données
 */
const DATA_TYPE_CONFIGS = {
  critical: {
    // Données critiques (commandes, paiements)
    staleTime: 30 * 1000, // 30 secondes
    cacheTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 60 * 1000, // 1 minute
    retry: 3,
  },
  normal: {
    // Données normales (produits, clients)
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  },
  background: {
    // Données en arrière-plan (analytics, stats)
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: 15 * 60 * 1000, // 15 minutes
    retry: 1,
  }
} as const;

/**
 * 🧠 Hook intelligent qui adapte automatiquement les performances
 */
export const useSmartQuery = <T,>({
  queryKey,
  queryFn,
  dataType = 'normal',
  ...customOptions
}: SmartQueryOptions<T>) => {
  const queryClient = useQueryClient();
  const startTimeRef = useRef<number>();

  // 🎯 Configuration intelligente basée sur le type de données
  const config = useMemo(() => {
    const baseConfig = DATA_TYPE_CONFIGS[dataType];
    return {
      ...baseConfig,
      ...customOptions, // Les options custom override la config par défaut
    };
  }, [dataType, customOptions]);

  // 🔧 Clé de requête stable (évite les re-renders inutiles)
  const stableQueryKey = useMemo(() => {
    return queryKey.map(key => 
      typeof key === 'object' ? JSON.stringify(key) : key
    );
  }, [queryKey]);

  // 🔧 Fonction de requête avec tracking de performance
  const trackedQueryFn = useCallback(async () => {
    startTimeRef.current = Date.now();
    const keyString = stableQueryKey.join(':');
    
    try {
      const result = await queryFn();
      
      // Track performance - ÉTAPE 1 RÉACTIVÉ
      if (startTimeRef.current) {
        performanceManager.trackQuery(keyString, startTimeRef.current);
      }
      
      return result;
    } catch (error) {
      // Track failed query - ÉTAPE 1 RÉACTIVÉ
      if (startTimeRef.current) {
        performanceManager.trackQuery(`${keyString}:ERROR`, startTimeRef.current);
      }
      throw error;
    }
  }, [queryFn, stableQueryKey]);

  // 🚀 Query principale avec configuration intelligente
  const query = useQuery({
    queryKey: stableQueryKey,
    queryFn: trackedQueryFn,
    ...config,
    // Retry intelligent avec backoff exponentiel
    retryDelay: (attemptIndex) => {
      const baseDelay = dataType === 'critical' ? 500 : 1000;
      return Math.min(baseDelay * 2 ** attemptIndex, 10000);
    },
  });

  // 🎯 Fonctions utilitaires optimisées
  const utilities = useMemo(() => ({
    // Précharger des données liées
    prefetch: (relatedKey: (string | number)[], relatedFn: () => Promise<any>) => {
      queryClient.prefetchQuery({
        queryKey: relatedKey,
        queryFn: relatedFn,
        staleTime: config.staleTime,
      });
    },

    // Invalider intelligemment
    invalidate: () => {
      queryClient.invalidateQueries({ 
        queryKey: stableQueryKey,
        exact: false 
      });
    },

    // Mise à jour optimiste
    updateCache: (updater: (oldData: T | undefined) => T) => {
      queryClient.setQueryData(stableQueryKey, updater);
    },

    // Forcer un refresh
    refresh: () => {
      return queryClient.refetchQueries({ 
        queryKey: stableQueryKey,
        exact: true 
      });
    },

    // Obtenir les métriques de performance - ÉTAPE 1 RÉACTIVÉ
    getPerformanceMetrics: () => {
      return performanceManager.getMetrics();
    }
  }), [queryClient, stableQueryKey, config.staleTime]);

  return {
    ...query,
    ...utilities,
    // Informations de debug
    debug: {
      queryKey: stableQueryKey,
      config,
      dataType,
      lastFetchTime: startTimeRef.current,
    }
  };
};

/**
 * 🎯 Hooks spécialisés pour différents types de données
 */

// Hook pour les données critiques (commandes, paiements)
export const useCriticalQuery = <T,>(
  queryKey: (string | number)[],
  queryFn: () => Promise<T>,
  options?: Omit<SmartQueryOptions<T>, 'dataType' | 'queryKey' | 'queryFn'>
) => {
  return useSmartQuery({
    queryKey,
    queryFn,
    dataType: 'critical',
    ...options,
  });
};

// Hook pour les données normales (produits, clients)
export const useNormalQuery = <T,>(
  queryKey: (string | number)[],
  queryFn: () => Promise<T>,
  options?: Omit<SmartQueryOptions<T>, 'dataType' | 'queryKey' | 'queryFn'>
) => {
  return useSmartQuery({
    queryKey,
    queryFn,
    dataType: 'normal',
    ...options,
  });
};

// Hook pour les données en arrière-plan (analytics, stats)
export const useBackgroundQuery = <T,>(
  queryKey: (string | number)[],
  queryFn: () => Promise<T>,
  options?: Omit<SmartQueryOptions<T>, 'dataType' | 'queryKey' | 'queryFn'>
) => {
  return useSmartQuery({
    queryKey,
    queryFn,
    dataType: 'background',
    ...options,
  });
};

/**
 * 🎯 Hook pour les requêtes dépendantes (évite les cascades)
 */
export const useDependentQueries = <T1, T2>(
  primaryQuery: {
    queryKey: (string | number)[];
    queryFn: () => Promise<T1>;
    dataType?: 'critical' | 'normal' | 'background';
  },
  dependentQuery: {
    queryKey: (data: T1) => (string | number)[];
    queryFn: (data: T1) => Promise<T2>;
    dataType?: 'critical' | 'normal' | 'background';
  }
) => {
  // Requête principale
  const primary = useSmartQuery(primaryQuery);

  // Requête dépendante (ne s'exécute que si la première réussit)
  const dependent = useSmartQuery({
    queryKey: primary.data ? dependentQuery.queryKey(primary.data) : ['dependent-disabled'],
    queryFn: () => primary.data ? dependentQuery.queryFn(primary.data) : Promise.resolve(null as T2),
    dataType: dependentQuery.dataType || 'normal',
    enabled: !!primary.data && !primary.isLoading && !primary.error,
  });

  return {
    primary,
    dependent,
    // États combinés
    isLoading: primary.isLoading || (primary.data && dependent.isLoading),
    error: primary.error || dependent.error,
    data: {
      primary: primary.data,
      dependent: dependent.data,
    },
  };
};
