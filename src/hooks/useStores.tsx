
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { OnboardingService } from '@/services/onboardingService';
import { StoreCurrencyService } from '@/services/storeCurrencyService';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Store = Tables<'stores'>;
type StoreInsert = TablesInsert<'stores'>;
type StoreUpdate = TablesUpdate<'stores'>;

export const useStores = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stores, isLoading, refetch } = useQuery({
    queryKey: ['stores', user?.id],
    queryFn: async () => {
      if (!user) {
        console.log('No user found, returning empty array');
        return [];
      }

      // Log seulement en développement et très rarement
      if (import.meta.env.DEV && Math.random() < 0.01) {
        console.log('Fetching stores for user:', user.email);
      }

      try {
        // D'abord récupérer le profil de l'utilisateur
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          console.error('Profile error:', profileError);

          // Si le profil n'existe pas, essayer de le créer automatiquement
          if (profileError.code === 'PGRST116') { // No rows returned
            console.log('🔧 Profil manquant, création automatique...');
            try {
              const { data: newProfile, error: createError } = await supabase
                .from('profiles')
                .insert({
                  user_id: user.id,
                  first_name: user.user_metadata?.first_name || '',
                  last_name: user.user_metadata?.last_name || '',
                  email: user.email || ''
                })
                .select()
                .single();

              if (createError) {
                console.error('❌ Erreur création profil:', createError);
                return [];
              }

              console.log('✅ Profil créé automatiquement:', newProfile.id);

              // Maintenant récupérer les boutiques avec le nouveau profil
              const { data, error } = await supabase
                .from('stores')
                .select('*')
                .eq('merchant_id', newProfile.id)
                .order('created_at', { ascending: false });

              if (error) {
                console.error('Error fetching stores after profile creation:', error);
                return [];
              }

              console.log('Stores fetched for new profile:', newProfile.id, 'stores:', data);
              return data as Store[];

            } catch (createErr) {
              console.error('❌ Erreur lors de la création du profil:', createErr);
              return [];
            }
          }

          console.log('No profile found, returning empty stores array');
          return [];
        }

        // Maintenant récupérer les boutiques de ce profil
        const { data, error } = await supabase
          .from('stores')
          .select('*')
          .eq('merchant_id', profile.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching stores:', error);
          throw error;
        }

        // Log seulement en développement et très rarement
        if (import.meta.env.DEV && Math.random() < 0.01) {
          console.log('Stores fetched for profile:', profile.id, 'stores:', data);
        }
        return data as Store[];
      } catch (error) {
        console.error('Error in stores query:', error);
        // Retourner un tableau vide en cas d'erreur pour éviter les crashes
        return [];
      }
    },
    enabled: !!user && !authLoading,
    staleTime: 1000 * 60 * 10, // 10 minutes de cache
    cacheTime: 1000 * 60 * 30, // 30 minutes en cache
    retry: 1, // Réduire les tentatives
    refetchOnWindowFocus: false, // Éviter les requêtes inutiles
  });

  // Get the single store (since users can only have one)
  const store = stores?.[0] || null;
  const hasStore = !!store;

  const createStore = useMutation({
    mutationFn: async (store: Omit<StoreInsert, 'merchant_id'>) => {
      if (!user) throw new Error('User not authenticated');

      // Check if user already has a store
      if (hasStore) {
        throw new Error('Vous ne pouvez créer qu\'une seule boutique par compte');
      }

      // First get the user's profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profileError || !profile) {
        console.error('Profile error:', profileError);
        throw new Error('Profile not found');
      }

      // Créer le store
      const { data, error } = await supabase
        .from('stores')
        .insert({ ...store, merchant_id: profile.id })
        .select()
        .single();

      if (error) throw error;

      // Initialiser automatiquement la devise du store avec celle de l'onboarding
      try {
        console.log('💰 Vérification de la devise d\'onboarding pour le store:', data.id);
        
        // Récupérer la devise choisie lors de l'onboarding
        const onboardingCurrency = await OnboardingService.getOnboardingCurrency(user.id);
        const onboardingCountry = await OnboardingService.getOnboardingCountry(user.id);
        
        if (onboardingCurrency) {
          console.log('✅ Devise d\'onboarding trouvée:', onboardingCurrency);
          
          // Initialiser la devise du store avec celle de l'onboarding
          const countries = onboardingCountry ? [onboardingCountry] : ['ML', 'CI', 'SN', 'BF'];
          await StoreCurrencyService.initializeStoreCurrency(data.id, onboardingCurrency, countries);
          
          console.log('✅ Devise du store initialisée avec succès:', onboardingCurrency);
        } else {
          console.log('ℹ️ Aucune devise d\'onboarding trouvée, utilisation de la devise par défaut (XOF)');
          // Utiliser la devise par défaut si aucune devise d'onboarding n'est trouvée
          await StoreCurrencyService.initializeStoreCurrency(data.id, 'XOF', ['ML', 'CI', 'SN', 'BF']);
        }
      } catch (currencyError) {
        console.error('⚠️ Erreur lors de l\'initialisation de la devise:', currencyError);
        // Ne pas faire échouer la création du store si l'initialisation de la devise échoue
      }

      return data;
    },
    onSuccess: async (newStore) => {
      console.log('🎉 Store créé avec succès:', newStore);

      // 1. Invalider complètement le cache
      await queryClient.invalidateQueries({ queryKey: ['stores'] });
      await queryClient.removeQueries({ queryKey: ['stores'] });

      // 2. Forcer un rechargement immédiat avec validation
      try {
        console.log('🔄 Validation du store créé...');

        // Vérifier que le store existe réellement dans la DB
        const { data: verificationData, error: verificationError } = await supabase
          .from('stores')
          .select('*')
          .eq('id', newStore.id)
          .single();

        if (verificationError || !verificationData) {
          console.error('❌ Store non trouvé après création:', verificationError);
          throw new Error('Store non validé après création');
        }

        console.log('✅ Store validé:', verificationData);

        // 3. Forcer le rechargement des données
        await queryClient.refetchQueries({ queryKey: ['stores', user?.id] });

        // 4. Exposer le queryClient et les données pour CreateStoreDialog
        (window as any).queryClient = queryClient;
        (window as any).validatedStore = verificationData;

      } catch (validationError) {
        console.error('❌ Erreur de validation:', validationError);
        toast({
          title: "Erreur de validation",
          description: "La boutique a été créée mais n'est pas encore accessible. Veuillez rafraîchir la page.",
          variant: "destructive"
        });
        return newStore;
      }

      toast({
        title: "Boutique créée !",
        description: "Votre boutique a été créée et validée avec succès.",
      });
      return newStore;
    },
    onError: (error) => {
      console.error('Store creation error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la boutique. " + error.message,
        variant: "destructive",
      });
    },
  });

  const updateStore = useMutation({
    mutationFn: async ({ id, ...updates }: StoreUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('stores')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      toast({
        title: "Boutique mise à jour !",
        description: "Les modifications ont été sauvegardées.",
      });
    },
    onError: (error) => {
      console.error('Store update error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la boutique. " + error.message,
        variant: "destructive",
      });
    },
  });

  return {
    stores: stores || [],
    store, // Single store
    hasStore, // Boolean to check if user has a store
    isLoading: isLoading || authLoading,
    createStore: createStore.mutateAsync,
    updateStore: updateStore.mutate,
    isCreating: createStore.isPending,
    isUpdating: updateStore.isPending,
    refetchStores: refetch,
  };
};
