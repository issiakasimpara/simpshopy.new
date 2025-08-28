import { supabase } from '@/integrations/supabase/client';
import type {
  DsersIntegration,
  DsersProduct,
  DsersOrder,
  DsersSyncLog,
  DsersStats,
  DsersImportProductRequest,
  DsersSyncRequest,
  DsersFulfillOrderRequest,
  DsersApiResponse
} from '@/types/dsers';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export class DsersService {
  // ===== INTÉGRATIONS =====
  
  /**
   * Créer une nouvelle intégration DSERS
   */
  static async createIntegration(
    storeId: string,
    apiKey: string,
    apiSecret: string,
    settings?: Partial<DsersIntegration['settings']>
  ): Promise<DsersApiResponse<DsersIntegration>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non authentifié');

      const { data, error } = await supabase
        .from('dsers_integrations')
        .insert({
          user_id: user.id,
          store_id: storeId,
          api_key: apiKey,
          api_secret: apiSecret,
          settings: {
            auto_sync_prices: true,
            auto_sync_stocks: true,
            auto_fulfill_orders: false,
            price_markup_percentage: 30,
            sync_interval_minutes: 60,
            ...settings
          }
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Erreur création intégration DSERS:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtenir l'intégration DSERS d'un store
   */
  static async getIntegration(storeId: string): Promise<DsersApiResponse<DsersIntegration>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non authentifié');

      const { data, error } = await supabase
        .from('dsers_integrations')
        .select('*')
        .eq('store_id', storeId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Erreur récupération intégration DSERS:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Mettre à jour l'intégration DSERS
   */
  static async updateIntegration(
    integrationId: string,
    updates: Partial<DsersIntegration>
  ): Promise<DsersApiResponse<DsersIntegration>> {
    try {
      const { data, error } = await supabase
        .from('dsers_integrations')
        .update(updates)
        .eq('id', integrationId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Erreur mise à jour intégration DSERS:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Supprimer l'intégration DSERS
   */
  static async deleteIntegration(integrationId: string): Promise<DsersApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('dsers_integrations')
        .delete()
        .eq('id', integrationId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Erreur suppression intégration DSERS:', error);
      return { success: false, error: error.message };
    }
  }

  // ===== PRODUITS =====

  /**
   * Importer un produit depuis AliExpress via DSERS
   */
  static async importProduct(request: DsersImportProductRequest): Promise<DsersApiResponse<DsersProduct>> {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/dsers-import-product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(request)
      });

      const result = await response.json();
      
      if (!response.ok) throw new Error(result.error || 'Erreur import produit');

      return result;
    } catch (error) {
      console.error('Erreur import produit DSERS:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtenir les produits DSERS d'un store
   */
  static async getProducts(
    storeId: string,
    status?: DsersProduct['import_status']
  ): Promise<DsersApiResponse<DsersProduct[]>> {
    try {
      let query = supabase
        .from('dsers_products')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('import_status', status);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Erreur récupération produits DSERS:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Mettre à jour un produit DSERS
   */
  static async updateProduct(
    productId: string,
    updates: Partial<DsersProduct>
  ): Promise<DsersApiResponse<DsersProduct>> {
    try {
      const { data, error } = await supabase
        .from('dsers_products')
        .update(updates)
        .eq('id', productId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Erreur mise à jour produit DSERS:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Supprimer un produit DSERS
   */
  static async deleteProduct(productId: string): Promise<DsersApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('dsers_products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Erreur suppression produit DSERS:', error);
      return { success: false, error: error.message };
    }
  }

  // ===== COMMANDES =====

  /**
   * Obtenir les commandes DSERS d'un store
   */
  static async getOrders(
    storeId: string,
    status?: DsersOrder['fulfillment_status']
  ): Promise<DsersApiResponse<DsersOrder[]>> {
    try {
      let query = supabase
        .from('dsers_orders')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('fulfillment_status', status);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Erreur récupération commandes DSERS:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Fulfillir une commande DSERS
   */
  static async fulfillOrder(request: DsersFulfillOrderRequest): Promise<DsersApiResponse<DsersOrder>> {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/dsers-fulfill-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(request)
      });

      const result = await response.json();
      
      if (!response.ok) throw new Error(result.error || 'Erreur fulfillment commande');

      return result;
    } catch (error) {
      console.error('Erreur fulfillment commande DSERS:', error);
      return { success: false, error: error.message };
    }
  }

  // ===== SYNCHRONISATION =====

  /**
   * Lancer une synchronisation DSERS
   */
  static async syncData(request: DsersSyncRequest): Promise<DsersApiResponse<DsersSyncLog>> {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/dsers-sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(request)
      });

      const result = await response.json();
      
      if (!response.ok) throw new Error(result.error || 'Erreur synchronisation');

      return result;
    } catch (error) {
      console.error('Erreur synchronisation DSERS:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtenir les logs de synchronisation
   */
  static async getSyncLogs(
    storeId: string,
    syncType?: DsersSyncLog['sync_type']
  ): Promise<DsersApiResponse<DsersSyncLog[]>> {
    try {
      let query = supabase
        .from('dsers_sync_logs')
        .select('*')
        .eq('store_id', storeId)
        .order('started_at', { ascending: false })
        .limit(50);

      if (syncType) {
        query = query.eq('sync_type', syncType);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Erreur récupération logs DSERS:', error);
      return { success: false, error: error.message };
    }
  }

  // ===== STATISTIQUES =====

  /**
   * Obtenir les statistiques DSERS d'un store
   */
  static async getStats(storeId: string): Promise<DsersApiResponse<DsersStats>> {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/dsers-stats?store_id=${storeId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });

      const result = await response.json();
      
      if (!response.ok) throw new Error(result.error || 'Erreur récupération statistiques');

      return result;
    } catch (error) {
      console.error('Erreur récupération statistiques DSERS:', error);
      return { success: false, error: error.message };
    }
  }

  // ===== UTILITAIRES =====

  /**
   * Tester la connexion DSERS
   */
  static async testConnection(apiKey: string, apiSecret: string): Promise<DsersApiResponse<boolean>> {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/dsers-test-connection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ api_key: apiKey, api_secret: apiSecret })
      });

      const result = await response.json();
      
      if (!response.ok) throw new Error(result.error || 'Erreur test connexion');

      return result;
    } catch (error) {
      console.error('Erreur test connexion DSERS:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Valider une URL AliExpress
   */
  static validateAliExpressUrl(url: string): boolean {
    const aliExpressPattern = /^https?:\/\/(www\.)?aliexpress\.com\/item\/[^/]+\.html/;
    return aliExpressPattern.test(url);
  }

  /**
   * Extraire l'ID produit d'une URL AliExpress
   */
  static extractProductIdFromUrl(url: string): string | null {
    const match = url.match(/\/item\/([^/]+)\.html/);
    return match ? match[1] : null;
  }
}
