import { useState, useEffect, useCallback } from 'react';
import { isolatedStorage, isUserStorefront } from '@/utils/isolatedStorage';

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export const useCookieConsent = () => {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
    preferences: false
  });

  const [hasConsented, setHasConsented] = useState<boolean>(false);

  // Charger les préférences au démarrage
  useEffect(() => {
    // Si on est sur une boutique publique d'utilisateur, ne pas gérer les cookies
    if (isUserStorefront()) {
      setHasConsented(true); // Simuler un consentement pour éviter l'affichage
      return;
    }

    const savedConsent = isolatedStorage.getItem('cookie_consent');
    const consentDate = isolatedStorage.getItem('cookie_consent_date');
    
    if (savedConsent && consentDate) {
      // Vérifier si le consentement a moins de 12 mois
      const consentTime = new Date(consentDate).getTime();
      const now = new Date().getTime();
      const twelveMonths = 12 * 30 * 24 * 60 * 60 * 1000; // 12 mois en millisecondes
      
      if (now - consentTime < twelveMonths) {
        // Le consentement est encore valide
        const savedPreferences = JSON.parse(savedConsent);
        setPreferences(savedPreferences);
        setHasConsented(true);
      }
    }
  }, []);

  // Appliquer les préférences de cookies
  const applyCookiePreferences = useCallback((prefs: CookiePreferences) => {
    // Si on est sur une boutique publique d'utilisateur, ne pas appliquer les cookies
    if (isUserStorefront()) {
      return;
    }

    // Cookies essentiels (toujours activés)
    if (prefs.essential) {
      // Ces cookies sont nécessaires au fonctionnement
      document.cookie = 'essential=true; path=/; max-age=31536000; SameSite=Strict';
    }

    // Cookies analytics
    if (prefs.analytics) {
      // Activer Google Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('consent', 'update', {
          analytics_storage: 'granted'
        });
      }
    } else {
      // Désactiver Google Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('consent', 'update', {
          analytics_storage: 'denied'
        });
      }
    }

    // Cookies marketing
    if (prefs.marketing) {
      // Activer les cookies marketing
      document.cookie = 'marketing=true; path=/; max-age=31536000; SameSite=Lax';
    } else {
      // Supprimer les cookies marketing
      document.cookie = 'marketing=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }

    // Cookies de préférences
    if (prefs.preferences) {
      // Activer les cookies de préférences
      document.cookie = 'preferences=true; path=/; max-age=31536000; SameSite=Lax';
    } else {
      // Supprimer les cookies de préférences
      document.cookie = 'preferences=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }

    // Sauvegarder les préférences avec le stockage isolé
    isolatedStorage.setItem('cookie_consent', JSON.stringify(prefs));
    isolatedStorage.setItem('cookie_consent_date', new Date().toISOString());
  }, []);

  // Accepter tous les cookies
  const acceptAll = useCallback(() => {
    // Si on est sur une boutique publique d'utilisateur, ne rien faire
    if (isUserStorefront()) {
      return;
    }

    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    setPreferences(allAccepted);
    setHasConsented(true);
    applyCookiePreferences(allAccepted);
  }, [applyCookiePreferences]);

  // Accepter seulement les cookies essentiels
  const acceptEssential = useCallback(() => {
    // Si on est sur une boutique publique d'utilisateur, ne rien faire
    if (isUserStorefront()) {
      return;
    }

    const essentialOnly = {
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false
    };
    setPreferences(essentialOnly);
    setHasConsented(true);
    applyCookiePreferences(essentialOnly);
  }, [applyCookiePreferences]);

  // Sauvegarder les préférences personnalisées
  const savePreferences = useCallback((prefs: CookiePreferences) => {
    // Si on est sur une boutique publique d'utilisateur, ne rien faire
    if (isUserStorefront()) {
      return;
    }

    setPreferences(prefs);
    setHasConsented(true);
    applyCookiePreferences(prefs);
  }, [applyCookiePreferences]);

  return {
    preferences,
    hasConsented,
    acceptAll,
    acceptEssential,
    savePreferences
  };
};
