/**
 * Système de stockage isolé pour séparer les données Simpshopy des boutiques publiques
 */

// Préfixes pour isoler les données
const SIMPSHOPY_PREFIX = 'simpshopy_';
const STOREFRONT_PREFIX = 'storefront_';

/**
 * Déterminer si nous sommes sur une boutique publique d'utilisateur
 */
export const isUserStorefront = (): boolean => {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;

  // Si on est sur localhost, toujours considérer comme Simpshopy (développement)
  if (hostname === 'localhost' || hostname.includes('localhost')) {
    return false;
  }

  // Si on est sur admin.simpshopy.com, c'est Simpshopy
  if (hostname === 'admin.simpshopy.com') {
    return false;
  }

  // Si on est sur simpshopy.com, vérifier le path
  if (hostname === 'simpshopy.com' || hostname === 'www.simpshopy.com') {
    // Si c'est une boutique publique (/store/...), c'est une boutique utilisateur
    if (pathname.startsWith('/store/')) {
      return true;
    }
    return false; // Pages Simpshopy
  }

  // Pour tous les autres domaines (sous-domaines, domaines personnalisés)
  // Ce sont des boutiques publiques d'utilisateurs
  return true;
};

/**
 * Obtenir le préfixe approprié selon le contexte
 */
export const getStoragePrefix = (): string => {
  return isUserStorefront() ? STOREFRONT_PREFIX : SIMPSHOPY_PREFIX;
};

/**
 * Classe pour gérer le stockage isolé
 */
class IsolatedStorage {
  private prefix: string;

  constructor() {
    this.prefix = getStoragePrefix();
  }

  /**
   * Générer une clé avec le préfixe approprié
   */
  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * Stocker une valeur
   */
  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(this.getKey(key), value);
    } catch (error) {
      console.warn('Erreur lors du stockage:', error);
    }
  }

  /**
   * Récupérer une valeur
   */
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(this.getKey(key));
    } catch (error) {
      console.warn('Erreur lors de la récupération:', error);
      return null;
    }
  }

  /**
   * Supprimer une valeur
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(this.getKey(key));
    } catch (error) {
      console.warn('Erreur lors de la suppression:', error);
    }
  }

  /**
   * Vérifier si une clé existe
   */
  hasItem(key: string): boolean {
    return this.getItem(key) !== null;
  }

  /**
   * Nettoyer toutes les données du contexte actuel
   */
  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Erreur lors du nettoyage:', error);
    }
  }

  /**
   * Obtenir toutes les clés du contexte actuel
   */
  getKeys(): string[] {
    try {
      const keys = Object.keys(localStorage);
      return keys
        .filter(key => key.startsWith(this.prefix))
        .map(key => key.replace(this.prefix, ''));
    } catch (error) {
      console.warn('Erreur lors de la récupération des clés:', error);
      return [];
    }
  }
}

// Instance globale
export const isolatedStorage = new IsolatedStorage();

/**
 * Hook pour utiliser le stockage isolé
 */
export const useIsolatedStorage = () => {
  return isolatedStorage;
};

/**
 * Fonctions utilitaires pour les cas d'usage courants
 */

// Gestion du panier isolé
export const getIsolatedCartKey = (storeId: string): string => {
  return `cart_${storeId}`;
};

// Gestion des préférences utilisateur isolées
export const getIsolatedUserPrefsKey = (): string => {
  return 'user_preferences';
};

// Gestion de la session isolée
export const getIsolatedSessionKey = (): string => {
  return 'session_data';
};

/**
 * Migration des données existantes (optionnel)
 */
export const migrateExistingData = (): void => {
  if (isUserStorefront()) {
    // Sur une boutique publique, migrer les données non préfixées vers le préfixe storefront
    const keysToMigrate = [
      'cart_session_id',
      'cart_store_id',
      'user_country',
      'cookie_consent',
      'cookie_consent_date'
    ];

    keysToMigrate.forEach(key => {
      const value = localStorage.getItem(key);
      if (value && !localStorage.getItem(`${STOREFRONT_PREFIX}${key}`)) {
        isolatedStorage.setItem(key, value);
        localStorage.removeItem(key); // Supprimer l'ancienne clé
      }
    });
  }
};
