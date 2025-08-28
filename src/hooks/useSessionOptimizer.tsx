import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';

// 🔍 LOGS DE DIAGNOSTIC - useSessionOptimizer
console.log('📦 [DEBUG] useSessionOptimizer - Import du hook');

// Cache global pour éviter les configurations répétées
const sessionConfigCache = new Map<string, boolean>();

interface SessionConfig {
  searchPath?: string;
  role?: string;
  jwtClaims?: string;
  method?: string;
  path?: string;
  headers?: string;
  cookies?: string;
}

class SessionOptimizer {
  private static instance: SessionOptimizer;
  private configCache = new Map<string, boolean>();

  static getInstance(): SessionOptimizer {
    if (!SessionOptimizer.instance) {
      SessionOptimizer.instance = new SessionOptimizer();
    }
    return SessionOptimizer.instance;
  }

  private generateConfigKey(config: SessionConfig): string {
    return JSON.stringify(config);
  }

  async configureSession(config: SessionConfig): Promise<void> {
    const configKey = this.generateConfigKey(config);
    
    // Si déjà configuré, ne rien faire
    if (this.configCache.has(configKey)) {
      return;
    }

    try {
      // Configuration simplifiée - une seule requête
      const { error } = await supabase.rpc('configure_session', {
        p_search_path: config.searchPath || 'public',
        p_role: config.role || 'authenticated',
        p_jwt_claims: config.jwtClaims || '{}',
        p_method: config.method || 'GET',
        p_path: config.path || '/',
        p_headers: config.headers || '{}',
        p_cookies: config.cookies || '{}'
      });

      if (error) {
        // En cas d'erreur, marquer quand même comme configuré pour éviter les retries
        this.configCache.set(configKey, true);
        return;
      }

      // Marquer comme configuré
      this.configCache.set(configKey, true);
    } catch (error) {
      // En cas d'erreur, marquer quand même comme configuré
      this.configCache.set(configKey, true);
    }
  }

  clearCache(): void {
    this.configCache.clear();
  }

  getCacheSize(): number {
    return this.configCache.size;
  }
}

export function useSessionOptimizer() {
  console.log('🔧 [DEBUG] useSessionOptimizer() - Appel du hook');
  
  const optimizerRef = useRef<SessionOptimizer>();
  const isConfiguredRef = useRef(false);

  useEffect(() => {
    console.log('🔧 [DEBUG] useSessionOptimizer - useEffect initialisation');
    optimizerRef.current = SessionOptimizer.getInstance();
    console.log('✅ [DEBUG] useSessionOptimizer - Instance créée');
  }, []);

  const configureSession = useCallback(async (config: SessionConfig) => {
    if (!optimizerRef.current) return;
    
    await optimizerRef.current.configureSession(config);
  }, []);

  const clearCache = useCallback(() => {
    if (optimizerRef.current) {
      optimizerRef.current.clearCache();
    }
  }, []);

  const getCacheSize = useCallback(() => {
    return optimizerRef.current?.getCacheSize() || 0;
  }, []);

  // Configuration automatique au montage - une seule fois
  useEffect(() => {
    if (!isConfiguredRef.current && optimizerRef.current) {
      isConfiguredRef.current = true;
      
      // Configuration de base
      configureSession({
        searchPath: 'public',
        role: 'authenticated'
      });
    }
  }, [configureSession]);

  return {
    configureSession,
    clearCache,
    getCacheSize
  };
}

// Hook pour optimiser automatiquement les sessions dans les composants
export function useOptimizedSession(config: SessionConfig) {
  const { configureSession } = useSessionOptimizer();

  useEffect(() => {
    configureSession(config);
  }, [configureSession, JSON.stringify(config)]);
}

// Hook global pour nettoyer le cache au démontage de l'app
export function useGlobalSessionCleanup() {
  const { clearCache } = useSessionOptimizer();

  useEffect(() => {
    return () => {
      clearCache();
    };
  }, [clearCache]);
}
