import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { useStores } from './useStores';
import { OnboardingService } from '@/services/onboardingService';
import { useStoreCurrency } from './useStoreCurrency';
import type { 
  UserOnboarding, 
  OnboardingData, 
  SupportedCountry, 
  SupportedCurrency,
  CountryCurrency 
} from '@/types/onboarding';

export const useOnboarding = () => {
  const { user } = useAuth();
  const { store } = useStores();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({});
  
  // Utiliser le bon store ID au lieu de user.id
  const storeId = store?.id;
  const { initializeCurrency } = useStoreCurrency(storeId);

  // Récupérer les données d'onboarding de l'utilisateur
  const { data: userOnboarding, isLoading: isLoadingOnboarding } = useQuery({
    queryKey: ['user-onboarding', user?.id],
    queryFn: () => OnboardingService.getUserOnboarding(user?.id || ''),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Récupérer tous les pays supportés
  const { data: countries, isLoading: isLoadingCountries } = useQuery({
    queryKey: ['supported-countries'],
    queryFn: OnboardingService.getSupportedCountries,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Récupérer toutes les devises supportées
  const { data: currencies, isLoading: isLoadingCurrencies } = useQuery({
    queryKey: ['supported-currencies'],
    queryFn: OnboardingService.getSupportedCurrencies,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Mutation pour sauvegarder les données d'onboarding
  const saveOnboardingMutation = useMutation({
    mutationFn: async (data: Partial<OnboardingData>) => {
      if (!user?.id) throw new Error('Utilisateur non connecté');
      return OnboardingService.saveUserOnboarding(user.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-onboarding'] });
    },
  });

  // Mutation pour finaliser l'onboarding
  const completeOnboardingMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('Utilisateur non connecté');
      return OnboardingService.completeOnboarding(user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-onboarding'] });
    },
  });

  // Mutation pour mettre à jour l'étape
  const updateStepMutation = useMutation({
    mutationFn: async (step: number) => {
      if (!user?.id) throw new Error('Utilisateur non connecté');
      return OnboardingService.updateOnboardingStep(user.id, step);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-onboarding'] });
    },
  });

  // Initialiser les données depuis la base de données
  useEffect(() => {
    if (userOnboarding) {
      setOnboardingData({
        experience_level: userOnboarding.experience_level,
        business_type: userOnboarding.business_type,
        sector: userOnboarding.sector,
        country_code: userOnboarding.country_code,
        currency_code: userOnboarding.currency_code,
      });
      setCurrentStep(userOnboarding.onboarding_step);
    }
  }, [userOnboarding]);

  // Sauvegarder une étape d'onboarding
  const saveStep = useCallback(async (stepData: Partial<OnboardingData>) => {
    if (!user?.id) return false;

    const newData = { ...onboardingData, ...stepData };
    setOnboardingData(newData);

    const success = await saveOnboardingMutation.mutateAsync(newData);
    if (success) {
      return true;
    }
    return false;
  }, [user?.id, onboardingData, saveOnboardingMutation]);

  // Passer à l'étape suivante
  const nextStep = useCallback(async () => {
    
    if (!user?.id) {
      return false;
    }

    const nextStepNumber = currentStep + 1;
    
    setCurrentStep(nextStepNumber);

    try {
      const success = await updateStepMutation.mutateAsync(nextStepNumber);
      if (success) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Erreur dans updateStepMutation:', error);
      return false;
    }
  }, [user?.id, currentStep, updateStepMutation]);

  // Passer à l'étape précédente
  const previousStep = useCallback(async () => {
    if (!user?.id || currentStep <= 1) return false;

    const prevStepNumber = currentStep - 1;
    setCurrentStep(prevStepNumber);

    const success = await updateStepMutation.mutateAsync(prevStepNumber);
    if (success) {
      return true;
    }
    return false;
  }, [user?.id, currentStep, updateStepMutation]);

  // Finaliser l'onboarding
  const completeOnboarding = useCallback(async () => {
    if (!user?.id) return false;

    const success = await completeOnboardingMutation.mutateAsync();
    if (success) {
      return true;
    }
    return false;
  }, [user?.id, completeOnboardingMutation]);

  // Initialiser la devise pour la boutique
  const initializeStoreCurrency = useCallback(async (currency: SupportedCurrency, countries: string[]) => {
    if (!storeId) {
      console.error('Store ID manquant pour initialiser la devise');
      return false;
    }

    try {
      const success = await initializeCurrency(currency, countries);
      if (success) {
        console.log('Devise initialisée avec succès pour le store:', storeId);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la devise:', error);
      return false;
    }
  }, [storeId, initializeCurrency]);

  // Déterminer si l'onboarding est terminé
  const isOnboardingCompleted = userOnboarding?.onboarding_completed || false;

  // Déterminer si l'onboarding doit être affiché
  const shouldShowOnboarding = user?.id && !isOnboardingCompleted;

  // Fonction pour récupérer les devises d'un pays
  const getCurrenciesForCountry = useCallback(async (countryCode: string) => {
    try {
      return await OnboardingService.getCurrenciesForCountry(countryCode);
    } catch (error) {
      console.error('Erreur lors de la récupération des devises du pays:', error);
      return [];
    }
  }, []);

  return {
    // État
    currentStep,
    onboardingData,
    userOnboarding,
    countries,
    currencies,
    
    // Loading states
    isLoading: isLoadingOnboarding || isLoadingCountries || isLoadingCurrencies,
    isLoadingOnboarding,
    isLoadingCountries,
    isLoadingCurrencies,
    isSaving: saveOnboardingMutation.isPending,
    isCompleting: completeOnboardingMutation.isPending,
    isUpdatingStep: updateStepMutation.isPending,
    
    // Actions
    saveStep,
    nextStep,
    previousStep,
    completeOnboarding,
    initializeStoreCurrency,
    getCurrenciesForCountry,
    
    // Mutations
    saveOnboardingMutation,
    completeOnboardingMutation,
    updateStepMutation,
    
    // Onboarding status
    isOnboardingCompleted,
    shouldShowOnboarding,
  };
};
