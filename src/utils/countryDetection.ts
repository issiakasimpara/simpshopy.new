/**
 * Système de détection de pays intelligent et robuste
 */

import { isolatedStorage, isUserStorefront } from './isolatedStorage';

// Liste des pays africains francophones supportés
export const SUPPORTED_COUNTRIES = {
  'ML': { name: 'Mali', currency: 'XOF', flag: '🇲🇱' },
  'SN': { name: 'Sénégal', currency: 'XOF', flag: '🇸🇳' },
  'BF': { name: 'Burkina Faso', currency: 'XOF', flag: '🇧🇫' },
  'CI': { name: 'Côte d\'Ivoire', currency: 'XOF', flag: '🇨🇮' },
  'NE': { name: 'Niger', currency: 'XOF', flag: '🇳🇪' },
  'TG': { name: 'Togo', currency: 'XOF', flag: '🇹🇬' },
  'BJ': { name: 'Bénin', currency: 'XOF', flag: '🇧🇯' },
  'GN': { name: 'Guinée', currency: 'GNF', flag: '🇬🇳' },
  'CM': { name: 'Cameroun', currency: 'XAF', flag: '🇨🇲' },
  'TD': { name: 'Tchad', currency: 'XAF', flag: '🇹🇩' },
  'CF': { name: 'République Centrafricaine', currency: 'XAF', flag: '🇨🇫' },
  'GA': { name: 'Gabon', currency: 'XAF', flag: '🇬🇦' },
  'CG': { name: 'Congo', currency: 'XAF', flag: '🇨🇬' },
  'CD': { name: 'République Démocratique du Congo', currency: 'CDF', flag: '🇨🇩' },
  'MG': { name: 'Madagascar', currency: 'MGA', flag: '🇲🇬' },
  'DZ': { name: 'Algérie', currency: 'DZD', flag: '🇩🇿' },
  'MA': { name: 'Maroc', currency: 'MAD', flag: '🇲🇦' },
  'TN': { name: 'Tunisie', currency: 'TND', flag: '🇹🇳' }
};

export type CountryCode = keyof typeof SUPPORTED_COUNTRIES;

/**
 * Détecter le pays de l'utilisateur avec plusieurs méthodes de fallback
 */
export const detectUserCountry = async (): Promise<CountryCode> => {
  console.log('🌍 Détection du pays utilisateur...');

  // Méthode 1: Vérifier le stockage isolé (cache)
  const cachedCountry = isolatedStorage.getItem('user_country') as CountryCode;
  if (cachedCountry && SUPPORTED_COUNTRIES[cachedCountry]) {
    console.log('✅ Pays trouvé en cache:', SUPPORTED_COUNTRIES[cachedCountry].name);
    return cachedCountry;
  }

  // Méthode 2: Détecter via la langue du navigateur
  const browserCountry = detectCountryFromBrowser();
  if (browserCountry) {
    console.log('✅ Pays détecté via navigateur:', SUPPORTED_COUNTRIES[browserCountry].name);
    isolatedStorage.setItem('user_country', browserCountry);
    return browserCountry;
  }

  // Méthode 3: Détecter via timezone
  const timezoneCountry = detectCountryFromTimezone();
  if (timezoneCountry) {
    console.log('✅ Pays détecté via timezone:', SUPPORTED_COUNTRIES[timezoneCountry].name);
    isolatedStorage.setItem('user_country', timezoneCountry);
    return timezoneCountry;
  }

  // Méthode 4: API de géolocalisation (avec gestion d'erreurs)
  try {
    const apiCountry = await detectCountryFromAPI();
    if (apiCountry) {
      console.log('✅ Pays détecté via API:', SUPPORTED_COUNTRIES[apiCountry].name);
      isolatedStorage.setItem('user_country', apiCountry);
      return apiCountry;
    }
  } catch (error) {
    console.warn('⚠️ API géolocalisation échouée:', error);
  }

  // Fallback: Mali par défaut
  console.log('🇲🇱 Fallback: Mali par défaut');
  isolatedStorage.setItem('user_country', 'ML');
  return 'ML';
};

/**
 * Détecter le pays via la langue du navigateur
 */
const detectCountryFromBrowser = (): CountryCode | null => {
  try {
    const language = navigator.language || navigator.languages?.[0];
    if (!language) return null;

    // Extraire le code pays de la locale (ex: fr-ML -> ML)
    const countryCode = language.split('-')[1]?.toUpperCase() as CountryCode;
    
    if (countryCode && SUPPORTED_COUNTRIES[countryCode]) {
      return countryCode;
    }

    // Mapping des langues vers pays probables
    const languageMapping: Record<string, CountryCode> = {
      'fr': 'ML', // Français -> Mali par défaut
      'ar': 'DZ', // Arabe -> Algérie
      'en': 'ML'  // Anglais -> Mali par défaut
    };

    const lang = language.split('-')[0].toLowerCase();
    return languageMapping[lang] || null;
  } catch (error) {
    console.warn('⚠️ Erreur détection navigateur:', error);
    return null;
  }
};

/**
 * Détecter le pays via la timezone
 */
const detectCountryFromTimezone = (): CountryCode | null => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Mapping des timezones vers pays
    const timezoneMapping: Record<string, CountryCode> = {
      'Africa/Bamako': 'ML',
      'Africa/Dakar': 'SN',
      'Africa/Ouagadougou': 'BF',
      'Africa/Abidjan': 'CI',
      'Africa/Niamey': 'NE',
      'Africa/Lome': 'TG',
      'Africa/Porto-Novo': 'BJ',
      'Africa/Conakry': 'GN',
      'Africa/Douala': 'CM',
      'Africa/Ndjamena': 'TD',
      'Africa/Bangui': 'CF',
      'Africa/Libreville': 'GA',
      'Africa/Brazzaville': 'CG',
      'Africa/Kinshasa': 'CD',
      'Indian/Antananarivo': 'MG',
      'Africa/Algiers': 'DZ',
      'Africa/Casablanca': 'MA',
      'Africa/Tunis': 'TN'
    };

    return timezoneMapping[timezone] || null;
  } catch (error) {
    console.warn('⚠️ Erreur détection timezone:', error);
    return null;
  }
};

/**
 * Détecter le pays via API (avec fallbacks multiples)
 */
const detectCountryFromAPI = async (): Promise<CountryCode | null> => {
  const apis = [
    // API 1: ipapi.co (avec proxy)
    async () => {
      const response = await fetch('https://ipapi.co/json/', {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      const data = await response.json();
      return data.country_code?.toUpperCase() as CountryCode;
    },
    
    // API 2: ip-api.com
    async () => {
      const response = await fetch('http://ip-api.com/json/?fields=countryCode');
      const data = await response.json();
      return data.countryCode?.toUpperCase() as CountryCode;
    },
    
    // API 3: ipinfo.io
    async () => {
      const response = await fetch('https://ipinfo.io/json');
      const data = await response.json();
      return data.country?.toUpperCase() as CountryCode;
    }
  ];

  for (const api of apis) {
    try {
      const countryCode = await api();
      if (countryCode && SUPPORTED_COUNTRIES[countryCode]) {
        return countryCode;
      }
    } catch (error) {
      console.warn('⚠️ API échouée, essai suivant...', error);
      continue;
    }
  }

  return null;
};

/**
 * Permettre à l'utilisateur de changer manuellement son pays
 */
export const setUserCountry = (countryCode: CountryCode): void => {
  if (SUPPORTED_COUNTRIES[countryCode]) {
    isolatedStorage.setItem('user_country', countryCode);
    console.log('✅ Pays défini manuellement:', SUPPORTED_COUNTRIES[countryCode].name);
  }
};

/**
 * Obtenir les informations du pays actuel
 */
export const getCurrentCountryInfo = () => {
  const countryCode = (isolatedStorage.getItem('user_country') as CountryCode) || 'ML';
  return {
    code: countryCode,
    info: SUPPORTED_COUNTRIES[countryCode]
  };
};

/**
 * Vérifier si un pays est supporté
 */
export const isCountrySupported = (countryCode: string): countryCode is CountryCode => {
  return countryCode.toUpperCase() in SUPPORTED_COUNTRIES;
};

/**
 * Obtenir la liste de tous les pays supportés
 */
export const getAllSupportedCountries = () => {
  return Object.entries(SUPPORTED_COUNTRIES).map(([code, info]) => ({
    code: code as CountryCode,
    ...info
  }));
};
