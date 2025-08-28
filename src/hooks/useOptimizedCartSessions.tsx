import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../integrations/supabase/client';

// Cache client-side pour éviter les requêtes répétées
const cartSessionCache = new Map<string, any>();
const SAVE_DEBOUNCE_MS = 1000; // 1 seconde de debounce

interface CartSession {
  session_id: string;
  store_id: string;
  items?: any[];
  expires_at?: string;
  created_at?: string;
  updated_at?: string;
}

interface UseOptimizedCartSessionsOptions {
  sessionId?: string;
  storeId?: string;
  cacheDuration?: number; // en millisecondes
  debounceMs?: number;
}

export function useOptimizedCartSessions(options: UseOptimizedCartSessionsOptions = {}) {
  const { 
    sessionId, 
    storeId, 
    cacheDuration = 5 * 60 * 1000, // 5 minutes par défaut
    debounceMs = SAVE_DEBOUNCE_MS 
  } = options;

  const [cartSession, setCartSession] = useState<CartSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Générer une clé de cache unique
  const getCacheKey = useCallback((sid?: string, stid?: string) => {
    return `${sid || sessionId}:${stid || storeId}`;
  }, [sessionId, storeId]);

  // Fonction pour récupérer une session depuis le cache ou la DB
  const getCartSession = useCallback(async (sid?: string, stid?: string): Promise<CartSession | null> => {
    const cacheKey = getCacheKey(sid, stid);
    
    // Vérifier le cache d'abord
    const cached = cartSessionCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cacheDuration) {
      console.log('📦 Cache hit pour cart session:', cacheKey);
      return cached.data;
    }

    if (!sid || !stid) return null;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('cart_sessions')
        .select('*')
        .eq('session_id', sid)
        .eq('store_id', stid)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // Mettre en cache
      cartSessionCache.set(cacheKey, {
        data: data || null,
        timestamp: Date.now()
      });

      console.log('📦 Cart session chargée depuis DB:', cacheKey);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('❌ Erreur chargement cart session:', errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [getCacheKey, cacheDuration]);

  // Fonction pour sauvegarder une session avec debouncing
  const saveCartSession = useCallback(async (session: Partial<CartSession>): Promise<void> => {
    const cacheKey = getCacheKey(session.session_id, session.store_id);
    
    if (!session.session_id || !session.store_id) {
      setError('session_id et store_id requis');
      return;
    }

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Mettre à jour le cache immédiatement pour l'UI
    const updatedSession = {
      ...cartSession,
      ...session,
      updated_at: new Date().toISOString()
    };
    
    setCartSession(updatedSession);
    cartSessionCache.set(cacheKey, {
      data: updatedSession,
      timestamp: Date.now()
    });

    // Debounce la sauvegarde en DB
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const { error } = await supabase
          .from('cart_sessions')
          .upsert({
            ...session,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'session_id,store_id'
          });

        if (error) {
          throw error;
        }

        console.log('💾 Cart session sauvegardée (debounced):', cacheKey);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur de sauvegarde';
        setError(errorMessage);
        console.error('❌ Erreur sauvegarde cart session:', errorMessage);
      }
    }, debounceMs);
  }, [cartSession, getCacheKey, debounceMs]);

  // Fonction pour supprimer une session
  const deleteCartSession = useCallback(async (sid?: string, stid?: string): Promise<void> => {
    const cacheKey = getCacheKey(sid, stid);
    const sessionToDelete = sid || sessionId;
    const storeToDelete = stid || storeId;

    if (!sessionToDelete || !storeToDelete) {
      setError('session_id et store_id requis');
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_sessions')
        .delete()
        .eq('session_id', sessionToDelete)
        .eq('store_id', storeToDelete);

      if (error) {
        throw error;
      }

      // Nettoyer le cache
      cartSessionCache.delete(cacheKey);
      setCartSession(null);
      console.log('🗑️ Cart session supprimée:', cacheKey);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de suppression';
      setError(errorMessage);
      console.error('❌ Erreur suppression cart session:', errorMessage);
    }
  }, [sessionId, storeId, getCacheKey]);

  // Charger la session au montage
  useEffect(() => {
    if (sessionId && storeId) {
      getCartSession().then(setCartSession);
    }
  }, [sessionId, storeId, getCartSession]);

  // Cleanup au démontage
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Fonction pour nettoyer le cache
  const clearCache = useCallback(() => {
    cartSessionCache.clear();
    console.log('🧹 Cache cart sessions nettoyé');
  }, []);

  return {
    cartSession,
    loading,
    error,
    getCartSession,
    saveCartSession,
    deleteCartSession,
    clearCache
  };
}

// Hook pour nettoyer le cache global
export function useCartSessionsCleanup() {
  useEffect(() => {
    return () => {
      cartSessionCache.clear();
    };
  }, []);
}
