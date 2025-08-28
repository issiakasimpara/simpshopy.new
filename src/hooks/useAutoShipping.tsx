import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook pour créer automatiquement les méthodes de livraison par défaut
 * NOUVELLE VERSION AVEC TOUTE L'AFRIQUE
 */
export const useAutoShipping = (storeId?: string) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Créer les zones et méthodes complètes pour toute l'Afrique
  const createDefaultShippingMethods = useCallback(async (storeId: string) => {
    console.log('🚀 Création automatique COMPLÈTE pour toute l\'Afrique - Store:', storeId);

    try {
      setIsLoading(true);

      // 1. Vérifier si des méthodes existent déjà
      const { data: existingMethods, error: checkError } = await supabase
        .from('shipping_methods')
        .select('id')
        .eq('store_id', storeId)
        .limit(1);

      if (checkError && checkError.code !== 'PGRST116') {
        console.warn('⚠️ Erreur vérification méthodes existantes:', checkError);
        // Continuer quand même
      }

      if (existingMethods && existingMethods.length > 0) {
        console.log('✅ Méthodes de livraison déjà configurées pour cette boutique');
        setIsInitialized(true);
        return true;
      }

      // 2. Utiliser la fonction SQL pour créer toutes les zones et méthodes
      console.log('🌍 Création complète via fonction SQL...');
      const { data: result, error: functionError } = await supabase
        .rpc('create_default_shipping_for_store', { store_uuid: storeId });

      if (functionError) {
        console.error('❌ Erreur fonction SQL:', functionError);
        throw functionError;
      }

      console.log('✅ Résultat création:', result);
      setIsInitialized(true);

      toast({
        title: "Livraisons configurées !",
        description: "Toutes les zones d'Afrique et méthodes de livraison ont été créées automatiquement.",
      });

      return true;

    } catch (error) {
      console.error('💥 Erreur configuration automatique:', error);
      
      toast({
        title: "Erreur configuration",
        description: "Impossible de configurer les livraisons automatiquement.",
        variant: "destructive"
      });

      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Auto-initialisation quand un storeId est fourni
  useEffect(() => {
    if (storeId && !isInitialized && !isLoading) {
      createDefaultShippingMethods(storeId);
    }
  }, [storeId, isInitialized, isLoading, createDefaultShippingMethods]);

  return {
    isInitialized,
    isLoading,
    createDefaultShippingMethods
  };
};

/**
 * Hook simple pour récupérer les méthodes de livraison de l'admin
 * VERSION PROPRE - RESTART FROM ZERO
 */
export const useShippingWithAutoSetup = (storeId?: string, countryCode?: string) => {
  const [methods, setMethods] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadShippingMethods = useCallback(async () => {
    if (!storeId) return;

    try {
      setIsLoading(true);
      // Log seulement en développement et rarement
      if (import.meta.env.DEV && Math.random() < 0.05) {
        console.log('🚚 Chargement méthodes pour boutique:', storeId);
      }

      // Récupérer les méthodes de cette boutique
      const { data: shippingMethods, error } = await supabase
        .from('shipping_methods')
        .select('*')
        .eq('store_id', storeId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erreur chargement méthodes:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        setMethods([]);
        return;
      }

      // Log seulement en développement et rarement
      if (import.meta.env.DEV && Math.random() < 0.05) {
        console.log('✅ Méthodes trouvées:', shippingMethods?.length || 0);
      }

      // Normaliser les méthodes pour s'assurer que estimated_days existe
      const normalizedMethods = shippingMethods?.map(method => {
        // Priorité 1: Utiliser le display_text des conditions si disponible
        if (method.conditions?.display_text) {
          method.estimated_days = method.conditions.display_text;
        }
        // Priorité 2: Si estimated_days n'existe pas mais que estimated_min_days et estimated_max_days existent
        else if (!method.estimated_days && method.estimated_min_days !== undefined && method.estimated_max_days !== undefined) {
          const minDays = method.estimated_min_days;
          const maxDays = method.estimated_max_days;

          // Cas spécial pour instantané (0 jours)
          if (minDays === 0 && maxDays === 0) {
            method.estimated_days = 'Instantané';
          }
          // Cas normal
          else if (minDays === maxDays) {
            method.estimated_days = `${minDays} jour${minDays > 1 ? 's' : ''}`;
          } else {
            method.estimated_days = `${minDays}-${maxDays} jours`;
          }
        }
        // Priorité 3: Valeur par défaut si aucun délai n'est défini
        else if (!method.estimated_days) {
          method.estimated_days = '3-5 jours';
        }

        return method;
      }) || [];

      setMethods(normalizedMethods);

    } catch (error) {
      console.error('💥 Erreur générale chargement méthodes:', {
        error,
        message: error instanceof Error ? error.message : 'Erreur inconnue',
        storeId
      });
      setMethods([]);
    } finally {
      setIsLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    loadShippingMethods();
  }, [loadShippingMethods]);

  return {
    methods,
    isLoading,
    reload: loadShippingMethods
  };
};
