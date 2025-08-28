import { supabase } from '@/integrations/supabase/client';

export interface OnboardingEvent {
  user_id: string;
  event_type: 'step_started' | 'step_completed' | 'step_abandoned' | 'onboarding_completed';
  step_number: number;
  step_name: string;
  data?: Record<string, any>;
  timestamp: string;
  session_id: string;
}

export interface OnboardingMetrics {
  total_users: number;
  completion_rate: number;
  average_time_to_complete: number;
  step_abandonment_rates: Record<number, number>;
  popular_choices: {
    experience_levels: Record<string, number>;
    business_types: Record<string, number>;
    sectors: Record<string, number>;
    countries: Record<string, number>;
    currencies: Record<string, number>;
  };
}

export class OnboardingAnalyticsService {
  /**
   * Enregistrer un événement d'onboarding
   */
  static async trackEvent(event: Omit<OnboardingEvent, 'timestamp'>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('onboarding_events')
        .insert({
          ...event,
          timestamp: new Date().toISOString()
        });

      if (error) {
        console.error('Erreur lors du tracking:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erreur lors du tracking:', error);
      return false;
    }
  }

  /**
   * Enregistrer le début d'une étape
   */
  static async trackStepStarted(
    userId: string,
    stepNumber: number,
    stepName: string,
    sessionId: string
  ): Promise<boolean> {
    return this.trackEvent({
      user_id: userId,
      event_type: 'step_started',
      step_number: stepNumber,
      step_name: stepName,
      session_id: sessionId
    });
  }

  /**
   * Enregistrer la completion d'une étape
   */
  static async trackStepCompleted(
    userId: string,
    stepNumber: number,
    stepName: string,
    sessionId: string,
    data?: Record<string, any>
  ): Promise<boolean> {
    return this.trackEvent({
      user_id: userId,
      event_type: 'step_completed',
      step_number: stepNumber,
      step_name: stepName,
      session_id: sessionId,
      data
    });
  }

  /**
   * Enregistrer l'abandon d'une étape
   */
  static async trackStepAbandoned(
    userId: string,
    stepNumber: number,
    stepName: string,
    sessionId: string,
    reason?: string
  ): Promise<boolean> {
    return this.trackEvent({
      user_id: userId,
      event_type: 'step_abandoned',
      step_number: stepNumber,
      step_name: stepName,
      session_id: sessionId,
      data: { reason }
    });
  }

  /**
   * Enregistrer la completion de l'onboarding
   */
  static async trackOnboardingCompleted(
    userId: string,
    sessionId: string,
    finalData: Record<string, any>
  ): Promise<boolean> {
    return this.trackEvent({
      user_id: userId,
      event_type: 'onboarding_completed',
      step_number: 5,
      step_name: 'onboarding_completed',
      session_id: sessionId,
      data: finalData
    });
  }

  /**
   * Récupérer les métriques d'onboarding
   */
  static async getMetrics(): Promise<OnboardingMetrics | null> {
    try {
      // Récupérer les statistiques de base
      const { data: totalUsers } = await supabase
        .from('user_onboarding')
        .select('id', { count: 'exact' });

      const { data: completedUsers } = await supabase
        .from('user_onboarding')
        .select('id', { count: 'exact' })
        .eq('onboarding_completed', true);

      // Récupérer les taux d'abandon par étape
      const { data: abandonmentData } = await supabase
        .from('onboarding_events')
        .select('step_number, event_type')
        .in('event_type', ['step_started', 'step_abandoned']);

      // Récupérer les choix populaires
      const { data: popularChoices } = await supabase
        .from('user_onboarding')
        .select('experience_level, business_type, sector, country_code, currency_code');

      // Calculer les métriques
      const completionRate = totalUsers && completedUsers 
        ? (completedUsers / totalUsers) * 100 
        : 0;

      const stepAbandonmentRates: Record<number, number> = {};
      if (abandonmentData) {
        const stepStats = abandonmentData.reduce((acc, event) => {
          if (!acc[event.step_number]) {
            acc[event.step_number] = { started: 0, abandoned: 0 };
          }
          if (event.event_type === 'step_started') {
            acc[event.step_number].started++;
          } else if (event.event_type === 'step_abandoned') {
            acc[event.step_number].abandoned++;
          }
          return acc;
        }, {} as Record<number, { started: number; abandoned: number }>);

        Object.entries(stepStats).forEach(([step, stats]) => {
          stepAbandonmentRates[parseInt(step)] = stats.started > 0 
            ? (stats.abandoned / stats.started) * 100 
            : 0;
        });
      }

      const popularChoicesData = {
        experience_levels: {},
        business_types: {},
        sectors: {},
        countries: {},
        currencies: {}
      } as OnboardingMetrics['popular_choices'];

      if (popularChoices) {
        popularChoices.forEach(choice => {
          // Compter les niveaux d'expérience
          if (choice.experience_level) {
            popularChoicesData.experience_levels[choice.experience_level] = 
              (popularChoicesData.experience_levels[choice.experience_level] || 0) + 1;
          }
          
          // Compter les types de business
          if (choice.business_type) {
            popularChoicesData.business_types[choice.business_type] = 
              (popularChoicesData.business_types[choice.business_type] || 0) + 1;
          }
          
          // Compter les secteurs
          if (choice.sector) {
            popularChoicesData.sectors[choice.sector] = 
              (popularChoicesData.sectors[choice.sector] || 0) + 1;
          }
          
          // Compter les pays
          if (choice.country_code) {
            popularChoicesData.countries[choice.country_code] = 
              (popularChoicesData.countries[choice.country_code] || 0) + 1;
          }
          
          // Compter les devises
          if (choice.currency_code) {
            popularChoicesData.currencies[choice.currency_code] = 
              (popularChoicesData.currencies[choice.currency_code] || 0) + 1;
          }
        });
      }

      return {
        total_users: totalUsers || 0,
        completion_rate: completionRate,
        average_time_to_complete: 0, // À implémenter avec des timestamps
        step_abandonment_rates: stepAbandonmentRates,
        popular_choices: popularChoicesData
      };

    } catch (error) {
      console.error('Erreur lors de la récupération des métriques:', error);
      return null;
    }
  }
}
