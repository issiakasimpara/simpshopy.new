// 🔐 CLIENT SUPABASE SÉCURISÉ
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// 🔐 Récupération sécurisée des variables d'environnement
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ✅ Validation des variables d'environnement (plus souple pour Vercel)
if (!SUPABASE_URL) {
  console.error('🚨 ERREUR: VITE_SUPABASE_URL manquante dans les variables d\'environnement');
  // Ne pas faire planter l'app, juste logger l'erreur
}

if (!SUPABASE_ANON_KEY) {
  console.error('🚨 ERREUR: VITE_SUPABASE_ANON_KEY manquante dans les variables d\'environnement');
  // Ne pas faire planter l'app, juste logger l'erreur
}

// 🔐 Validation souple du format des URLs
const isValidSupabaseUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'https:' && 
           urlObj.hostname.includes('.supabase.co') &&
           urlObj.hostname.length > 0;
  } catch {
    return false;
  }
};

// Validation souple - ne pas faire planter l'app
if (SUPABASE_URL && !isValidSupabaseUrl(SUPABASE_URL)) {
  console.error(`🚨 ERREUR: Format SUPABASE_URL invalide: ${SUPABASE_URL}`);
}

// 🔐 Validation souple du format de la clé JWT
const isValidJwtKey = (key: string): boolean => {
  return key.startsWith('eyJ') && 
         key.length > 100 && 
         key.split('.').length === 3;
};

// Validation souple - ne pas faire planter l'app
if (SUPABASE_ANON_KEY && !isValidJwtKey(SUPABASE_ANON_KEY)) {
  console.error('🚨 ERREUR: Format SUPABASE_ANON_KEY invalide (doit être une clé JWT valide)');
}

// ✅ Création du client sécurisé (seulement si les variables sont présentes)
export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY 
  ? createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      },
      // 🔐 Configuration sécurisée
      global: {
        headers: {
          'X-Client-Info': 'maliba-shop@1.0.0'
        }
      }
    })
  : null;

// 🔍 Log de débogage (uniquement en développement - première initialisation)
if (import.meta.env.DEV && typeof window !== 'undefined' && !window.__SUPABASE_INITIALIZED__) {
  console.log('🔐 Supabase client initialisé:', {
    url: SUPABASE_URL,
    keyPrefix: '***HIDDEN***',
    env: import.meta.env.VITE_APP_ENV
  });
  window.__SUPABASE_INITIALIZED__ = true;
}