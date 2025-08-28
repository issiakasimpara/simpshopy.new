import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type StoreType = Tables<'stores'>;
type ProductType = Tables<'products'>;
type TemplateType = Tables<'site_templates'>;

interface StorefrontData {
  store: StoreType;
  template: any; // Template data
  products: ProductType[];
}

/**
 * Hook optimisé pour récupérer toutes les données du Storefront en une seule requête
 */
export const useOptimizedStorefront = (storeSlug: string | undefined) => {
  return useQuery({
    queryKey: ['storefront', storeSlug],
    queryFn: async (): Promise<StorefrontData> => {
      if (!storeSlug) {
        throw new Error('Slug de boutique manquant');
      }

      // Requête unique optimisée avec jointures
      const { data: store, error: storeError } = await supabase
        .from('stores')
        .select(`
          *,
          site_templates!inner(
            template_data,
            is_published,
            updated_at
          ),
          products(
            id,
            name,
            description,
            price,
            images,
            status,
            category_id,
            created_at,
            updated_at
          )
        `)
        .eq('status', 'active')
        .eq('site_templates.is_published', true)
        .ilike('name', `%${storeSlug.replace(/-/g, ' ')}%`)
        .order('site_templates.updated_at', { ascending: false })
        .limit(1)
        .single();

      if (storeError) {
        console.error('Erreur lors de la récupération de la boutique:', storeError);
        throw new Error(`Erreur lors de la récupération de la boutique: ${storeError.message}`);
      }

      if (!store) {
        throw new Error(`Boutique "${storeSlug}" non trouvée ou non active`);
      }

      // Filtrer les produits actifs
      const activeProducts = store.products?.filter(p => p.status === 'active') || [];

      // Récupérer le template le plus récent
      const latestTemplate = store.site_templates?.[0]?.template_data || null;

      return {
        store,
        template: latestTemplate,
        products: activeProducts
      };
    },
    enabled: !!storeSlug,
    staleTime: 5 * 60 * 1000, // 5 minutes de cache
    cacheTime: 10 * 60 * 1000, // 10 minutes de cache
    retry: 2, // Réessayer 2 fois en cas d'échec
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Backoff exponentiel
  });
};

/**
 * Hook pour récupérer uniquement les données de base de la boutique
 */
export const useStoreBasicData = (storeSlug: string | undefined) => {
  return useQuery({
    queryKey: ['store-basic', storeSlug],
    queryFn: async () => {
      if (!storeSlug) throw new Error('Slug de boutique manquant');

      const { data, error } = await supabase
        .from('stores')
        .select('id, name, description, logo_url, status, created_at')
        .eq('status', 'active')
        .ilike('name', `%${storeSlug.replace(/-/g, ' ')}%`)
        .single();

      if (error) throw error;
      if (!data) throw new Error(`Boutique "${storeSlug}" non trouvée`);

      return data;
    },
    enabled: !!storeSlug,
    staleTime: 10 * 60 * 1000, // 10 minutes de cache
  });
};

/**
 * Hook pour récupérer les produits d'une boutique avec pagination
 */
export const useStoreProducts = (storeId: string | undefined, options?: {
  page?: number;
  limit?: number;
  categoryId?: string;
}) => {
  const { page = 1, limit = 20, categoryId } = options || {};

  return useQuery({
    queryKey: ['store-products', storeId, page, limit, categoryId],
    queryFn: async () => {
      if (!storeId) throw new Error('Store ID manquant');

      let query = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('store_id', storeId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        products: data || [],
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      };
    },
    enabled: !!storeId,
    staleTime: 2 * 60 * 1000, // 2 minutes de cache
  });
};

/**
 * Hook pour précharger les données du Storefront
 */
export const usePreloadStorefront = (storeSlug: string | undefined) => {
  return useQuery({
    queryKey: ['storefront-preload', storeSlug],
    queryFn: async () => {
      if (!storeSlug) return null;

      // Préchargement léger - juste les données essentielles
      const { data, error } = await supabase
        .from('stores')
        .select(`
          id,
          name,
          status,
          site_templates!inner(
            template_data,
            is_published
          )
        `)
        .eq('status', 'active')
        .eq('site_templates.is_published', true)
        .ilike('name', `%${storeSlug.replace(/-/g, ' ')}%`)
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!storeSlug,
    staleTime: 1 * 60 * 1000, // 1 minute de cache
  });
};
