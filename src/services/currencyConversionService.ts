// 🔄 SERVICE DE CONVERSION DE DEVISES SIMPLIFIÉ
import { supabase } from '@/integrations/supabase/client';

export interface CurrencyRate {
  id: string;
  base_currency: string;
  target_currency: string;
  rate: number;
  last_updated: string;
}

export interface ConversionResult {
  originalAmount: number;
  originalCurrency: string;
  convertedAmount: number;
  targetCurrency: string;
  rate: number;
  lastUpdated: string;
}

/**
 * Service de conversion de devises simplifié
 * Utilise des taux de change fixes pour les devises principales
 */
export class CurrencyConversionService {
  // Taux de change fixes (à remplacer par une API en production)
  private static readonly EXCHANGE_RATES: Record<string, Record<string, number>> = {
    'XOF': {
      'EUR': 0.00152,
      'USD': 0.00167,
      'GBP': 0.00132,
      'XOF': 1
    },
    'EUR': {
      'XOF': 655.957,
      'USD': 1.09,
      'GBP': 0.86,
      'EUR': 1
    },
    'USD': {
      'XOF': 598.5,
      'EUR': 0.92,
      'GBP': 0.79,
      'USD': 1
    },
    'GBP': {
      'XOF': 757.58,
      'EUR': 1.16,
      'USD': 1.27,
      'GBP': 1
    }
  };

  /**
   * Convertit un montant d'une devise à une autre
   */
  static async convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): Promise<ConversionResult | null> {
    try {
      // Si les devises sont identiques, retourner le montant original
      if (fromCurrency === toCurrency) {
        return {
          originalAmount: amount,
          originalCurrency: fromCurrency,
          convertedAmount: amount,
          targetCurrency: toCurrency,
          rate: 1,
          lastUpdated: new Date().toISOString()
        };
      }

      // Obtenir le taux de change
      const rate = this.getExchangeRate(fromCurrency, toCurrency);
      if (rate === null) {
        console.warn(`⚠️ Taux de change non disponible: ${fromCurrency} → ${toCurrency}`);
        return null;
      }

      const convertedAmount = amount * rate;

      return {
        originalAmount: amount,
        originalCurrency: fromCurrency,
        convertedAmount: Math.round(convertedAmount * 100) / 100, // Arrondir à 2 décimales
        targetCurrency: toCurrency,
        rate: rate,
        lastUpdated: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Erreur lors de la conversion de devise:', error);
      return null;
    }
  }

  /**
   * Obtient le taux de change entre deux devises
   */
  static getExchangeRate(fromCurrency: string, toCurrency: string): number | null {
    try {
      // Si les devises sont identiques, retourner 1
      if (fromCurrency === toCurrency) {
        return 1;
      }

      // Vérifier si le taux existe
      const rates = this.EXCHANGE_RATES[fromCurrency];
      if (!rates) {
        console.warn(`⚠️ Devise source non supportée: ${fromCurrency}`);
        return null;
      }

      const rate = rates[toCurrency];
      if (rate === undefined) {
        console.warn(`⚠️ Taux de change non disponible: ${fromCurrency} → ${toCurrency}`);
        return null;
      }

      return rate;

    } catch (error) {
      console.error('❌ Erreur lors de la récupération du taux de change:', error);
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
      console.log(`🔄 Mise à jour des montants du store ${storeId}: ${oldCurrency} → ${newCurrency}`);

      // Obtenir le taux de conversion
      const rate = this.getExchangeRate(oldCurrency, newCurrency);
      if (!rate) {
        console.error('❌ Impossible d\'obtenir le taux de conversion');
        return false;
      }

      console.log(`📊 Taux de conversion: ${rate}`);

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
          const newPrice = Math.round((product.price || 0) * rate * 100) / 100;
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
        .from('orders')
        .select('id, total_amount')
        .eq('store_id', storeId);

      if (ordersFetchError) {
        console.error('❌ Erreur lors de la récupération des commandes:', ordersFetchError);
      } else if (orders && orders.length > 0) {
        // Mettre à jour chaque commande individuellement
        for (const order of orders) {
          const newAmount = Math.round((order.total_amount || 0) * rate * 100) / 100;
          const { error: updateError } = await supabase
            .from('orders')
            .update({ total_amount: newAmount })
            .eq('id', order.id);

          if (updateError) {
            console.error(`❌ Erreur lors de la mise à jour de la commande ${order.id}:`, updateError);
          }
        }
        console.log(`✅ Montants de ${orders.length} commandes mis à jour`);
      }

      console.log('✅ Mise à jour des montants terminée');
      return true;

    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour des montants:', error);
      return false;
    }
  }

  /**
   * Récupère tous les taux de change disponibles
   */
  static async getAllRates(): Promise<CurrencyRate[]> {
    try {
      // Créer des taux de change à partir des données statiques
      const rates: CurrencyRate[] = [];
      const currencies = Object.keys(this.EXCHANGE_RATES);

      for (const baseCurrency of currencies) {
        for (const targetCurrency of currencies) {
          if (baseCurrency !== targetCurrency) {
            const rate = this.getExchangeRate(baseCurrency, targetCurrency);
            if (rate !== null) {
              rates.push({
                id: `${baseCurrency}_${targetCurrency}`,
                base_currency: baseCurrency,
                target_currency: targetCurrency,
                rate: rate,
                last_updated: new Date().toISOString()
              });
            }
          }
        }
      }

      return rates;

    } catch (error) {
      console.error('❌ Erreur lors de la récupération des taux:', error);
      return [];
    }
  }

  /**
   * Force la mise à jour des taux de change (simulation)
   */
  static async forceUpdateRates(): Promise<boolean> {
    try {
      console.log('🔄 Simulation de la mise à jour des taux de change...');
      
      // En production, cela appellerait une API externe
      // Pour l'instant, on simule juste une mise à jour réussie
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ Mise à jour des taux simulée avec succès');
      return true;

    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour des taux:', error);
      return false;
    }
  }

  /**
   * Formate un montant selon la devise
   */
  static formatAmount(amount: number, currency: string): string {
    const formatter = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return formatter.format(amount);
  }
}
