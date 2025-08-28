import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

interface OptimizedQueryOptions<T> {
  queryKey: (string | number)[];
  queryFn: () => Promise<T>;
  staleTime?: number;
  cacheTime?: number;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
  enabled?: boolean;
}

/**
 * Hook optimisé pour des requêtes ultra-rapides avec cache intelligent
 */
export const useOptimizedQuery = <T,>({
  queryKey,
  queryFn,
  staleTime = 5 * 60 * 1000, // 5 minutes par défaut
  cacheTime = 10 * 60 * 1000, // 10 minutes par défaut
  refetchOnWindowFocus = false,
  refetchOnMount = false,
  enabled = true,
}: OptimizedQueryOptions<T>) => {
  const queryClient = useQueryClient();

  // ⚡ OPTIMISATION CORRIGÉE: Éviter JSON.stringify qui cause des re-renders
  const memoizedQueryKey = useMemo(() => queryKey, queryKey);

  // ⚡ OPTIMISATION CORRIGÉE: Dépendances stables pour éviter les re-créations
  const memoizedQueryFn = useCallback(queryFn, [queryFn]);

  const query = useQuery({
    queryKey: memoizedQueryKey,
    queryFn: memoizedQueryFn,
    staleTime,
    cacheTime,
    refetchOnWindowFocus,
    refetchOnMount,
    enabled,
    // Optimisations supplémentaires
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Fonction pour précharger des données liées
  const prefetchRelated = useCallback(
    (relatedQueryKey: (string | number)[], relatedQueryFn: () => Promise<any>) => {
      queryClient.prefetchQuery({
        queryKey: relatedQueryKey,
        queryFn: relatedQueryFn,
        staleTime,
      });
    },
    [queryClient, staleTime]
  );

  // Fonction pour invalider le cache de manière optimisée
  const invalidateCache = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: memoizedQueryKey });
  }, [queryClient, memoizedQueryKey]);

  // Fonction pour mettre à jour le cache directement
  const updateCache = useCallback(
    (updater: (oldData: T | undefined) => T) => {
      queryClient.setQueryData(memoizedQueryKey, updater);
    },
    [queryClient, memoizedQueryKey]
  );

  return {
    ...query,
    prefetchRelated,
    invalidateCache,
    updateCache,
  };
};

/**
 * Hook spécialisé pour les produits avec optimisations e-commerce
 */
export const useOptimizedProducts = (storeId?: string) => {
  return useOptimizedQuery({
    queryKey: ['products', storeId],
    queryFn: async () => {
      if (!storeId) return [];
      
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          price,
          images,
          status,
          category_id,
          categories(name)
        `)
        .eq('store_id', storeId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!storeId,
    staleTime: 2 * 60 * 1000, // 2 minutes pour les produits
  });
};

/**
 * Hook spécialisé pour les boutiques avec cache long
 */
export const useOptimizedStore = (storeId?: string) => {
  return useOptimizedQuery({
    queryKey: ['store', storeId],
    queryFn: async () => {
      if (!storeId) return null;
      
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('id', storeId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!storeId,
    staleTime: 10 * 60 * 1000, // 10 minutes pour les infos boutique
  });
};
