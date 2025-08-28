// ========================================
// HOOK POUR GÉRER LES MARCHÉS ET MÉTHODES DE LIVRAISON
// ========================================

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { marketsService } from '@/services/marketsService';
import { Market, MarketInsert, ShippingMethod, ShippingMethodInsert } from '@/types/markets';
import { useToast } from '@/hooks/use-toast';

export const useMarkets = (storeId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // ========================================
  // QUERIES
  // ========================================

  const {
    data: markets = [],
    isLoading: isLoadingMarkets,
    error: marketsError
  } = useQuery({
    queryKey: ['markets', storeId],
    queryFn: () => storeId ? marketsService.getMarkets(storeId) : Promise.resolve([]),
    enabled: !!storeId
  });

  const {
    data: allShippingMethods = [],
    isLoading: isLoadingMethods,
    error: methodsError
  } = useQuery({
    queryKey: ['shipping-methods', storeId],
    queryFn: () => storeId ? marketsService.getAllShippingMethods(storeId) : Promise.resolve([]),
    enabled: !!storeId
  });

  // ========================================
  // MUTATIONS MARCHÉS
  // ========================================

  const createMarketMutation = useMutation({
    mutationFn: (market: MarketInsert) => marketsService.createMarket(market),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['markets', storeId] });
      toast({
        title: "Succès",
        description: "Marché créé avec succès"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le marché",
        variant: "destructive"
      });
    }
  });

  const updateMarketMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<MarketInsert> }) =>
      marketsService.updateMarket(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['markets', storeId] });
      toast({
        title: "Succès",
        description: "Marché modifié avec succès"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de modifier le marché",
        variant: "destructive"
      });
    }
  });

  const deleteMarketMutation = useMutation({
    mutationFn: (id: string) => marketsService.deleteMarket(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['markets', storeId] });
      queryClient.invalidateQueries({ queryKey: ['shipping-methods', storeId] });
      toast({
        title: "Succès",
        description: "Marché supprimé avec succès"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer le marché",
        variant: "destructive"
      });
    }
  });

  // ========================================
  // MUTATIONS MÉTHODES DE LIVRAISON
  // ========================================

  const createShippingMethodMutation = useMutation({
    mutationFn: (method: ShippingMethodInsert) => marketsService.createShippingMethod(method),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-methods', storeId] });
      toast({
        title: "Succès",
        description: "Méthode de livraison créée avec succès"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer la méthode de livraison",
        variant: "destructive"
      });
    }
  });

  const updateShippingMethodMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<ShippingMethodInsert> }) =>
      marketsService.updateShippingMethod(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-methods', storeId] });
      toast({
        title: "Succès",
        description: "Méthode de livraison modifiée avec succès"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de modifier la méthode de livraison",
        variant: "destructive"
      });
    }
  });

  const deleteShippingMethodMutation = useMutation({
    mutationFn: (id: string) => marketsService.deleteShippingMethod(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-methods', storeId] });
      toast({
        title: "Succès",
        description: "Méthode de livraison supprimée avec succès"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer la méthode de livraison",
        variant: "destructive"
      });
    }
  });

  // ========================================
  // FONCTIONS HELPER
  // ========================================

  const getMethodsByMarket = (marketId: string): ShippingMethod[] => {
    return allShippingMethods.filter(method => method.market_id === marketId);
  };

  const getActiveMarkets = (): Market[] => {
    return markets.filter(market => market.is_active);
  };

  const getActiveMethods = (): ShippingMethod[] => {
    return allShippingMethods.filter(method => method.is_active);
  };

  return {
    // Data
    markets,
    allShippingMethods,
    
    // Loading states
    isLoadingMarkets,
    isLoadingMethods,
    isLoading: isLoadingMarkets || isLoadingMethods,
    
    // Errors
    marketsError,
    methodsError,
    
    // Mutations
    createMarket: createMarketMutation.mutate,
    updateMarket: updateMarketMutation.mutate,
    deleteMarket: deleteMarketMutation.mutate,
    createShippingMethod: createShippingMethodMutation.mutate,
    updateShippingMethod: updateShippingMethodMutation.mutate,
    deleteShippingMethod: deleteShippingMethodMutation.mutate,
    
    // Loading states for mutations
    isCreatingMarket: createMarketMutation.isPending,
    isUpdatingMarket: updateMarketMutation.isPending,
    isDeletingMarket: deleteMarketMutation.isPending,
    isCreatingMethod: createShippingMethodMutation.isPending,
    isUpdatingMethod: updateShippingMethodMutation.isPending,
    isDeletingMethod: deleteShippingMethodMutation.isPending,
    
    // Helper functions
    getMethodsByMarket,
    getActiveMarkets,
    getActiveMethods
  };
};
