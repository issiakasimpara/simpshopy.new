import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, Lightbulb, Globe, CreditCard } from 'lucide-react';
import { useOnboarding } from '@/hooks/useOnboarding';
import type { SupportedCountry, CountryCurrency } from '@/types/onboarding';

interface LocationSetupStepProps {
  selectedCountry?: string;
  selectedCurrency?: string;
  onCountrySelect: (countryCode: string) => void;
  onCurrencySelect: (currencyCode: string) => void;
}

const LocationSetupStep: React.FC<LocationSetupStepProps> = ({
  selectedCountry,
  selectedCurrency,
  onCountrySelect,
  onCurrencySelect,
}) => {
  const { countries, currencies, getCurrenciesForCountry } = useOnboarding();
  const [availableCurrencies, setAvailableCurrencies] = useState<CountryCurrency[]>([]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [isLoadingCurrencies, setIsLoadingCurrencies] = useState(false);

  // Charger les devises disponibles quand le pays change
  useEffect(() => {
    if (selectedCountry) {
      loadCurrenciesForCountry(selectedCountry);
    }
  }, [selectedCountry]);

  const loadCurrenciesForCountry = async (countryCode: string) => {
    setIsLoadingCurrencies(true);
    try {
      const currencies = await getCurrenciesForCountry(countryCode);
      setAvailableCurrencies(currencies);
      
      // Sélectionner automatiquement la devise principale si aucune devise n'est sélectionnée
      if (!selectedCurrency) {
        const primaryCurrency = currencies.find(c => c.is_primary);
        if (primaryCurrency) {
          onCurrencySelect(primaryCurrency.currency_code);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des devises:', error);
    } finally {
      setIsLoadingCurrencies(false);
    }
  };

  const selectedCountryData = countries?.find(c => c.code === selectedCountry);
  const selectedCurrencyData = currencies?.find(c => c.code === selectedCurrency);

  const handleCountrySelect = (countryCode: string) => {
    onCountrySelect(countryCode);
    setShowCountryDropdown(false);
    // Réinitialiser la devise sélectionnée quand le pays change
    onCurrencySelect('');
  };

  const handleCurrencySelect = (currencyCode: string) => {
    onCurrencySelect(currencyCode);
    setShowCurrencyDropdown(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Globe className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Configuration géographique
        </h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Configurons l'emplacement et la devise par défaut de votre boutique. 
          Ne vous inquiétez pas - vos clients peuvent payer de n'importe où !
        </p>
      </div>

      {/* Sélection du pays */}
      <div className="space-y-3">
        <label className="flex text-sm font-medium text-gray-700 items-center gap-2">
          <Globe className="w-4 h-4" />
          Votre emplacement
        </label>
        <div className="relative">
          <Button
            variant="outline"
            className={`w-full justify-between h-14 text-left transition-all duration-200 ${
              selectedCountry 
                ? 'border-green-500 bg-green-50 hover:bg-green-100' 
                : 'hover:border-blue-300'
            }`}
            onClick={() => setShowCountryDropdown(!showCountryDropdown)}
          >
            <div className="flex items-center gap-3">
              {selectedCountryData ? (
                <>
                  <span className="text-2xl">{selectedCountryData.flag_emoji}</span>
                  <div className="text-left">
                    <div className="font-medium">{selectedCountryData.name}</div>
                    <div className="text-sm text-gray-500">Pays sélectionné</div>
                  </div>
                </>
              ) : (
                <span className="text-gray-500">Sélectionnez votre pays</span>
              )}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
              showCountryDropdown ? 'rotate-180' : ''
            }`} />
          </Button>

          {showCountryDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-auto animate-in slide-in-from-top-2 duration-200">
              {countries?.map((country) => (
                <button
                  key={country.code}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center gap-3 transition-colors duration-150"
                  onClick={() => handleCountrySelect(country.code)}
                >
                  <span className="text-2xl">{country.flag_emoji}</span>
                  <div>
                    <div className="font-medium">{country.name}</div>
                    <div className="text-sm text-gray-500">Devise: {country.default_currency}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sélection de la devise */}
      <div className="space-y-3">
        <label className="flex text-sm font-medium text-gray-700 items-center gap-2">
          <CreditCard className="w-4 h-4" />
          Devise principale de la boutique
        </label>
        <div className="relative">
          <Button
            variant="outline"
            className={`w-full justify-between h-14 text-left transition-all duration-200 ${
              selectedCurrency 
                ? 'border-green-500 bg-green-50 hover:bg-green-100' 
                : 'hover:border-blue-300'
            }`}
            onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
            disabled={!selectedCountry || isLoadingCurrencies}
          >
            <div className="flex items-center gap-3">
              {isLoadingCurrencies ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span>Chargement des devises...</span>
                </>
              ) : selectedCurrencyData ? (
                <>
                  <span className="text-2xl">💰</span>
                  <div className="text-left">
                    <div className="font-medium">{selectedCurrencyData.name}</div>
                    <div className="text-sm text-gray-500">{selectedCurrencyData.symbol}</div>
                  </div>
                </>
              ) : (
                <span className="text-gray-500">
                  {selectedCountry ? 'Sélectionnez votre devise' : 'Sélectionnez d\'abord votre pays'}
                </span>
              )}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
              showCurrencyDropdown ? 'rotate-180' : ''
            }`} />
          </Button>

          {showCurrencyDropdown && selectedCountry && !isLoadingCurrencies && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-auto animate-in slide-in-from-top-2 duration-200">
              {availableCurrencies.map((countryCurrency) => {
                const currency = currencies?.find(c => c.code === countryCurrency.currency_code);
                if (!currency) return null;

                return (
                  <button
                    key={countryCurrency.currency_code}
                    className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center justify-between transition-colors duration-150"
                    onClick={() => handleCurrencySelect(countryCurrency.currency_code)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💰</span>
                      <div>
                        <div className="font-medium">{currency.name}</div>
                        <div className="text-sm text-gray-500">{currency.symbol}</div>
                      </div>
                    </div>
                    {countryCurrency.is_primary && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                        Principal
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Information avec design amélioré */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Lightbulb className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-sm">
              <p className="font-semibold text-blue-900 mb-2">💡 Conseils pour votre boutique</p>
              <div className="space-y-2 text-blue-800">
                <p>• Définissez votre devise principale pour la tarification</p>
                <p>• Nous gérerons les conversions automatiques</p>
                <p>• Vos clients peuvent payer dans leur devise locale</p>
                <p>• Vous recevrez les paiements dans la devise de votre boutique</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Indicateur de progression */}
      <div className="flex justify-center pt-4">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default LocationSetupStep;
