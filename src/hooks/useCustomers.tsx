import { useQuery } from '@tanstack/react-query';
import { customerService, Customer, CustomerStats } from '@/services/customerService';
import { useStores } from './useStores';

export const useCustomers = () => {
  const { store } = useStores();

  // Récupérer les clients de la boutique
  const {
    data: customers = [],
    isLoading,
    error,
    refetch: refetchCustomers
  } = useQuery({
    queryKey: ['customers', store?.id],
    queryFn: () => store?.id ? customerService.getStoreCustomers(store.id) : Promise.resolve([]),
    enabled: !!store?.id,
    // ⚡ OPTIMISATION: Réduction drastique du polling
    refetchInterval: 5 * 60 * 1000, // 5 minutes au lieu de 1 minute
    staleTime: 3 * 60 * 1000, // 3 minutes au lieu de 30 secondes
    cacheTime: 10 * 60 * 1000, // Cache pendant 10 minutes
    refetchOnWindowFocus: false, // Éviter les requêtes au focus
    refetchOnMount: false, // Éviter les requêtes au mount si cache valide
  });

  // Récupérer les statistiques des clients
  const {
    data: stats,
    isLoading: isLoadingStats,
    error: statsError,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['customer-stats', store?.id],
    queryFn: () => store?.id ? customerService.getCustomerStats(store.id) : Promise.resolve({
      totalCustomers: 0,
      newCustomersThisMonth: 0,
      activeCustomers: 0,
      averageOrderValue: 0
    }),
    enabled: !!store?.id,
    // ⚡ OPTIMISATION: Stats moins critiques, polling plus lent
    refetchInterval: 10 * 60 * 1000, // 10 minutes pour les stats
    staleTime: 5 * 60 * 1000, // 5 minutes de cache
    cacheTime: 15 * 60 * 1000, // Cache pendant 15 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return {
    customers,
    stats,
    isLoading,
    isLoadingStats,
    error,
    statsError,
    refetchCustomers,
    refetchStats,
    
    // Utilitaires
    getCustomerByEmail: (email: string) => 
      customers.find(customer => customer.email.toLowerCase() === email.toLowerCase()),
    getTopCustomers: (limit: number = 10) => 
      customers.slice(0, limit),
    getActiveCustomers: () => 
      customers.filter(customer => customer.status === 'active'),
    getNewCustomers: (days: number = 30) => {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      return customers.filter(customer => 
        new Date(customer.firstOrderDate) >= cutoffDate
      );
    }
  };
};
