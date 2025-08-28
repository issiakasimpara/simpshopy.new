// ========================================
// SERVICE POUR LES MARCHÉS ET MÉTHODES DE LIVRAISON
// ========================================

import { supabase } from '@/integrations/supabase/client';
import { Market, MarketInsert, ShippingMethod, ShippingMethodInsert } from '@/types/markets';

export class MarketsService {
  
  // ========================================
  // MARCHÉS (ZONES DE VENTE)
  // ========================================
  
  /**
   * Récupérer tous les marchés d'une boutique
   */
  async getMarkets(storeId: string): Promise<Market[]> {
    const { data, error } = await supabase
      .from('markets')
      .select('*')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Créer un nouveau marché
   */
  async createMarket(market: MarketInsert): Promise<Market> {
    const { data, error } = await supabase
      .from('markets')
      .insert(market)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Mettre à jour un marché
   */
  async updateMarket(id: string, updates: Partial<MarketInsert>): Promise<Market> {
    const { data, error } = await supabase
      .from('markets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Supprimer un marché
   */
  async deleteMarket(id: string): Promise<void> {
    const { error } = await supabase
      .from('markets')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // ========================================
  // MÉTHODES DE LIVRAISON
  // ========================================

  /**
   * Récupérer toutes les méthodes d'un marché
   */
  async getShippingMethods(marketId: string): Promise<ShippingMethod[]> {
    const { data, error } = await supabase
      .from('shipping_methods')
      .select(`
        *,
        market:markets(*)
      `)
      .eq('market_id', marketId)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  /**
   * Récupérer toutes les méthodes d'une boutique
   */
  async getAllShippingMethods(storeId: string): Promise<ShippingMethod[]> {
    const { data, error } = await supabase
      .from('shipping_methods')
      .select(`
        *,
        market:markets(*)
      `)
      .eq('store_id', storeId)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  /**
   * Créer une nouvelle méthode de livraison
   */
  async createShippingMethod(method: ShippingMethodInsert): Promise<ShippingMethod> {
    const { data, error } = await supabase
      .from('shipping_methods')
      .insert(method)
      .select(`
        *,
        market:markets(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Mettre à jour une méthode de livraison
   */
  async updateShippingMethod(id: string, updates: Partial<ShippingMethodInsert>): Promise<ShippingMethod> {
    const { data, error } = await supabase
      .from('shipping_methods')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        market:markets(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Supprimer une méthode de livraison
   */
  async deleteShippingMethod(id: string): Promise<void> {
    const { error } = await supabase
      .from('shipping_methods')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // ========================================
  // API CHECKOUT
  // ========================================

  /**
   * Récupérer les méthodes disponibles pour un pays (pour le checkout)
   */
  async getAvailableShippingMethods(storeId: string, country: string) {
    const { data, error } = await supabase
      .rpc('get_available_shipping_methods', {
        p_store_id: storeId,
        p_country: country
      });

    if (error) throw error;
    return data || [];
  }
}

// Instance singleton
export const marketsService = new MarketsService();
