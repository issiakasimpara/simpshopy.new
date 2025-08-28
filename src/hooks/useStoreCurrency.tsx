import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { StoreCurrencyService, type StoreCurrencySettings } from '@/services/storeCurrencyService';
import { formatCurrency, type Currency } from '@/utils/formatCurrency';
import { useToast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useGlobalMarketSettings } from './useGlobalMarketSettings';

// Canal global partagé pour éviter les souscriptions multiples
let globalChannel: ReturnType<typeof supabase.channel> | null = null;
let globalStoreId: string | null = null;
const subscribers = new Set<() => void>();

const setupGlobalChannel = (storeId: string) => {
  // Si le canal existe déjà pour ce store, ne rien faire
  if (globalChannel && globalStoreId === storeId) {
    return;
  }

  // Nettoyer le canal existant
  if (globalChannel) {
    console.log('🔕 Nettoyage du canal global existant');
    supabase.removeChannel(globalChannel);
    globalChannel = null;
    globalStoreId = null;
  }

  console.log('🔔 Configuration du canal global pour le store:', storeId);

  globalChannel = supabase
    .channel(`store-currency-${storeId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'market_settings',
        filter: `store_id=eq.${storeId}`
      },
      (payload) => {
        console.log('💰 Changement de devise détecté:', payload);
        
        // Notifier tous les abonnés
        subscribers.forEach(callback => callback());
      }
    )
    .subscribe();

  globalStoreId = storeId;
};

const cleanupGlobalChannel = () => {
  if (globalChannel) {
    console.log('🔕 Nettoyage du canal global');
    supabase.removeChannel(globalChannel);
    globalChannel = null;
    globalStoreId = null;
    subscribers.clear();
  }
};

export const useStoreCurrency = (storeId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Vérifier si storeId est valide
  const isValidStoreId = Boolean(storeId && storeId.trim() !== '' && storeId !== 'undefined');

  // Récupérer la devise de la boutique
  const { data: currency, isLoading: isLoadingCurrency, refetch: refetchCurrency } = useQuery({
    queryKey: ['store-currency', storeId],
    queryFn: () => StoreCurrencyService.getStoreCurrency(storeId!),
    enabled: isValidStoreId,
    staleTime: 15 * 60 * 1000, // 15 minutes (augmenté de 5 à 15)
    cacheTime: 30 * 60 * 1000, // 30 minutes (augmenté de 10 à 30)
    refetchOnWindowFocus: false, // Éviter les refetch inutiles
    retry: false, // Ne pas retenter si la requête échoue
  });

  // Utiliser le hook global pour les market_settings
  const { data: currencySettings, isLoading: isLoadingSettings, refetch: refetchSettings } = useGlobalMarketSettings(storeId || null);

  // Forcer le refetch quand le storeId devient valide
  useEffect(() => {
    if (isValidStoreId && storeId) {
      // Log seulement la première fois
      if (import.meta.env.DEV && !(window as unknown as Record<string, unknown>).__STOREID_VALID_LOGGED__) {
        console.log('🔄 StoreId devenu valide, refetch des données de devise:', storeId);
        (window as unknown as Record<string, unknown>).__STOREID_VALID_LOGGED__ = true;
      }
      refetchCurrency();
      refetchSettings();
    }
  }, [isValidStoreId, storeId, user?.id, refetchCurrency, refetchSettings]);



  // Configuration du temps réel pour les changements de devise
  useEffect(() => {
    if (!isValidStoreId) {
      if (import.meta.env.DEV) {
        console.log('🔕 Pas de storeId valide, pas de configuration temps réel');
      }
      return;
    }

    // Configurer le canal global
    setupGlobalChannel(storeId!);

    // Fonction de callback pour ce composant
    const handleCurrencyChange = () => {
      if (import.meta.env.DEV) {
        console.log('🔄 Rafraîchissement des données de devise pour le composant');
      }
      // Forcer le refetch immédiat
      refetchCurrency();
      refetchSettings();
      
      // Invalider aussi les requêtes dans le cache
      queryClient.invalidateQueries({ 
        queryKey: ['store-currency', storeId],
        exact: true 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['store-currency-settings', storeId],
        exact: true 
      });
      
      // Notification optionnelle
      toast({
        title: "Devise mise à jour",
        description: "La devise de votre boutique a été modifiée.",
      });
    };

    // S'abonner aux changements
    subscribers.add(handleCurrencyChange);

    return () => {
      // Se désabonner
      subscribers.delete(handleCurrencyChange);
      
      // Si plus aucun abonné, nettoyer le canal
      if (subscribers.size === 0) {
        cleanupGlobalChannel();
      }
    };
  }, [storeId, isValidStoreId, user?.id, refetchCurrency, refetchSettings, queryClient, toast]);

  // Mutation pour mettre à jour la devise
  const updateCurrencyMutation = useMutation({
    mutationFn: async (newCurrency: Currency) => {
      if (!isValidStoreId) throw new Error('Store ID requis');
      return StoreCurrencyService.updateStoreCurrency(storeId!, newCurrency);
    },
    onSuccess: () => {
      if (import.meta.env.DEV) {
        console.log('🔄 Mutation réussie, invalidation des requêtes de devise');
      }
      // Invalider toutes les requêtes liées à la devise pour ce store
      queryClient.invalidateQueries({ 
        queryKey: ['store-currency', storeId],
        exact: true 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['store-currency-settings', storeId],
        exact: true 
      });
      // Invalider aussi les requêtes générales
      queryClient.invalidateQueries({ queryKey: ['store-currency'] });
      queryClient.invalidateQueries({ queryKey: ['store-currency-settings'] });
      
      toast({
        title: "Devise mise à jour",
        description: `La devise de votre boutique a été changée avec succès.`,
      });
    },
    onError: (error) => {
      console.error('Erreur lors de la mise à jour de la devise:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la devise. Veuillez réessayer.",
        variant: "destructive",
      });
    },
  });

  // Mutation pour mettre à jour les paramètres de devise
  const updateCurrencySettingsMutation = useMutation({
    mutationFn: async (settings: Partial<StoreCurrencySettings>) => {
      if (!isValidStoreId) throw new Error('Store ID requis');
      return StoreCurrencyService.updateStoreCurrencySettings(storeId!, settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-currency-settings'] });
      toast({
        title: "Paramètres mis à jour",
        description: `Les paramètres de devise ont été mis à jour avec succès.`,
      });
    },
    onError: (error) => {
      console.error('Erreur lors de la mise à jour des paramètres:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les paramètres. Veuillez réessayer.",
        variant: "destructive",
      });
    },
  });

  // Fonction pour initialiser la devise d'une boutique
  const initializeCurrency = async (currency: Currency = 'XOF', countries: string[] = ['ML', 'CI', 'SN', 'BF']) => {
    if (!isValidStoreId) throw new Error('Store ID requis');
    return StoreCurrencyService.initializeStoreCurrency(storeId!, currency, countries);
  };

  // Fonction pour obtenir les devises supportées
  const getSupportedCurrencies = () => {
    return [
      // Afrique (25 devises)
      'XOF', 'XAF', 'GHS', 'NGN', 'ZAR', 'EGP', 'KES', 'UGX', 'TZS', 'MAD', 'DZD', 'TND', 'LYD', 'SDG', 'ETB', 'SOS', 'DJF', 'KMF', 'MUR', 'SCR', 'BIF', 'RWF', 'CDF', 'GMD', 'SLL',
      
      // Europe (30 devises)
      'EUR', 'GBP', 'CHF', 'SEK', 'NOK', 'DKK', 'ISK', 'PLN', 'CZK', 'HUF', 'RON', 'BGN', 'HRK', 'RSD', 'ALL', 'MKD', 'BAM', 'MNT', 'GEL', 'AMD', 'AZN', 'BYN', 'MDL', 'UAH', 'RUB', 'TRY', 'ILS', 'JOD', 'LBP', 'SYP',
      
      // Amériques (35 devises)
      'USD', 'CAD', 'BRL', 'MXN', 'ARS', 'CLP', 'COP', 'PEN', 'UYU', 'PYG', 'BOB', 'GTQ', 'HNL', 'NIO', 'CRC', 'PAB', 'BBD', 'JMD', 'TTD', 'XCD', 'AWG', 'ANG', 'SRD', 'GYD', 'VEF', 'ECU', 'BZD', 'HTG', 'DOP', 'CUP', 'KYD', 'BMD', 'FKP',
      
      // Asie (40 devises)
      'JPY', 'CNY', 'INR', 'KRW', 'SGD', 'HKD', 'TWD', 'THB', 'MYR', 'IDR', 'PHP', 'VND', 'BDT', 'PKR', 'LKR', 'NPR', 'MMK', 'KHR', 'LAK', 'KZT', 'UZS', 'TJS', 'TMM', 'AFN', 'IRR', 'IQD', 'SAR', 'AED', 'QAR', 'KWD', 'BHD', 'OMR', 'YER', 'KGS', 'TMT',
      
      // Océanie (10 devises)
      'AUD', 'NZD', 'FJD', 'PGK', 'SBD', 'TOP', 'VUV', 'WST', 'KID', 'TVD',
      
      // Devises spéciales et crypto
      'XDR', 'XAU', 'XAG', 'BTC', 'ETH', 'USDT', 'USDC'
    ] as const;
  };

  // Fonction pour formater un prix
  const formatPrice = (amount: number, options?: { showSymbol?: boolean; showCode?: boolean }) => {
    // Gérer les cas où amount est undefined, null ou 0
    if (amount === undefined || amount === null || amount === 0) {
      return '0,00';
    }
    
    // Si pas de storeId valide ou pas de devise récupérée, utiliser XOF par défaut
    const currentCurrency = (isValidStoreId && currency) ? currency : 'XOF';
    
    // Formater directement le montant sans conversion
    // Les montants sont déjà dans la bonne devise
    return formatCurrency(amount, currentCurrency, options);
  };

  // Fonction pour convertir et formater un prix (pour les montants stockés en XOF)
  const formatConvertedPrice = (amount: number, originalCurrency: Currency = 'XOF', options?: { showSymbol?: boolean; showCode?: boolean }) => {
    // Si pas de storeId valide ou pas de devise récupérée, utiliser XOF par défaut
    const currentCurrency = (isValidStoreId && currency) ? currency : 'XOF';
    
    // Si la devise actuelle est la même que la devise d'origine, pas de conversion nécessaire
    if (currentCurrency === originalCurrency) {
      return formatCurrency(amount, currentCurrency, options);
    }

    // Taux de change approximatifs (en production, utiliser une API de change)
    const rates: Record<string, number> = {
      XOF: 1,        // Base: Franc CFA BCEAO
      XAF: 1,        // Parité avec XOF
      EUR: 0.00152,  // 1 EUR ≈ 655 XOF
      USD: 0.00166,  // 1 USD ≈ 620 XOF
      GBP: 0.00130,  // 1 GBP ≈ 500 XOF
      GHS: 0.0095,   // 1 GHS ≈ 105 XOF
      NGN: 0.0013,   // 1 NGN ≈ 770 XOF
      ZAR: 0.0085,   // 1 ZAR ≈ 118 XOF
      EGP: 0.052,    // 1 EGP ≈ 19 XOF
      KES: 0.0095,   // 1 KES ≈ 105 XOF
      UGX: 0.00042,  // 1 UGX ≈ 2380 XOF
      TZS: 0.00068,  // 1 TZS ≈ 1470 XOF
      MAD: 0.0095,   // 1 MAD ≈ 105 XOF
      DZD: 0.0095,   // 1 DZD ≈ 105 XOF
      TND: 0.0095,   // 1 TND ≈ 105 XOF
      LYD: 0.0095,   // 1 LYD ≈ 105 XOF
      SDG: 0.0095,   // 1 SDG ≈ 105 XOF
      ETB: 0.0095,   // 1 ETB ≈ 105 XOF
      SOS: 0.0095,   // 1 SOS ≈ 105 XOF
      DJF: 0.0095,   // 1 DJF ≈ 105 XOF
      KMF: 0.0095,   // 1 KMF ≈ 105 XOF
      MUR: 0.0095,   // 1 MUR ≈ 105 XOF
      SCR: 0.0095,   // 1 SCR ≈ 105 XOF
      BIF: 0.0095,   // 1 BIF ≈ 105 XOF
      RWF: 0.0095,   // 1 RWF ≈ 105 XOF
      CDF: 0.0095,   // 1 CDF ≈ 105 XOF
      GMD: 0.0095,   // 1 GMD ≈ 105 XOF
      SLL: 0.0095,   // 1 SLL ≈ 105 XOF
    };

    // Convertir vers XOF puis vers la devise cible
    let convertedAmount = amount;
    
    if (originalCurrency !== 'XOF') {
      // Convertir d'abord vers XOF
      const rateToXOF = rates[originalCurrency] || 1;
      convertedAmount = amount / rateToXOF;
    }
    
    // Puis convertir vers la devise cible
    if (currentCurrency !== 'XOF') {
      const rateFromXOF = rates[currentCurrency] || 1;
      convertedAmount = convertedAmount * rateFromXOF;
    }
    
    return formatCurrency(convertedAmount, currentCurrency, options);
  };

  // Fonction pour mettre à jour la devise
  const updateCurrency = async (newCurrency: Currency) => {
    return updateCurrencyMutation.mutateAsync(newCurrency);
  };

  // Fonction pour mettre à jour les paramètres
  const updateCurrencySettings = async (settings: Partial<StoreCurrencySettings>) => {
    return updateCurrencySettingsMutation.mutateAsync(settings);
  };

  return {
    currency: (isValidStoreId && currency) ? currency : 'XOF',
    currencySettings,
    isLoading: isValidStoreId && (isLoadingCurrency || isLoadingSettings),
    isUpdating: updateCurrencyMutation.isPending || updateCurrencySettingsMutation.isPending,
    updateCurrency,
    updateCurrencySettings,
    initializeCurrency,
    getSupportedCurrencies,
    formatPrice,
    formatConvertedPrice,
    refetchCurrency,
    refetchSettings,
  };
};
