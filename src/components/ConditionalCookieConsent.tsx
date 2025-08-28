import React from 'react';
import CookieConsent from './CookieConsent';

interface ConditionalCookieConsentProps {
  children?: React.ReactNode;
}

const ConditionalCookieConsent: React.FC<ConditionalCookieConsentProps> = ({ children }) => {
  // Déterminer si nous sommes sur une boutique publique d'utilisateur
  const isUserStorefront = (): boolean => {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;

    // Si on est sur localhost, toujours afficher les cookies (développement)
    if (hostname === 'localhost' || hostname.includes('localhost')) {
      return false; // Afficher les cookies en développement
    }

    // Si on est sur admin.simpshopy.com, afficher les cookies
    if (hostname === 'admin.simpshopy.com') {
      return false; // Afficher les cookies sur l'admin
    }

    // Si on est sur simpshopy.com, afficher les cookies
    if (hostname === 'simpshopy.com' || hostname === 'www.simpshopy.com') {
      // Vérifier si c'est une boutique publique (/store/...)
      if (pathname.startsWith('/store/')) {
        return true; // Ne pas afficher les cookies sur les boutiques publiques
      }
      return false; // Afficher les cookies sur les pages Simpshopy
    }

    // Pour tous les autres domaines (sous-domaines, domaines personnalisés)
    // Ne pas afficher les cookies car ce sont des boutiques publiques
    return true;
  };

  // Si c'est une boutique publique d'utilisateur, ne pas afficher les cookies
  if (isUserStorefront()) {
    return null;
  }

  // Sinon, afficher le composant CookieConsent normal
  return <CookieConsent />;
};

export default ConditionalCookieConsent;
