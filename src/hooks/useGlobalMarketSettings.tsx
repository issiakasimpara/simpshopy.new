import { useQuery, useQueryClient } from '@tanstack/react-query';
import { StoreCurrencyService, type StoreCurrencySettings } from '@/services/storeCurrencyService';

// Cache global pour éviter les requêtes multiples
const globalMarketSettingsCache = new Map<string, StoreCurrencySettings>();

export function useGlobalMarketSettings(storeId: string | null) {
  const cacheKey = `global-market-settings-${storeId}`;

  return useQuery({
    queryKey: [cacheKey],
    queryFn: async (): Promise<StoreCurrencySettings | null> => {
      if (!storeId) return null;

      // 🔐 Validation multi-tenant supplémentaire
      if (typeof storeId !== 'string' || storeId.length === 0) {
        console.error('❌ StoreId invalide pour multi-tenant:', storeId);
        return null;
      }

      // Vérifier le cache global d'abord
      if (globalMarketSettingsCache.has(storeId)) {
        console.log(`📦 Cache global hit pour store ${storeId}`);
        return globalMarketSettingsCache.get(storeId)!;
      }

      console.log(`🌐 Requête globale market_settings pour store ${storeId}`);
      
      // Utiliser le service existant au lieu d'appels directs à Supabase
      const data = await StoreCurrencyService.getStoreCurrencySettings(storeId);

      if (!data) {
        console.error('Erreur market_settings globale: données non trouvées');
        return null;
      }

      // 🔐 Validation multi-tenant des données reçues
      if (data.store_id !== storeId) {
        console.error('❌ Violation multi-tenant détectée:', {
          requested: storeId,
          received: data.store_id
        });
        return null;
      }

      // Mettre en cache global
      globalMarketSettingsCache.set(storeId, data);
      
      return data;
    },
    enabled: !!storeId,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 heure (remplace cacheTime)
    refetchOnWindowFocus: false,
    retry: false,
  });
}

// Hook pour invalider le cache global
export function useInvalidateGlobalMarketSettings() {
  const queryClient = useQueryClient();
  
  return (storeId: string) => {
    globalMarketSettingsCache.delete(storeId);
    queryClient.invalidateQueries({ queryKey: [`global-market-settings-${storeId}`] });
  };
}

// Hook pour mettre à jour le cache global
export function useUpdateGlobalMarketSettings() {
  const queryClient = useQueryClient();
  
  return (storeId: string, settings: StoreCurrencySettings) => {
    globalMarketSettingsCache.set(storeId, settings);
    queryClient.setQueryData([`global-market-settings-${storeId}`], settings);
  };
}

// Hook pour nettoyer le cache global
export function useGlobalMarketSettingsCleanup() {
  return () => {
    globalMarketSettingsCache.clear();
  };
}
