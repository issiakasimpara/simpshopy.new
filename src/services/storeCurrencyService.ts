import { supabase } from '@/integrations/supabase/client';
import { formatCurrency, type Currency } from '@/utils/formatCurrency';
import { SecureCurrencyService } from './secureCurrencyService'; // Utilise le service sécurisé

export interface StoreCurrencySettings {
  store_id: string;
  default_currency: Currency;
  enabled_countries: string[];
  tax_settings: {
    includeTax: boolean;
    taxRate: number;
    taxLabel: string;
  };
  created_at: string;
  updated_at: string;
}

export class StoreCurrencyService {
  /**
   * Récupère la devise de la boutique
   */
  static async getStoreCurrency(storeId: string): Promise<Currency> {
    try {
      // Log seulement en développement et seulement la première fois
      if (import.meta.env.DEV && !window.__CURRENCY_LOGGED__) {
        console.log('🔍 StoreCurrencyService - Récupération devise pour storeId:', storeId);
        window.__CURRENCY_LOGGED__ = true;
      }
      
      const { data, error } = await supabase
        .from('market_settings')
        .select('default_currency')
        .eq('store_id', storeId)
        .single();

      if (error) {
        // Si la table n'existe pas, retourner la devise par défaut
        if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
          console.log('❌ Table market_settings n\'existe pas, utilisation de la devise par défaut');
          return 'XOF';
        }
        console.error('❌ Erreur lors de la récupération de la devise:', error);
        return 'XOF'; // Devise par défaut
      }

      const currency = (data?.default_currency as Currency) || 'XOF';
      // Log seulement en cas de succès et seulement la première fois
      if (import.meta.env.DEV && !window.__CURRENCY_SUCCESS_LOGGED__) {
        console.log('✅ StoreCurrencyService - Devise récupérée:', currency, 'pour storeId:', storeId);
        window.__CURRENCY_SUCCESS_LOGGED__ = true;
      }
      
      return currency;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de la devise:', error);
      return 'XOF';
    }
  }

  /**
   * Met à jour la devise de la boutique avec conversion automatique des montants
   */
  static async updateStoreCurrency(storeId: string, currency: Currency): Promise<boolean> {
    try {
      // Récupérer l'ancienne devise
      const oldCurrency = await this.getStoreCurrency(storeId);
      
      console.log(`🔄 Changement de devise: ${oldCurrency} → ${currency}`);

      // Mettre à jour la devise dans la base de données
      const { error } = await supabase
        .from('market_settings')
        .upsert({
          store_id: storeId,
          default_currency: currency,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'store_id'
        });

      if (error) {
        console.error('Erreur lors de la mise à jour de la devise:', error);
        return false;
      }

      // Si la devise a changé, convertir automatiquement tous les montants
      if (oldCurrency !== currency) {
        console.log(`💰 Conversion automatique des montants: ${oldCurrency} → ${currency}`);
        
        const conversionSuccess = await SecureCurrencyService.updateStoreAmounts(
          storeId,
          oldCurrency,
          currency
        );

        if (conversionSuccess) {
          console.log('✅ Conversion automatique terminée avec succès');
        } else {
          console.warn('⚠️ La devise a été mise à jour mais la conversion automatique a échoué');
        }
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la devise:', error);
      return false;
    }
  }

  /**
   * Récupère tous les paramètres de devise de la boutique
   */
  static async getStoreCurrencySettings(storeId: string): Promise<StoreCurrencySettings | null> {
    try {
      const { data, error } = await supabase
        .from('market_settings')
        .select('*')
        .eq('store_id', storeId)
        .single();

      if (error) {
        console.error('Erreur lors de la récupération des paramètres de devise:', error);
        return null;
      }

      return data as StoreCurrencySettings;
    } catch (error) {
      console.error('Erreur lors de la récupération des paramètres de devise:', error);
      return null;
    }
  }

  /**
   * Met à jour tous les paramètres de devise de la boutique
   */
  static async updateStoreCurrencySettings(
    storeId: string, 
    settings: Partial<StoreCurrencySettings>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('market_settings')
        .upsert({
          store_id: storeId,
          ...settings,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'store_id'
        });

      if (error) {
        console.error('Erreur lors de la mise à jour des paramètres de devise:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour des paramètres de devise:', error);
      return false;
    }
  }

  /**
   * Formate un prix selon la devise de la boutique
   */
  static async formatPriceForStore(storeId: string, amount: number, options?: {
    showSymbol?: boolean;
    compact?: boolean;
  }): Promise<string> {
    const currency = await this.getStoreCurrency(storeId);
    return formatCurrency(amount, currency, options);
  }

  /**
   * Initialise les paramètres de devise pour une nouvelle boutique
   */
  static async initializeStoreCurrency(
    storeId: string, 
    currency: Currency = 'XOF',
    countries: string[] = ['ML', 'CI', 'SN', 'BF']
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('market_settings')
        .insert({
          store_id: storeId,
          default_currency: currency,
          enabled_countries: countries,
          tax_settings: {
            includeTax: false,
            taxRate: 0,
            taxLabel: 'TVA'
          }
        });

      if (error) {
        console.error('Erreur lors de l\'initialisation de la devise:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la devise:', error);
      return false;
    }
  }

  /**
   * Vérifie si une devise est supportée
   */
  static isCurrencySupported(currency: string): currency is Currency {
    const supportedCurrencies: Currency[] = ['XOF', 'XAF', 'GHS', 'NGN', 'EUR', 'USD'];
    return supportedCurrencies.includes(currency as Currency);
  }

  /**
   * Obtient la liste des devises supportées
   */
  static getSupportedCurrencies(): Currency[] {
    return ['XOF', 'XAF', 'GHS', 'NGN', 'EUR', 'USD'];
  }
}
