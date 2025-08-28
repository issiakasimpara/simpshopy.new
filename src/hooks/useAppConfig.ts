import { APP_CONFIG } from '@/config/app';
import { formatCurrency, type Currency } from '@/utils/formatCurrency';

/**
 * Hook pour accéder à la configuration de l'application
 */
export function useAppConfig() {
  
  /**
   * Formate un prix selon la configuration de l'app
   */
  const formatPrice = (amount: number, currency?: Currency, compact = false) => {
    const defaultCurrency = currency || APP_CONFIG.region.defaultCurrency as Currency;
    return formatCurrency(amount, defaultCurrency, { compact });
  };

  /**
   * Obtient les moyens de paiement pour un pays
   */
  const getPaymentMethodsForCountry = (countryCode: string) => {
    const mobileMethods = APP_CONFIG.paymentMethods.mobileMoney.filter(
      method => method.countries.includes(countryCode)
    );
    
    const traditionalMethods = APP_CONFIG.paymentMethods.traditional.filter(
      method => method.countries.includes('ALL') || method.countries.includes(countryCode)
    );
    
    return {
      mobile: mobileMethods,
      traditional: traditionalMethods,
      all: [...mobileMethods, ...traditionalMethods]
    };
  };

  /**
   * Vérifie si un pays est supporté
   */
  const isCountrySupported = (countryCode: string) => {
    return APP_CONFIG.region.countries.includes(countryCode);
  };

  /**
   * Obtient les informations d'un plan tarifaire
   */
  const getPricingPlan = (planName: 'starter' | 'business' | 'enterprise') => {
    const plan = APP_CONFIG.pricing[planName];
    return {
      ...plan,
      formattedPrice: formatPrice(plan.price),
      pricePerYear: plan.price * 12,
      formattedPricePerYear: formatPrice(plan.price * 12)
    };
  };

  /**
   * Obtient tous les plans tarifaires avec prix formatés
   */
  const getAllPricingPlans = () => {
    return Object.entries(APP_CONFIG.pricing).map(([key, plan]) => ({
      id: key,
      ...plan,
      formattedPrice: formatPrice(plan.price),
      pricePerYear: plan.price * 12,
      formattedPricePerYear: formatPrice(plan.price * 12)
    }));
  };

  /**
   * Obtient les informations de contact formatées
   */
  const getContactInfo = () => {
    return {
      ...APP_CONFIG.support,
      email: APP_CONFIG.supportEmail,
      salesEmail: APP_CONFIG.salesEmail,
      website: APP_CONFIG.website
    };
  };

  /**
   * Obtient les liens des réseaux sociaux
   */
  const getSocialLinks = () => {
    return APP_CONFIG.social;
  };

  /**
   * Obtient les statistiques formatées
   */
  const getFormattedStats = () => {
    return {
      stores: APP_CONFIG.stats.stores,
      revenue: APP_CONFIG.stats.revenue,
      customers: APP_CONFIG.stats.customers,
      countries: APP_CONFIG.stats.countries
    };
  };

  return {
    // Configuration complète
    config: APP_CONFIG,
    
    // Informations de base
    appName: APP_CONFIG.name,
    tagline: APP_CONFIG.tagline,
    description: APP_CONFIG.description,
    
    // Fonctions utilitaires
    formatPrice,
    getPaymentMethodsForCountry,
    isCountrySupported,
    getPricingPlan,
    getAllPricingPlans,
    getContactInfo,
    getSocialLinks,
    getFormattedStats,
    
    // Configuration régionale
    region: APP_CONFIG.region,
    
    // Fonctionnalités
    features: APP_CONFIG.features.core,
    
    // Configuration technique
    technical: APP_CONFIG.technical
  };
}

export default useAppConfig;
