import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Cookie, X, Settings, CheckCircle, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCookieConsent, type CookiePreferences } from '@/hooks/useCookieConsent';

const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [localPreferences, setLocalPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
    preferences: false
  });
  const { preferences, hasConsented, acceptAll, acceptEssential, savePreferences } = useCookieConsent();

  useEffect(() => {
    // Afficher la bannière si pas de consentement
    if (!hasConsented) {
      setShowBanner(true);
    } else {
      setShowBanner(false);
    }
    // Synchroniser les préférences locales avec celles du hook
    setLocalPreferences(preferences);
  }, [hasConsented, preferences]);

  const handleAcceptAll = () => {
    acceptAll();
    setShowBanner(false);
  };

  const handleAcceptEssential = () => {
    acceptEssential();
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    savePreferences(localPreferences);
    setShowSettings(false);
    setShowBanner(false);
  };

  const handlePreferenceChange = (key: keyof CookiePreferences, value: boolean) => {
    if (key === 'essential') return; // Ne peut pas être désactivé
    // Mettre à jour les préférences localement pour l'interface
    setLocalPreferences(prev => ({ ...prev, [key]: value }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Bannière discrète en bas à gauche */}
      <div className="fixed bottom-4 left-4 z-50 max-w-sm">
        <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl">
          <CardContent className="p-4">
            {/* Version compacte */}
            {!isExpanded && (
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <Cookie className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Cookies
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    Nous utilisons des cookies pour améliorer votre expérience
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    onClick={() => setIsExpanded(true)}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={handleAcceptEssential}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Version étendue */}
            {isExpanded && (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <Cookie className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                      Nous utilisons des <span className="text-blue-600">cookies</span>
                    </h3>
                    <p className="text-xs text-gray-600 mb-3">
                      pour améliorer votre expérience sur notre site. Nous utilisons des cookies essentiels pour le fonctionnement du site et des cookies optionnels pour l'analyse et le marketing.
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsExpanded(false)}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    onClick={handleAcceptAll}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
                  >
                    Accepter tous
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleAcceptEssential}
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs h-8 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Essentiels
                    </Button>
                    <Button
                      onClick={() => setShowSettings(true)}
                      variant="ghost"
                      size="sm"
                      className="text-xs h-8 text-gray-600 hover:text-gray-800"
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Plus
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal des paramètres */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Paramètres des cookies
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-4">
              {/* Cookies essentiels */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    Cookies essentiels
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Nécessaires au fonctionnement du site (authentification, panier, etc.)
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localPreferences.essential}
                    disabled
                    className="rounded border-gray-300"
                  />
                </div>
              </div>

              {/* Cookies analytics */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold">Cookies d'analyse</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Nous aident à comprendre comment vous utilisez notre site
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localPreferences.analytics}
                    onChange={(e) => handlePreferenceChange('analytics', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </div>
              </div>

              {/* Cookies marketing */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold">Cookies marketing</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Utilisés pour vous proposer des contenus personnalisés
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localPreferences.marketing}
                    onChange={(e) => handlePreferenceChange('marketing', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </div>
              </div>

              {/* Cookies de préférences */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold">Cookies de préférences</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Mémorisent vos choix (langue, devise, etc.)
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localPreferences.preferences}
                    onChange={(e) => handlePreferenceChange('preferences', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <Button 
                onClick={() => {
                  // Reset pour les tests
                  localStorage.removeItem('cookie_consent');
                  localStorage.removeItem('cookie_consent_date');
                  window.location.reload();
                }}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Reset (Test)
              </Button>
              
              <div className="flex gap-3">
                <Button 
                  onClick={() => setShowSettings(false)}
                  variant="outline"
                >
                  Annuler
                </Button>
                <Button 
                  onClick={handleSavePreferences}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Sauvegarder
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CookieConsent;
