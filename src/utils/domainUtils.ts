/**
 * Utilitaires pour la gestion des domaines Simpshopy
 * SYSTÈME TEMPORAIRE: Utilise des paths au lieu de sous-domaines
 */

// Configuration temporaire - à changer quand le domaine sera acheté
const getTempBaseDomain = () => {
  if (typeof window !== 'undefined') {
    return window.location.host;
  }
  return 'localhost:8081'; // Fallback pour le SSR
};

/**
 * Génère un path de boutique à partir du nom
 * TEMPORAIRE: Utilise un système de paths en attendant l'achat du domaine
 * @param storeName - Nom de la boutique
 * @returns Path au format /store/[nom-boutique]
 */
export function generateStorePath(storeName: string): string {
  if (!storeName) {
    return '/store/ma-boutique';
  }

  // Nettoyer le nom de la boutique pour créer une URL valide
  const cleanName = storeName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Remplacer les espaces par des tirets
    .replace(/[^a-z0-9-]/g, '')     // Supprimer tous les caractères non alphanumériques sauf les tirets
    .replace(/--+/g, '-')           // Remplacer les tirets multiples par un seul
    .replace(/^-+|-+$/g, '');       // Supprimer les tirets en début et fin

  // S'assurer que le nom n'est pas vide après nettoyage
  const finalName = cleanName || 'ma-boutique';

  return `/store/${finalName}`;
}

/**
 * Génère un domaine temporaire (pour l'affichage)
 * @param storeName - Nom de la boutique
 * @returns Domaine temporaire pour l'affichage
 */
export function generateSimpshopySubdomain(storeName: string): string {
  const storePath = generateStorePath(storeName);
  return `${getTempBaseDomain()}${storePath}`;
}

/**
 * Génère l'URL complète pour une boutique
 * TEMPORAIRE: Utilise un système de paths
 * @param storeName - Nom de la boutique
 * @returns URL complète au format http://localhost:8081/store/[nom-boutique]
 */
export function generateSimpshopyUrl(storeName: string): string {
  const storePath = generateStorePath(storeName);
  const baseDomain = getTempBaseDomain();
  const protocol = baseDomain.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${baseDomain}${storePath}`;
}

/**
 * Vérifie si un domaine est un sous-domaine Simpshopy
 * @param domain - Domaine à vérifier
 * @returns true si c'est un sous-domaine Simpshopy
 */
export function isSimpshopySubdomain(domain: string): boolean {
  return domain.endsWith('.simpshopy.com') && domain !== 'simpshopy.com';
}

/**
 * Extrait le nom de la boutique d'un sous-domaine Simpshopy
 * @param domain - Domaine au format [nom-boutique].simpshopy.com
 * @returns Nom de la boutique ou null si ce n'est pas un sous-domaine valide
 */
export function extractStoreNameFromSubdomain(domain: string): string | null {
  if (!isSimpshopySubdomain(domain)) {
    return null;
  }

  const storeName = domain.replace('.simpshopy.com', '');
  return storeName || null;
}

/**
 * Valide qu'un nom de boutique peut être utilisé comme sous-domaine
 * @param storeName - Nom de la boutique à valider
 * @returns true si le nom est valide pour un sous-domaine
 */
export function isValidStoreNameForSubdomain(storeName: string): boolean {
  if (!storeName || storeName.trim().length === 0) {
    return false;
  }

  const cleanName = storeName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');

  // Vérifier que le nom nettoyé n'est pas vide et fait au moins 2 caractères
  return cleanName.length >= 2;
}

/**
 * Liste des sous-domaines réservés qui ne peuvent pas être utilisés
 */
export const RESERVED_SUBDOMAINS = [
  'www',
  'api',
  'admin',
  'app',
  'mail',
  'ftp',
  'blog',
  'shop',
  'store',
  'support',
  'help',
  'docs',
  'cdn',
  'static',
  'assets',
  'media',
  'images',
  'files',
  'download',
  'upload',
  'test',
  'staging',
  'dev',
  'demo',
  'preview',
  'beta',
  'alpha'
];

/**
 * Vérifie si un nom de boutique utilise un sous-domaine réservé
 * @param storeName - Nom de la boutique
 * @returns true si le nom utilise un sous-domaine réservé
 */
export function isReservedSubdomain(storeName: string): boolean {
  const cleanName = storeName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  return RESERVED_SUBDOMAINS.includes(cleanName);
}
