import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from './use-toast';
import shippingService from '@/services/shippingService';
import type {
  ShippingZone,
  ShippingZoneInsert,
  ShippingZoneUpdate,
  ShippingMethod,
  ShippingMethodInsert,
  ShippingMethodUpdate,
  ShippingCalculationRequest,
  ShippingStats
} from '@/types/shipping';

/**
 * Hook pour gérer les zones de livraison
 */
export const useShippingZones = (storeId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Récupérer les zones
  const { data: zones, isLoading, error, refetch } = useQuery({
    queryKey: ['shipping-zones', storeId],
    queryFn: () => storeId ? shippingService.getShippingZones(storeId) : Promise.resolve([]),
    enabled: !!storeId,
    retry: false, // Ne pas réessayer si les tables n'existent pas
    refetchOnWindowFocus: false,
  });

  // Créer une zone
  const createZone = useMutation({
    mutationFn: (zone: ShippingZoneInsert) => shippingService.createShippingZone(zone),
    onSuccess: (newZone) => {
      queryClient.setQueryData(['shipping-zones', storeId], (old: ShippingZone[] = []) => [newZone, ...old]);
      toast({
        title: "Zone créée !",
        description: "La zone de livraison a été créée avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: "Impossible de créer la zone. " + error.message,
        variant: "destructive",
      });
    },
  });

  // Mettre à jour une zone
  const updateZone = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: ShippingZoneUpdate }) =>
      shippingService.updateShippingZone(id, updates),
    onSuccess: (updatedZone) => {
      queryClient.setQueryData(['shipping-zones', storeId], (old: ShippingZone[] = []) =>
        old.map(zone => zone.id === updatedZone.id ? updatedZone : zone)
      );
      toast({
        title: "Zone mise à jour !",
        description: "La zone de livraison a été mise à jour avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la zone. " + error.message,
        variant: "destructive",
      });
    },
  });

  // Supprimer une zone
  const deleteZone = useMutation({
    mutationFn: (id: string) => shippingService.deleteShippingZone(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(['shipping-zones', storeId], (old: ShippingZone[] = []) =>
        old.filter(zone => zone.id !== deletedId)
      );
      // Invalider aussi les méthodes car elles peuvent être liées
      queryClient.invalidateQueries({ queryKey: ['shipping-methods', storeId] });
      toast({
        title: "Zone supprimée !",
        description: "La zone de livraison a été supprimée avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la zone. " + error.message,
        variant: "destructive",
      });
    },
  });

  return {
    zones: zones || [],
    isLoading,
    error,
    refetch,
    createZone,
    updateZone,
    deleteZone,
  };
};

/**
 * Hook pour gérer les méthodes de livraison
 */
export const useShippingMethods = (storeId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Récupérer les méthodes
  const { data: methods, isLoading, error, refetch } = useQuery({
    queryKey: ['shipping-methods', storeId],
    queryFn: () => storeId ? shippingService.getShippingMethods(storeId) : Promise.resolve([]),
    enabled: !!storeId,
    retry: false, // Ne pas réessayer si les tables n'existent pas
    refetchOnWindowFocus: false,
  });

  // Créer une méthode
  const createMethod = useMutation({
    mutationFn: (method: ShippingMethodInsert) => shippingService.createShippingMethod(method),
    onSuccess: (newMethod) => {
      queryClient.setQueryData(['shipping-methods', storeId], (old: ShippingMethod[] = []) => [newMethod, ...old]);
      toast({
        title: "Méthode créée !",
        description: "La méthode de livraison a été créée avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: "Impossible de créer la méthode. " + error.message,
        variant: "destructive",
      });
    },
  });

  // Mettre à jour une méthode
  const updateMethod = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: ShippingMethodUpdate }) =>
      shippingService.updateShippingMethod(id, updates),
    onSuccess: (updatedMethod) => {
      queryClient.setQueryData(['shipping-methods', storeId], (old: ShippingMethod[] = []) =>
        old.map(method => method.id === updatedMethod.id ? updatedMethod : method)
      );
      toast({
        title: "Méthode mise à jour !",
        description: "La méthode de livraison a été mise à jour avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la méthode. " + error.message,
        variant: "destructive",
      });
    },
  });

  // Supprimer une méthode
  const deleteMethod = useMutation({
    mutationFn: (id: string) => shippingService.deleteShippingMethod(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(['shipping-methods', storeId], (old: ShippingMethod[] = []) =>
        old.filter(method => method.id !== deletedId)
      );
      toast({
        title: "Méthode supprimée !",
        description: "La méthode de livraison a été supprimée avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la méthode. " + error.message,
        variant: "destructive",
      });
    },
  });

  return {
    methods: methods || [],
    isLoading,
    error,
    refetch,
    createMethod,
    updateMethod,
    deleteMethod,
  };
};

/**
 * Hook pour calculer les frais de livraison
 */
export const useShippingCalculation = (request?: ShippingCalculationRequest) => {
  return useQuery({
    queryKey: ['shipping-calculation', request],
    queryFn: () => request ? shippingService.calculateShipping(request) : Promise.resolve([]),
    enabled: !!request && !!request.storeId && !!request.country,
  });
};

/**
 * Hook pour les méthodes de livraison actives pour un pays
 */
export const useActiveShippingMethods = (storeId?: string, country?: string) => {
  return useQuery({
    queryKey: ['active-shipping-methods', storeId, country],
    queryFn: () => 
      storeId && country 
        ? shippingService.getActiveShippingMethodsForCountry(storeId, country)
        : Promise.resolve([]),
    enabled: !!storeId && !!country,
  });
};

/**
 * Hook pour les statistiques de livraison
 */
export const useShippingStats = (storeId?: string) => {
  return useQuery({
    queryKey: ['shipping-stats', storeId],
    queryFn: () => storeId ? shippingService.getShippingStats(storeId) : Promise.resolve({
      totalMethods: 0,
      activeMethods: 0,
      totalZones: 0,
      activeZones: 0,
      averageShippingCost: 0,
      freeShippingOrders: 0,
      totalShippingRevenue: 0
    } as ShippingStats),
    enabled: !!storeId,
  });
};

/**
 * Hook principal qui combine tout
 */
export const useShipping = (storeId?: string) => {
  const zones = useShippingZones(storeId);
  const methods = useShippingMethods(storeId);
  const stats = useShippingStats(storeId);

  return {
    // Zones
    zones: zones.zones,
    isLoadingZones: zones.isLoading,
    createZone: zones.createZone,
    updateZone: zones.updateZone,
    deleteZone: zones.deleteZone,
    
    // Méthodes
    methods: methods.methods,
    isLoadingMethods: methods.isLoading,
    createMethod: methods.createMethod,
    updateMethod: methods.updateMethod,
    deleteMethod: methods.deleteMethod,
    
    // Statistiques
    stats: stats.data,
    isLoadingStats: stats.isLoading,
    
    // Global
    isLoading: zones.isLoading || methods.isLoading || stats.isLoading,
    refetch: () => {
      zones.refetch();
      methods.refetch();
      stats.refetch();
    }
  };
};
