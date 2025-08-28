// 🔐 CONFIGURATION CLOUDFLARE SÉCURISÉE
// ⚠️ IMPORTANT: Les clés Cloudflare ne doivent JAMAIS être dans le frontend !

/**
 * ⚠️ AVERTISSEMENT SÉCURITÉ
 * 
 * Les clés API Cloudflare sont des secrets PRIVÉS qui ne doivent JAMAIS
 * être exposées côté client. Elles doivent être utilisées uniquement :
 * 
 * 1. Dans les Supabase Edge Functions (serveur)
 * 2. Dans les variables d'environnement serveur
 * 3. Dans les actions GitHub/CI/CD
 * 
 * ❌ JAMAIS dans le code frontend React !
 */

export interface CloudflareConfig {
  // Ces valeurs doivent venir des Edge Functions Supabase
  readonly baseUrl: string;
  readonly apiVersion: string;
}

// ✅ Configuration publique uniquement
export const CLOUDFLARE_PUBLIC_CONFIG: CloudflareConfig = {
  baseUrl: 'https://api.cloudflare.com/client/v4',
  apiVersion: 'v4'
} as const;

/**
 * 🔐 Fonction pour appeler l'API Cloudflare via Supabase Edge Function
 * Cette approche est sécurisée car les clés restent côté serveur
 */
export const callCloudflareAPI = async (
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any
) => {
  try {
    // ✅ Appel sécurisé via Edge Function
    const response = await fetch('/api/cloudflare-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint,
        method,
        data
      })
    });

    if (!response.ok) {
      throw new Error(`Erreur API Cloudflare: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('🚨 Erreur Cloudflare API:', error);
    throw error;
  }
};

/**
 * 🔍 Fonction de diagnostic (sans exposer les clés)
 */
export const checkCloudflareConnection = async (): Promise<boolean> => {
  try {
    await callCloudflareAPI('/zones', 'GET');
    return true;
  } catch (error) {
    console.error('🚨 Connexion Cloudflare échouée:', error);
    return false;
  }
};

// 📝 Documentation pour les développeurs
export const CLOUDFLARE_SECURITY_GUIDE = {
  DO: [
    '✅ Utiliser les Edge Functions Supabase pour les appels API',
    '✅ Stocker les clés dans les secrets Supabase',
    '✅ Valider toutes les entrées utilisateur',
    '✅ Logger les erreurs (sans exposer les clés)'
  ],
  DONT: [
    '❌ JAMAIS mettre les clés API dans le code frontend',
    '❌ JAMAIS commiter les clés dans Git',
    '❌ JAMAIS exposer les clés dans les logs',
    '❌ JAMAIS utiliser les clés directement côté client'
  ]
} as const;
