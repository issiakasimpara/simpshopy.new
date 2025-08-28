import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MonerooService, MonerooPaymentData } from '@/services/monerooService';
import { useToast } from '@/hooks/use-toast';

export interface Payment {
  id: string;
  store_id: string;
  order_id?: string;
  moneroo_payment_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  customer_email: string;
  customer_name: string;
  description?: string;
  checkout_url?: string;
  return_url?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export const usePayments = (storeId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Récupérer les paiements d'une boutique
  const { data: payments, isLoading, error } = useQuery({
    queryKey: ['payments', storeId],
    queryFn: async () => {
      if (!storeId) return [];

      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!storeId
  });

  // Initialiser un nouveau paiement
  const initializePayment = useMutation({
    mutationFn: async (paymentData: MonerooPaymentData & { storeId: string; orderId?: string }) => {
      // 1. Initialiser le paiement avec Moneroo
      const monerooResponse = await MonerooService.initializePayment({
        ...paymentData,
        currency: 'XOF' // Devise XOF selon documentation Moneroo
        // Pas de methods pour laisser Moneroo choisir automatiquement
      });

      // 2. Sauvegarder dans la base de données
      const { data, error } = await supabase
        .from('payments')
        .insert({
          store_id: paymentData.storeId,
          order_id: paymentData.orderId,
          moneroo_payment_id: monerooResponse.data.id,
          amount: paymentData.amount,
          currency: paymentData.currency,
          status: 'pending',
          customer_email: paymentData.customer.email,
          customer_name: `${paymentData.customer.first_name} ${paymentData.customer.last_name}`,
          description: paymentData.description,
          checkout_url: monerooResponse.data.checkout_url,
          return_url: paymentData.return_url,
          metadata: paymentData.metadata
        })
        .select()
        .single();

      if (error) throw error;

      return {
        payment: data,
        checkoutUrl: monerooResponse.data.checkout_url
      };
    },
    onSuccess: (data) => {
      toast({
        title: "Paiement initialisé",
        description: "Redirection vers la page de paiement...",
      });
      
      // Rediriger vers la page de paiement
      window.location.href = data.checkoutUrl;
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de l'initialisation du paiement",
        variant: "destructive"
      });
    }
  });

  // Vérifier le statut d'un paiement
  const verifyPayment = useMutation({
    mutationFn: async (paymentId: string) => {
      const result = await MonerooService.verifyPayment(paymentId);
      
      // Mettre à jour le statut dans la base de données
      const { error } = await supabase
        .from('payments')
        .update({ 
          status: result.data.status,
          updated_at: new Date().toISOString()
        })
        .eq('moneroo_payment_id', paymentId);

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    }
  });

  // Récupérer les statistiques des paiements
  const { data: paymentStats } = useQuery({
    queryKey: ['paymentStats', storeId],
    queryFn: async () => {
      if (!storeId) return null;

      const { data, error } = await supabase
        .from('payments')
        .select('status, amount')
        .eq('store_id', storeId);

      if (error) throw error;

      const stats = {
        total: data.length,
        completed: data.filter(p => p.status === 'completed').length,
        pending: data.filter(p => p.status === 'pending').length,
        failed: data.filter(p => p.status === 'failed').length,
        totalAmount: data
          .filter(p => p.status === 'completed')
          .reduce((sum, p) => sum + parseFloat(p.amount), 0)
      };

      return stats;
    },
    enabled: !!storeId
  });

  return {
    payments,
    paymentStats,
    isLoading,
    error,
    initializePayment,
    verifyPayment
  };
}; 