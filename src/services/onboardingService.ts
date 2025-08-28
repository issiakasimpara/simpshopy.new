import { supabase } from '@/integrations/supabase/client';
import type { 
  UserOnboarding, 
  SupportedCurrency, 
  SupportedCountry, 
  CountryCurrency,
  OnboardingData 
} from '@/types/onboarding';

export class OnboardingService {
  /**
   * Récupère les données d'onboarding d'un utilisateur
   */
  static async getUserOnboarding(userId: string): Promise<UserOnboarding | null> {
    try {
      const { data, error } = await supabase
        .from('user_onboarding')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Erreur lors de la récupération de l\'onboarding:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'onboarding:', error);
      return null;
    }
  }

  /**
   * Crée ou met à jour les données d'onboarding d'un utilisateur
   */
  static async saveUserOnboarding(userId: string, onboardingData: Partial<OnboardingData>): Promise<boolean> {
    try {
      const { data: existingData } = await supabase
        .from('user_onboarding')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (existingData) {
        // Mise à jour
        const { error } = await supabase
          .from('user_onboarding')
          .update({
            ...onboardingData,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);

        if (error) {
          console.error('Erreur lors de la mise à jour de l\'onboarding:', error);
          return false;
        }
      } else {
        // Création
        const { error } = await supabase
          .from('user_onboarding')
          .insert({
            user_id: userId,
            ...onboardingData
          });

        if (error) {
          console.error('Erreur lors de la création de l\'onboarding:', error);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'onboarding:', error);
      return false;
    }
  }

  /**
   * Marque l'onboarding comme terminé
   */
  static async completeOnboarding(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_onboarding')
        .update({
          onboarding_completed: true,
          onboarding_step: 5, // Mise à jour pour les 5 étapes
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Erreur lors de la finalisation de l\'onboarding:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la finalisation de l\'onboarding:', error);
      return false;
    }
  }

  /**
   * Met à jour l'étape d'onboarding
   */
  static async updateOnboardingStep(userId: string, step: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_onboarding')
        .update({
          onboarding_step: step,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Erreur lors de la mise à jour de l\'étape:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'étape:', error);
      return false;
    }
  }

  /**
   * Récupère tous les pays supportés
   */
  static async getSupportedCountries(): Promise<SupportedCountry[]> {
    try {
      const { data, error } = await supabase
        .from('supported_countries')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Erreur lors de la récupération des pays:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des pays:', error);
      return [];
    }
  }

  /**
   * Récupère toutes les devises supportées
   */
  static async getSupportedCurrencies(): Promise<SupportedCurrency[]> {
    try {
      const { data, error } = await supabase
        .from('supported_currencies')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Erreur lors de la récupération des devises:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des devises:', error);
      return [];
    }
  }

  /**
   * Récupère les devises disponibles pour un pays
   */
  static async getCurrenciesForCountry(countryCode: string): Promise<CountryCurrency[]> {
    try {
      const { data, error } = await supabase
        .from('country_currencies')
        .select(`
          *,
          supported_currencies (
            code,
            name,
            symbol,
            locale,
            decimals
          )
        `)
        .eq('country_code', countryCode)
        .order('is_primary', { ascending: false });

      if (error) {
        console.error('Erreur lors de la récupération des devises du pays:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des devises du pays:', error);
      return [];
    }
  }

  /**
   * Récupère les informations d'un pays
   */
  static async getCountryInfo(countryCode: string): Promise<SupportedCountry | null> {
    try {
      const { data, error } = await supabase
        .from('supported_countries')
        .select('*')
        .eq('code', countryCode)
        .single();

      if (error) {
        console.error('Erreur lors de la récupération des informations du pays:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des informations du pays:', error);
      return null;
    }
  }

  /**
   * Récupère les informations d'une devise
   */
  static async getCurrencyInfo(currencyCode: string): Promise<SupportedCurrency | null> {
    try {
      const { data, error } = await supabase
        .from('supported_currencies')
        .select('*')
        .eq('code', currencyCode)
        .single();

      if (error) {
        console.error('Erreur lors de la récupération des informations de la devise:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des informations de la devise:', error);
      return null;
    }
  }

  /**
   * Vérifie si un utilisateur a complété l'onboarding
   */
  static async hasCompletedOnboarding(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_onboarding')
        .select('onboarding_completed')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Erreur lors de la vérification de l\'onboarding:', error);
        return false;
      }

      return data?.onboarding_completed || false;
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'onboarding:', error);
      return false;
    }
  }

  /**
   * Récupère l'étape actuelle de l'onboarding
   */
  static async getCurrentOnboardingStep(userId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('user_onboarding')
        .select('onboarding_step')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Erreur lors de la récupération de l\'étape:', error);
        return 1;
      }

      return data?.onboarding_step || 1;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'étape:', error);
      return 1;
    }
  }

  /**
   * Récupère la devise choisie lors de l'onboarding
   */
  static async getOnboardingCurrency(userId: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('user_onboarding')
        .select('currency_code')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Erreur lors de la récupération de la devise d\'onboarding:', error);
        return null;
      }

      return data?.currency_code || null;
    } catch (error) {
      console.error('Erreur lors de la récupération de la devise d\'onboarding:', error);
      return null;
    }
  }

  /**
   * Récupère le pays choisi lors de l'onboarding
   */
  static async getOnboardingCountry(userId: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('user_onboarding')
        .select('country_code')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Erreur lors de la récupération du pays d\'onboarding:', error);
        return null;
      }

      return data?.country_code || null;
    } catch (error) {
      console.error('Erreur lors de la récupération du pays d\'onboarding:', error);
      return null;
    }
  }
}
