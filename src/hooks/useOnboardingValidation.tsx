import { useMemo } from 'react';
import type { OnboardingData } from '@/types/onboarding';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  canProceed: boolean;
}

export const useOnboardingValidation = (
  currentStep: number,
  onboardingData: Partial<OnboardingData>
): ValidationResult => {
  const validation = useMemo(() => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validation par étape
    switch (currentStep) {
      case 1: { // Expérience
        if (!onboardingData.experience_level) {
          errors.push('Veuillez sélectionner votre niveau d\'expérience');
        }
        break;
      }

      case 2: { // Type de business
        if (!onboardingData.business_type) {
          errors.push('Veuillez sélectionner le type de votre business');
        }
        break;
      }

      case 3: { // Secteur
        if (!onboardingData.sector) {
          errors.push('Veuillez sélectionner votre secteur d\'activité');
        }
        break;
      }

      case 4: { // Configuration géographique
        if (!onboardingData.country_code) {
          errors.push('Veuillez sélectionner votre pays');
        }
        if (!onboardingData.currency_code) {
          errors.push('Veuillez sélectionner votre devise');
        }
        break;
      }

      case 5: { // Résumé
        // Vérifier que toutes les données sont présentes
        const requiredFields = [
          'experience_level',
          'business_type', 
          'sector',
          'country_code',
          'currency_code'
        ];
        
        const missingFields = requiredFields.filter(field => !onboardingData[field as keyof OnboardingData]);
        
        if (missingFields.length > 0) {
          errors.push('Certaines informations sont manquantes. Veuillez revenir aux étapes précédentes.');
        }
        break;
      }
    }

    // Validations croisées
    if (onboardingData.business_type === 'physical_products' && !onboardingData.sector) {
      warnings.push('Pour les produits physiques, nous recommandons de sélectionner un secteur spécifique');
    }

    if (onboardingData.experience_level === 'beginner' && onboardingData.business_type === 'mixed') {
      warnings.push('Les boutiques mixtes peuvent être complexes pour les débutants. Nous vous recommandons de commencer simple.');
    }

    // Vérifications de cohérence géographique
    if (onboardingData.country_code && onboardingData.currency_code) {
      const cfaCountries = ['ML', 'CI', 'SN', 'BF', 'TG', 'BJ', 'NE', 'GW'];
      const isCfaCountry = cfaCountries.includes(onboardingData.country_code);
      
      if (isCfaCountry && onboardingData.currency_code !== 'CFA') {
        warnings.push('La devise CFA est généralement recommandée pour votre région');
      }
      
      if (!isCfaCountry && onboardingData.currency_code === 'CFA') {
        warnings.push('La devise CFA n\'est pas standard pour votre région');
      }
    }

    const isValid = errors.length === 0;
    const canProceed = isValid && currentStep <= 5;

    return {
      isValid,
      errors,
      warnings,
      canProceed
    };
  }, [currentStep, onboardingData]);

  return validation;
};
