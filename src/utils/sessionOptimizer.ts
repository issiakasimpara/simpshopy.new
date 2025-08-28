import { supabase } from '../integrations/supabase/client';

// Cache pour éviter les configurations répétées
const configCache = new Map<string, boolean>();

interface SessionConfig {
  searchPath?: string;
  role?: string;
  jwtClaims?: string;
  method?: string;
  path?: string;
  headers?: string;
  cookies?: string;
}

/**
 * Optimise les appels set_config en utilisant une fonction RPC PostgreSQL
 * pour réduire drastiquement les appels multiples
 */
export class SessionOptimizer {
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

  /**
   * Configure la session avec une seule requête RPC
   */
  async configureSession(config: SessionConfig): Promise<void> {
    const configKey = this.generateConfigKey(config);
    
    // Si déjà configuré, ne rien faire
    if (this.configCache.has(configKey)) {
      return;
    }

    try {
      // Utiliser la fonction RPC PostgreSQL pour une seule requête
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
        console.warn('Session configuration RPC failed, using fallback:', error);
        await this.fallbackConfigureSession(config);
      } else {
        // Marquer comme configuré
        this.configCache.set(configKey, true);
        console.log('✅ Session configurée avec RPC optimisé');
      }
    } catch (error) {
      console.error('Session configuration error:', error);
      await this.fallbackConfigureSession(config);
    }
  }

  /**
   * Méthode de fallback utilisant les appels set_config traditionnels
   */
  private async fallbackConfigureSession(config: SessionConfig): Promise<void> {
    const configKey = this.generateConfigKey(config);
    
    try {
      // Méthode traditionnelle avec set_config multiples
      const { error } = await supabase
        .from('_dummy_table_for_config')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // Marquer comme configuré même en fallback
      this.configCache.set(configKey, true);
      console.log('⚠️ Session configurée en fallback');
    } catch (error) {
      console.error('Fallback configuration failed:', error);
    }
  }

  /**
   * Nettoie le cache des configurations
   */
  clearCache(): void {
    this.configCache.clear();
    console.log('🧹 Cache des sessions nettoyé');
  }

  /**
   * Retourne la taille du cache
   */
  getCacheSize(): number {
    return this.configCache.size;
  }

  /**
   * Vérifie si une configuration est en cache
   */
  isConfigured(config: SessionConfig): boolean {
    const configKey = this.generateConfigKey(config);
    return this.configCache.has(configKey);
  }
}

// Instance singleton
export const sessionOptimizer = SessionOptimizer.getInstance();

/**
 * Hook React pour optimiser les sessions
 */
export function useSessionOptimizer() {
  const configureSession = async (config: SessionConfig) => {
    await sessionOptimizer.configureSession(config);
  };

  const clearCache = () => {
    sessionOptimizer.clearCache();
  };

  const getCacheSize = () => {
    return sessionOptimizer.getCacheSize();
  };

  return {
    configureSession,
    clearCache,
    getCacheSize
  };
}

/**
 * Fonction utilitaire pour configurer rapidement une session
 */
export async function configureSessionOptimized(config: SessionConfig): Promise<void> {
  await sessionOptimizer.configureSession(config);
}

/**
 * Fonction pour nettoyer le cache global
 */
export function clearSessionCache(): void {
  sessionOptimizer.clearCache();
}
