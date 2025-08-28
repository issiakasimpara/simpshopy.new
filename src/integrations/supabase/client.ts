// 🔐 CLIENT SUPABASE SÉCURISÉ
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// 🔐 Récupération sécurisée des variables d'environnement
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ✅ Validation des variables d'environnement
if (!SUPABASE_URL) {
  throw new Error('🚨 ERREUR: VITE_SUPABASE_URL manquante dans les variables d\'environnement');
}

if (!SUPABASE_ANON_KEY) {
  throw new Error('🚨 ERREUR: VITE_SUPABASE_ANON_KEY manquante dans les variables d\'environnement');
}

// 🔐 Validation stricte du format des URLs
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

if (!isValidSupabaseUrl(SUPABASE_URL)) {
  throw new Error(`🚨 ERREUR: Format SUPABASE_URL invalide: ${SUPABASE_URL}`);
}

// 🔐 Validation stricte du format de la clé JWT
const isValidJwtKey = (key: string): boolean => {
  return key.startsWith('eyJ') && 
         key.length > 100 && 
         key.split('.').length === 3;
};

if (!isValidJwtKey(SUPABASE_ANON_KEY)) {
  throw new Error('🚨 ERREUR: Format SUPABASE_ANON_KEY invalide (doit être une clé JWT valide)');
}

// ✅ Création du client sécurisé
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
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
});

// 🔍 Log de débogage (uniquement en développement - première initialisation)
if (import.meta.env.DEV && !window.__SUPABASE_INITIALIZED__) {
  console.log('🔐 Supabase client initialisé:', {
    url: SUPABASE_URL,
    keyPrefix: '***HIDDEN***',
    env: import.meta.env.VITE_APP_ENV
  });
  window.__SUPABASE_INITIALIZED__ = true;
}