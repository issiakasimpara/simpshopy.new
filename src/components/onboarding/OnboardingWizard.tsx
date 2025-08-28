import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useStores } from '@/hooks/useStores';
import { useAuth } from '@/hooks/useAuth';
import { ONBOARDING_STEPS } from '@/types/onboarding';
import { StoreTemplateService } from '@/services/storeTemplateService';
import ExperienceLevelStep from './steps/ExperienceLevelStep';
import BusinessTypeStep from './steps/BusinessTypeStep';
import SectorStep from './steps/SectorStep';
import LocationSetupStep from './steps/LocationSetupStep';
import SummaryStep from './steps/SummaryStep';
import AppLogo from '@/components/ui/AppLogo';

const OnboardingWizard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    currentStep,
    onboardingData,
    isOnboardingCompleted,
    shouldShowOnboarding,
    isLoading,
    isSaving,
    isCompleting,
    saveStep,
    nextStep,
    previousStep,
    completeOnboarding,
    initializeStoreCurrency,
  } = useOnboarding();

  // Vérifier si l'utilisateur a un store
  const { store, createStore } = useStores();

  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState(onboardingData.experience_level);
  const [selectedBusinessType, setSelectedBusinessType] = useState(onboardingData.business_type);
  const [selectedSector, setSelectedSector] = useState(onboardingData.sector);
  const [selectedCountry, setSelectedCountry] = useState(onboardingData.country_code);
  const [selectedCurrency, setSelectedCurrency] = useState(onboardingData.currency_code);

  // Synchroniser l'état local avec les données d'onboarding
  useEffect(() => {
    setSelectedExperienceLevel(onboardingData.experience_level);
    setSelectedBusinessType(onboardingData.business_type);
    setSelectedSector(onboardingData.sector);
    setSelectedCountry(onboardingData.country_code);
    setSelectedCurrency(onboardingData.currency_code);
  }, [onboardingData]);

  // Rediriger si l'onboarding est déjà terminé
  useEffect(() => {
    if (isOnboardingCompleted) {
      navigate('/dashboard');
    }
  }, [isOnboardingCompleted, navigate]);

  // Rediriger si l'utilisateur n'est pas connecté
  if (!shouldShowOnboarding) {
    return null;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre configuration...</p>
        </div>
      </div>
    );
  }

  const handleNext = async () => {
    console.log('🔄 handleNext appelé - Étape actuelle:', currentStep);
    console.log('📊 Données sélectionnées:', {
      selectedExperienceLevel,
      selectedBusinessType,
      selectedSector,
      selectedCountry,
      selectedCurrency
    });

    try {
      if (currentStep === 1 && selectedExperienceLevel) {
        console.log('💾 Sauvegarde de l\'expérience:', selectedExperienceLevel);
        const saved = await saveStep({ experience_level: selectedExperienceLevel });
        console.log('✅ Sauvegarde réussie:', saved);
        if (saved) {
          console.log('➡️ Passage à l\'étape suivante');
          const nextStepResult = await nextStep();
          console.log('✅ nextStep résultat:', nextStepResult);
        }
      } else if (currentStep === 2 && selectedBusinessType) {
        console.log('💾 Sauvegarde du type de business:', selectedBusinessType);
        const saved = await saveStep({ business_type: selectedBusinessType });
        console.log('✅ Sauvegarde réussie:', saved);
        if (saved) {
          console.log('➡️ Passage à l\'étape suivante');
          const nextStepResult = await nextStep();
          console.log('✅ nextStep résultat:', nextStepResult);
        }
      } else if (currentStep === 3 && selectedSector) {
        console.log('💾 Sauvegarde du secteur:', selectedSector);
        const saved = await saveStep({ sector: selectedSector });
        console.log('✅ Sauvegarde réussie:', saved);
        if (saved) {
          console.log('➡️ Passage à l\'étape suivante');
          const nextStepResult = await nextStep();
          console.log('✅ nextStep résultat:', nextStepResult);
        }
      } else if (currentStep === 4 && selectedCountry && selectedCurrency) {
        console.log('💾 Sauvegarde de la localisation:', { selectedCountry, selectedCurrency });
        const saved = await saveStep({ 
          country_code: selectedCountry, 
          currency_code: selectedCurrency 
        });
        
        console.log('✅ Sauvegarde réussie:', saved);
        if (saved) {
          console.log('➡️ Passage à l\'étape suivante');
          const nextStepResult = await nextStep();
          console.log('✅ nextStep résultat:', nextStepResult);
        }
                                      } else if (currentStep === 5) {
                  // Étape finale - Création de la boutique avec template
                  console.log('🎉 Création de la boutique avec template basé sur le secteur');
                  
                  // Créer un store si l'utilisateur n'en a pas
                  if (!store) {
                    console.log('🏪 Création d\'un nouveau store avec template');
                    
                    // Générer un nom de store basé sur les données d'onboarding
                    const businessTypeNames = {
                      'digital_products': 'Boutique Digitale',
                      'online_services': 'Services en Ligne',
                      'physical_products': 'Boutique Physique',
                      'mixed': 'Boutique Mixte'
                    };
                    
                    const experienceNames = {
                      'beginner': 'Débutant',
                      'experienced': 'Expérimenté'
                    };
                    
                    const storeName = `${businessTypeNames[selectedBusinessType as keyof typeof businessTypeNames] || 'Ma Boutique'} - ${experienceNames[selectedExperienceLevel as keyof typeof experienceNames] || 'Nouveau'}`;
                    
                    // Créer la boutique avec le template approprié
                    const onboardingData = {
                      experience_level: selectedExperienceLevel,
                      business_type: selectedBusinessType,
                      sector: selectedSector,
                      country_code: selectedCountry,
                      currency_code: selectedCurrency
                    };
                    
                    const result = await StoreTemplateService.createStoreWithTemplate(
                      user?.id || '',
                      storeName,
                      selectedSector || 'other',
                      onboardingData
                    );
                    
                    if (result.success) {
                      console.log('✅ Boutique créée avec succès avec le template:', result.template?.name);
                      
                      // Initialiser la devise du store
                      if (selectedCurrency) {
                        console.log('💰 Initialisation de la devise du store avec:', selectedCurrency);
                        await initializeStoreCurrency(selectedCurrency, [selectedCountry]);
                      }
                    } else {
                      console.error('❌ Erreur lors de la création de la boutique avec template');
                      // Fallback : créer la boutique sans template
                      await createStore({
                        name: storeName,
                        description: `Boutique créée via l'onboarding - ${selectedBusinessType}`,
                        status: 'active',
                        settings: {
                          currency: selectedCurrency,
                          country: selectedCountry,
                          business_type: selectedBusinessType,
                          experience_level: selectedExperienceLevel,
                          sector: selectedSector
                        }
                      });
                    }
                  }
                  
                  console.log('🎉 Finalisation de l\'onboarding');
                  await completeOnboarding();
                  navigate('/dashboard');
      } else {
        console.log('❌ Conditions non remplies pour passer à l\'étape suivante');
      }
    } catch (error) {
      console.error('❌ Erreur dans handleNext:', error);
    }
  };

  const handlePrevious = async () => {
    await previousStep();
  };

  const handleStartFromZero = async () => {
    console.log('🚀 Démarrage à partir de zéro');
    // Sauvegarder seulement la devise et rediriger vers le dashboard
    if (selectedCurrency && selectedCountry) {
      await saveStep({ 
        country_code: selectedCountry, 
        currency_code: selectedCurrency 
      });
    }
    await completeOnboarding();
    navigate('/dashboard');
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!selectedExperienceLevel;
      case 2:
        return !!selectedBusinessType;
      case 3:
        return !!selectedSector;
      case 4:
        return !!selectedCountry && !!selectedCurrency;
      case 5:
        return true; // Toujours possible de procéder à l'étape finale
      default:
        return false;
    }
  };

  const getCurrentStepComponent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ExperienceLevelStep
            selectedLevel={selectedExperienceLevel}
            onSelect={setSelectedExperienceLevel}
          />
        );
      case 2:
        return (
          <BusinessTypeStep
            selectedType={selectedBusinessType}
            onSelect={setSelectedBusinessType}
          />
        );
      case 3:
        return (
          <SectorStep
            selectedSector={selectedSector}
            onSelect={setSelectedSector}
          />
        );
      case 4:
        return (
          <LocationSetupStep
            selectedCountry={selectedCountry}
            selectedCurrency={selectedCurrency}
            onCountrySelect={setSelectedCountry}
            onCurrencySelect={setSelectedCurrency}
          />
        );
      case 5:
        return (
          <SummaryStep
            onboardingData={{
              experience_level: selectedExperienceLevel,
              business_type: selectedBusinessType,
              sector: selectedSector,
              country_code: selectedCountry,
              currency_code: selectedCurrency
            }}
            onValidate={handleNext}
            onStartFromZero={handleStartFromZero}
            isLoading={isCompleting}
          />
        );
      default:
        return null;
    }
  };

  const currentStepConfig = ONBOARDING_STEPS.find(step => step.id === currentStep);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AppLogo />
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                Preview
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="flex items-center gap-2">
              {ONBOARDING_STEPS.map((step, index) => (
                <div
                  key={step.id}
                  className={`h-1 w-8 rounded-full transition-colors ${
                    step.id <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-8">
            {/* Step Title */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {currentStepConfig?.title}
              </h1>
              <p className="text-gray-600">
                {currentStepConfig?.description}
              </p>
            </div>

            {/* Step Content */}
            <div className="mb-8">
              {getCurrentStepComponent()}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1 || isSaving || isCompleting}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Précédent
              </Button>

              <div className="flex items-center gap-2">
                {currentStep === 5 ? (
                  <div className="hidden">
                    {/* Les boutons sont gérés par le composant SummaryStep */}
                  </div>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed() || isSaving}
                    className="flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Sauvegarde...
                      </>
                    ) : (
                      <>
                        Continuer
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default OnboardingWizard;
