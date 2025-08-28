import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Settings, Globe, Store, Palette, Sparkles } from 'lucide-react';
import { EXPERIENCE_LEVEL_OPTIONS, BUSINESS_TYPE_OPTIONS, SECTOR_OPTIONS, THEME_OPTIONS } from '@/types/onboarding';
import { StoreTemplateService, type StoreTemplate } from '@/services/storeTemplateService';

interface SummaryStepProps {
  onboardingData: {
    experience_level?: string;
    business_type?: string;
    sector?: string;
    country_code?: string;
    currency_code?: string;
    theme_preference?: string;
  };
  onValidate: () => void;
  onStartFromZero: () => void;
  isLoading?: boolean;
}

const SummaryStep: React.FC<SummaryStepProps> = ({
  onboardingData,
  onValidate,
  onStartFromZero,
  isLoading = false
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<StoreTemplate | null>(null);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);

  // Charger le template approprié basé sur le secteur
  useEffect(() => {
    const loadTemplate = async () => {
      if (onboardingData.sector) {
        setIsLoadingTemplate(true);
        try {
          const template = await StoreTemplateService.getTemplateForSector(onboardingData.sector);
          setSelectedTemplate(template);
        } catch (error) {
          console.error('Erreur lors du chargement du template:', error);
        } finally {
          setIsLoadingTemplate(false);
        }
      }
    };

    loadTemplate();
  }, [onboardingData.sector]);

  const getOptionLabel = (type: string, options: any[]) => {
    const option = options.find(opt => opt.id === type);
    return option ? option.title : type;
  };

  const getCountryName = (code: string) => {
    const countries: { [key: string]: string } = {
      'ML': 'Mali',
      'CI': 'Côte d\'Ivoire',
      'SN': 'Sénégal',
      'BF': 'Burkina Faso',
      'TG': 'Togo',
      'BJ': 'Bénin',
      'NE': 'Niger',
      'GW': 'Guinée-Bissau'
    };
    return countries[code] || code;
  };

  const getCurrencyName = (code: string) => {
    const currencies: { [key: string]: string } = {
      'CFA': 'Franc CFA',
      'EUR': 'Euro',
      'USD': 'Dollar US',
      'GBP': 'Livre Sterling'
    };
    return currencies[code] || code;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Résumé de votre configuration
        </h2>
        <p className="text-gray-600">
          Vérifiez vos choix avant de créer votre boutique
        </p>
      </div>

      {/* Résumé des choix */}
      <div className="grid gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Store className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold">Configuration de la boutique</h3>
            </div>
            
            <div className="grid gap-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Expérience :</span>
                <span className="font-medium">
                  {getOptionLabel(onboardingData.experience_level || '', EXPERIENCE_LEVEL_OPTIONS)}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Type de business :</span>
                <span className="font-medium">
                  {getOptionLabel(onboardingData.business_type || '', BUSINESS_TYPE_OPTIONS)}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Secteur :</span>
                <span className="font-medium">
                  {onboardingData.sector ? getOptionLabel(onboardingData.sector, SECTOR_OPTIONS) : 'Non spécifié'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Globe className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold">Configuration géographique</h3>
            </div>
            
            <div className="grid gap-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Pays :</span>
                <span className="font-medium">
                  {getCountryName(onboardingData.country_code || '')}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Devise :</span>
                <span className="font-medium">
                  {getCurrencyName(onboardingData.currency_code || '')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

                            <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-purple-600" />
                          </div>
                          <h3 className="text-lg font-semibold">Template de Boutique</h3>
                        </div>
                        
                        {isLoadingTemplate ? (
                          <div className="flex items-center gap-3 p-4">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                            <span className="text-gray-600">Chargement du template...</span>
                          </div>
                        ) : selectedTemplate ? (
                          <div className="space-y-4">
                            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <Sparkles className="w-4 h-4 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-purple-900 mb-1">
                                    {selectedTemplate.name}
                                  </h4>
                                  <p className="text-sm text-purple-700 mb-3">
                                    {selectedTemplate.description}
                                  </p>
                                  
                                  <div className="grid grid-cols-2 gap-2 text-xs">
                                    {selectedTemplate.features.slice(0, 4).map((feature, index) => (
                                      <div key={index} className="flex items-center gap-1">
                                        <Check className="w-3 h-3 text-green-600" />
                                        <span className="text-gray-700">{feature}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {selectedTemplate.default_products && selectedTemplate.default_products.length > 0 && (
                              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                <p className="text-xs font-medium text-gray-700 mb-2">
                                  Produits d'exemple inclus :
                                </p>
                                <div className="space-y-1">
                                  {selectedTemplate.default_products.slice(0, 2).map((product, index) => (
                                    <div key={index} className="flex justify-between text-xs">
                                      <span className="text-gray-600">{product.name}</span>
                                      <span className="font-medium">{product.price}€</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <Settings className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-medium text-yellow-900 mb-1">
                                  Template standard
                                </p>
                                <p className="text-sm text-yellow-700">
                                  {onboardingData.sector === 'other' || !onboardingData.sector 
                                    ? 'Un template aléatoire sera utilisé pour votre boutique.'
                                    : 'Aucun template spécifique trouvé, un template standard sera utilisé.'
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <Button
          variant="outline"
          onClick={onStartFromZero}
          className="flex-1"
          disabled={isLoading}
        >
          <Settings className="w-4 h-4 mr-2" />
          Commencer à partir de zéro
        </Button>
        
        <Button
          onClick={onValidate}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Création...
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-2" />
              Valider et créer ma boutique
            </>
          )}
        </Button>
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>
          Vous pourrez toujours modifier ces paramètres plus tard dans les paramètres de votre boutique.
        </p>
      </div>
    </div>
  );
};

export default SummaryStep;
