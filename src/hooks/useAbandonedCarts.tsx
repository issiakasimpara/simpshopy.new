import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CartSession } from './useCartSessions';

export interface AbandonedCart extends CartSession {
  days_abandoned: number;
  total_value: number;
  customer_email?: string;
  customer_name?: string;
  customer_phone?: string;
}

export interface AbandonedCartsStats {
  totalAbandoned: number;
  totalValue: number;
  averageValue: number;
  recentAbandoned: number; // Paniers abandonnés dans les dernières 24h
  potentialRevenue: number; // Revenu potentiel si tous les paniers étaient convertis
  conversionRate: number; // Taux de conversion (commandes / (commandes + paniers abandonnés))
}

export const useAbandonedCarts = (storeId?: string) => {
  const [abandonedCarts, setAbandonedCarts] = useState<AbandonedCart[]>([]);
  const [stats, setStats] = useState<AbandonedCartsStats>({
    totalAbandoned: 0,
    totalValue: 0,
    averageValue: 0,
    recentAbandoned: 0,
    potentialRevenue: 0,
    conversionRate: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Récupérer les statistiques des paniers abandonnés
  const fetchAbandonedCartsStats = useCallback(async () => {
    if (!storeId) {
      console.log('❌ Pas de storeId fourni pour les stats');
      return;
    }

    try {
      setIsLoading(true);
      console.log('📊 Calcul des statistiques paniers abandonnés pour storeId:', storeId);

      // Récupérer toutes les sessions de panier pour cette boutique
      const { data: cartSessions, error: cartError } = await supabase
        .from('cart_sessions')
        .select('*')
        .eq('store_id', storeId)
        .not('items', 'eq', '[]')
        .not('items', 'is', null);

      if (cartError) {
        console.error('Erreur lors de la récupération des sessions de panier:', cartError);
        return;
      }

      // Récupérer tous les emails des clients avec des commandes complétées
      const { data: completedOrders, error: ordersError } = await supabase
        .from('public_orders')
        .select('customer_email')
        .eq('store_id', storeId)
        .in('status', ['confirmed', 'processing', 'shipped', 'delivered'])
        .not('customer_email', 'is', null);

      if (ordersError) {
        console.error('Erreur lors de la récupération des commandes complétées:', ordersError);
        return;
      }

      // Créer un set des emails qui ont des commandes complétées
      const completedEmails = new Set(completedOrders?.map(order => order.customer_email) || []);
      console.log('✅ Emails avec commandes complétées:', Array.from(completedEmails));

      // Filtrer les sessions qui n'ont PAS de commandes complétées pour le même email
      const abandoned = (cartSessions || [])
        .filter(session => {
          const customerInfo = session.customer_info as any || {};
          const customerEmail = customerInfo.email;
          return !customerEmail || !completedEmails.has(customerEmail);
        })
        .map(session => {
          const items = Array.isArray(session.items) ? session.items as any[] : [];
          const totalValue = items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
          const customerInfo = session.customer_info as any || {};
          const daysAbandoned = Math.floor((Date.now() - new Date(session.created_at).getTime()) / (1000 * 60 * 60 * 24));

          return {
            ...session,
            items: items as any,
            total_value: totalValue,
            days_abandoned: daysAbandoned,
            customer_email: customerInfo.email,
            customer_name: customerInfo.name,
            customer_phone: customerInfo.phone
          } as AbandonedCart;
        });

      console.log('🔍 Sessions totales:', cartSessions?.length || 0);
      console.log('✅ Emails avec commandes complétées:', completedEmails.size);
      console.log('❌ Sessions abandonnées (filtrées):', abandoned.length);

      // Calculer les statistiques
      const totalAbandoned = abandoned.length;
      const totalValue = abandoned.reduce((sum, cart) => sum + cart.total_value, 0);
      const averageValue = totalAbandoned > 0 ? totalValue / totalAbandoned : 0;
      const recentAbandoned = abandoned.filter(cart => cart.days_abandoned <= 1).length;
      const potentialRevenue = totalValue; // Revenu potentiel si tous les paniers étaient convertis

      // Calculer le taux de conversion
      const totalOrders = completedOrders?.length || 0;
      const totalSessions = cartSessions?.length || 0;
      const conversionRate = totalSessions > 0 ? (totalOrders / totalSessions) * 100 : 0;

      const newStats: AbandonedCartsStats = {
        totalAbandoned,
        totalValue,
        averageValue,
        recentAbandoned,
        potentialRevenue,
        conversionRate
      };

      console.log('📊 Stats paniers abandonnés calculées:', newStats);
      setStats(newStats);
      setAbandonedCarts(abandoned);
    } catch (error) {
      console.error('Erreur lors du calcul des stats paniers abandonnés:', error);
      toast({
        title: "Erreur",
        description: "Impossible de calculer les statistiques des paniers abandonnés.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [storeId, toast]);

  // Récupérer les paniers abandonnés
  const fetchAbandonedCarts = async () => {
    if (!storeId) {
      console.log('❌ Pas de storeId fourni');
      return;
    }

    try {
      setIsLoading(true);
      console.log('🔍 Recherche des paniers abandonnés pour storeId:', storeId);

      // Récupérer toutes les sessions de panier pour cette boutique
      const { data: cartSessions, error: cartError } = await supabase
        .from('cart_sessions')
        .select('*')
        .eq('store_id', storeId)
        .not('items', 'eq', '[]')
        .not('items', 'is', null);

      if (cartError) {
        console.error('Erreur lors de la récupération des sessions de panier:', cartError);
        return;
      }

      // Récupérer tous les emails des clients avec des commandes complétées
      const { data: completedOrders, error: ordersError } = await supabase
        .from('public_orders')
        .select('customer_email')
        .eq('store_id', storeId)
        .in('status', ['confirmed', 'processing', 'shipped', 'delivered'])
        .not('customer_email', 'is', null);

      if (ordersError) {
        console.error('Erreur lors de la récupération des commandes complétées:', ordersError);
        return;
      }

      // Créer un set des emails qui ont des commandes complétées
      const completedEmails = new Set(completedOrders?.map(order => order.customer_email) || []);

      // Filtrer les sessions qui n'ont PAS de commandes complétées pour le même email
      const abandoned = (cartSessions || [])
        .filter(session => {
          const customerInfo = session.customer_info as any || {};
          const customerEmail = customerInfo.email;
          return !customerEmail || !completedEmails.has(customerEmail);
        })
        .map(session => {
          const items = Array.isArray(session.items) ? session.items as any[] : [];
          const totalValue = items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
          const customerInfo = session.customer_info as any || {};
          const daysAbandoned = Math.floor((Date.now() - new Date(session.created_at).getTime()) / (1000 * 60 * 60 * 24));

          return {
            ...session,
            items: items as any,
            total_value: totalValue,
            days_abandoned: daysAbandoned,
            customer_email: customerInfo.email,
            customer_name: customerInfo.name,
            customer_phone: customerInfo.phone
          } as AbandonedCart;
        })
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      console.log('🔍 Paniers abandonnés trouvés:', abandoned.length);
      console.log('📋 Détails des paniers:', abandoned);
      setAbandonedCarts(abandoned);
    } catch (error) {
      console.error('Erreur lors de la récupération des paniers abandonnés:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les paniers abandonnés.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer un panier abandonné
  const deleteAbandonedCart = async (cartId: string) => {
    try {
      const { error } = await supabase
        .from('cart_sessions')
        .delete()
        .eq('id', cartId);

      if (error) {
        throw error;
      }

      // Mettre à jour la liste locale
      setAbandonedCarts(prev => prev.filter(cart => cart.id !== cartId));
      
      // Recalculer les stats
      await fetchAbandonedCartsStats();

      toast({
        title: "Succès",
        description: "Panier abandonné supprimé avec succès.",
        variant: "default"
      });
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer le panier abandonné.",
        variant: "destructive"
      });
    }
  };

  // Envoyer un email de rappel (placeholder)
  const sendReminderEmail = async (cart: AbandonedCart) => {
    // TODO: Implémenter l'envoi d'email
    console.log('📧 Envoi email de rappel pour:', cart.customer_email);
    toast({
      title: "Fonctionnalité à venir",
      description: "L'envoi d'emails de rappel sera bientôt disponible.",
      variant: "default"
    });
  };

  useEffect(() => {
    if (storeId) {
      fetchAbandonedCartsStats();
    }
  }, [storeId, fetchAbandonedCartsStats]);

  return {
    abandonedCarts,
    stats,
    isLoading,
    fetchAbandonedCarts,
    fetchAbandonedCartsStats,
    deleteAbandonedCart,
    sendReminderEmail
  };
}; 