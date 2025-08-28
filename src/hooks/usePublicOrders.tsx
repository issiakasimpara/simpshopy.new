import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PublicOrder } from '@/types/common';
import { useErrorHandler } from '@/hooks/useErrorHandler';

export type { PublicOrder };

export const usePublicOrders = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { handleAsyncError } = useErrorHandler();

  // Fonction pour convertir Json vers array de manière sûre
  const safeConvertToArray = (items: any): any[] => {
    if (Array.isArray(items)) return items;
    if (!items) return [];
    try {
      return JSON.parse(items);
    } catch {
      return [];
    }
  };

  // Fonction pour convertir les données de la DB vers PublicOrder
  const convertToPublicOrder = (dbData: any): PublicOrder => {
    return {
      ...dbData,
      items: safeConvertToArray(dbData.items)
    };
  };

  const searchOrdersByEmail = async (email: string): Promise<PublicOrder[]> => {
    if (!email) return [];
    
    setIsLoading(true);
    
    const result = await handleAsyncError(async () => {
      const { data, error } = await supabase
        .from('public_orders')
        .select('*')
        .eq('customer_email', email.toLowerCase().trim())
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return (data || []).map(convertToPublicOrder);
    }, 'searchOrdersByEmail', {
      title: 'Erreur de recherche',
      description: 'Impossible de rechercher les commandes.'
    });

    setIsLoading(false);
    return result || [];
  };

  const searchOrderByNumber = async (orderNumber: string): Promise<PublicOrder | null> => {
    if (!orderNumber) return null;
    
    setIsLoading(true);
    
    const result = await handleAsyncError(async () => {
      const { data, error } = await supabase
        .from('public_orders')
        .select('*')
        .eq('order_number', orderNumber.toUpperCase().trim())
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      return data ? convertToPublicOrder(data) : null;
    }, 'searchOrderByNumber', {
      title: 'Erreur de recherche',
      description: 'Impossible de rechercher la commande.'
    });

    setIsLoading(false);
    return result;
  };

  const searchOrders = async (email?: string, orderNumber?: string): Promise<PublicOrder[]> => {
    setIsLoading(true);
    
    const result = await handleAsyncError(async () => {
      let query = supabase.from('public_orders').select('*');
      
      if (email && orderNumber) {
        query = query.or(`customer_email.eq.${email.toLowerCase().trim()},order_number.eq.${orderNumber.toUpperCase().trim()}`);
      } else if (email) {
        query = query.eq('customer_email', email.toLowerCase().trim());
      } else if (orderNumber) {
        query = query.eq('order_number', orderNumber.toUpperCase().trim());
      } else {
        return [];
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return (data || []).map(convertToPublicOrder);
    }, 'searchOrders', {
      title: 'Erreur de recherche',
      description: 'Impossible de rechercher les commandes.'
    });

    setIsLoading(false);
    return result || [];
  };

  return {
    isLoading,
    searchOrdersByEmail,
    searchOrderByNumber,
    searchOrders
  };
};