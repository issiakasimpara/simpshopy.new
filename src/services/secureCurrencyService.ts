// Service sécurisé pour la conversion de devises via Edge Function Supabase
// La clé API Fixer.io est cachée côté serveur

import { supabase } from '@/integrations/supabase/client';

export interface ConversionResult {
  originalAmount: number;
  originalCurrency: string;
  convertedAmount: number;
  targetCurrency: string;
  rate: number;
  timestamp: string;
}

export class SecureCurrencyService {
  /**
   * Convertit un montant d'une devise vers une autre via Edge Function
   */
  static async convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): Promise<ConversionResult | null> {
    try {
      console.log(`🔄 Conversion sécurisée: ${amount} ${fromCurrency} → ${toCurrency}`);

      const { data, error } = await supabase.functions.invoke('currency-converter', {
        body: {
          action: 'convert',
          fromCurrency,
          toCurrency,
          amount
        }
      });

      if (error) {
        console.error('❌ Erreur Edge Function:', error);
        return null;
      }

      if (data.success && data.result) {
        console.log('✅ Conversion réussie via Edge Function');
        return data.result;
      }

      console.error('❌ Erreur de conversion:', data.error);
      return null;

    } catch (error) {
      console.error('❌ Erreur lors de la conversion sécurisée:', error);
      return null;
    }
  }

  /**
   * Obtient le taux de change entre deux devises via Edge Function
   */
  static async getExchangeRate(
    fromCurrency: string,
    toCurrency: string
  ): Promise<number | null> {
    try {
      console.log(`📊 Taux de change sécurisé: ${fromCurrency} → ${toCurrency}`);

      const { data, error } = await supabase.functions.invoke('currency-converter', {
        body: {
          action: 'getRate',
          fromCurrency,
          toCurrency
        }
      });

      if (error) {
        console.error('❌ Erreur Edge Function:', error);
        return null;
      }

      if (data.success && data.rate !== undefined) {
        console.log('✅ Taux récupéré via Edge Function');
        return data.rate;
      }

      console.error('❌ Erreur de récupération du taux:', data.error);
      return null;

    } catch (error) {
      console.error('❌ Erreur lors de la récupération du taux sécurisé:', error);
      return null;
    }
  }

  /**
   * Met à jour automatiquement les montants dans la base de données lors d'un changement de devise
   */
  static async updateStoreAmounts(
    storeId: string,
    oldCurrency: string,
    newCurrency: string
  ): Promise<boolean> {
    try {
      console.log(`🔄 Mise à jour sécurisée des montants du store ${storeId}: ${oldCurrency} → ${newCurrency}`);

      // Obtenir le taux de conversion via Edge Function
      const rate = await this.getExchangeRate(oldCurrency, newCurrency);
      if (!rate) {
        console.error('❌ Impossible d\'obtenir le taux de conversion sécurisé');
        return false;
      }

      console.log(`📊 Taux de conversion sécurisé: ${rate}`);

      // Mettre à jour les prix des produits
      const { data: products, error: productsFetchError } = await supabase
        .from('products')
        .select('id, price')
        .eq('store_id', storeId);

      if (productsFetchError) {
        console.error('❌ Erreur lors de la récupération des produits:', productsFetchError);
      } else if (products && products.length > 0) {
        // Mettre à jour chaque produit individuellement
        for (const product of products) {
          const newPrice = product.price * rate;
          const { error: updateError } = await supabase
            .from('products')
            .update({ price: newPrice })
            .eq('id', product.id);

          if (updateError) {
            console.error(`❌ Erreur lors de la mise à jour du produit ${product.id}:`, updateError);
          }
        }
        console.log(`✅ Prix de ${products.length} produits mis à jour`);
      }

      // Mettre à jour les montants des commandes
      const { data: orders, error: ordersFetchError } = await supabase
        .from('public_orders')
        .select('id, total_amount')
        .eq('store_id', storeId);

      if (ordersFetchError) {
        console.error('❌ Erreur lors de la récupération des commandes:', ordersFetchError);
      } else if (orders && orders.length > 0) {
        // Mettre à jour chaque commande individuellement
        for (const order of orders) {
          const newAmount = order.total_amount * rate;
          const { error: updateError } = await supabase
            .from('public_orders')
            .update({ total_amount: newAmount })
            .eq('id', order.id);

          if (updateError) {
            console.error(`❌ Erreur lors de la mise à jour de la commande ${order.id}:`, updateError);
          }
        }
        console.log(`✅ Montants de ${orders.length} commandes mis à jour`);
      }

      // Mettre à jour les montants des paiements
      const { data: payments, error: paymentsFetchError } = await supabase
        .from('payments')
        .select('id, amount')
        .eq('store_id', storeId);

      if (paymentsFetchError) {
        console.error('❌ Erreur lors de la récupération des paiements:', paymentsFetchError);
      } else if (payments && payments.length > 0) {
        // Mettre à jour chaque paiement individuellement
        for (const payment of payments) {
          const newAmount = payment.amount * rate;
          const { error: updateError } = await supabase
            .from('payments')
            .update({ amount: newAmount })
            .eq('id', payment.id);

          if (updateError) {
            console.error(`❌ Erreur lors de la mise à jour du paiement ${payment.id}:`, updateError);
          }
        }
        console.log(`✅ Montants de ${payments.length} paiements mis à jour`);
      }

      console.log('✅ Mise à jour sécurisée des montants terminée');
      return true;

    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour sécurisée des montants:', error);
      return false;
    }
  }

  /**
   * Teste la connexion à l'API Fixer.io via Edge Function
   */
  static async testConnection(): Promise<boolean> {
    try {
      console.log('🧪 Test de connexion sécurisé à Fixer.io...');

      const { data, error } = await supabase.functions.invoke('currency-converter', {
        body: {
          action: 'testConnection'
        }
      });

      if (error) {
        console.error('❌ Erreur Edge Function:', error);
        return false;
      }

      if (data.success) {
        console.log('✅ Connexion sécurisée à Fixer.io réussie');
        return true;
      } else {
        console.error('❌ Erreur de connexion sécurisée:', data.error);
        return false;
      }

    } catch (error) {
      console.error('❌ Erreur de connexion sécurisée:', error);
      return false;
    }
  }
}
