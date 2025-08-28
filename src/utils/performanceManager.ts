// ⚡ GESTIONNAIRE DE PERFORMANCE GLOBAL
// Surveille et optimise les performances de l'application

interface PerformanceMetrics {
  queryCount: number;
  totalQueries: number;
  averageQueryTime: number;
  slowQueries: Array<{
    key: string;
    duration: number;
    timestamp: number;
  }>;
  memoryUsage: number;
  renderCount: number;
}

interface PerformanceConfig {
  maxQueriesPerMinute: number;
  slowQueryThreshold: number;
  memoryThreshold: number;
  enableLogging: boolean;
}

class PerformanceManager {
  private metrics: PerformanceMetrics = {
    queryCount: 0,
    totalQueries: 0,
    averageQueryTime: 0,
    slowQueries: [],
    memoryUsage: 0,
    renderCount: 0
  };

  private config: PerformanceConfig = {
    maxQueriesPerMinute: 30, // Limite de 30 requêtes par minute
    slowQueryThreshold: 2000, // 2 secondes
    memoryThreshold: 100 * 1024 * 1024, // 100MB
    enableLogging: import.meta.env.DEV
  };

  private queryTimes: Map<string, number> = new Map();
  private lastMinuteQueries: number[] = [];

  /**
   * 📊 Enregistrer une nouvelle requête
   */
  trackQuery(queryKey: string, startTime?: number): void {
    const now = Date.now();
    
    // Nettoyer les requêtes de plus d'une minute
    this.lastMinuteQueries = this.lastMinuteQueries.filter(
      time => now - time < 60000
    );
    
    this.lastMinuteQueries.push(now);
    this.metrics.queryCount = this.lastMinuteQueries.length;
    this.metrics.totalQueries++;

    if (startTime) {
      const duration = now - startTime;
      this.queryTimes.set(queryKey, duration);
      
      // Calculer la moyenne
      const times = Array.from(this.queryTimes.values());
      this.metrics.averageQueryTime = times.reduce((a, b) => a + b, 0) / times.length;
      
      // Détecter les requêtes lentes
      if (duration > this.config.slowQueryThreshold) {
        this.metrics.slowQueries.push({
          key: queryKey,
          duration,
          timestamp: now
        });
        
        // Garder seulement les 10 dernières requêtes lentes
        if (this.metrics.slowQueries.length > 10) {
          this.metrics.slowQueries = this.metrics.slowQueries.slice(-10);
        }
        
        if (this.config.enableLogging) {
          console.warn(`🐌 Requête lente détectée: ${queryKey} (${duration}ms)`);
        }
      }
    }

    // Vérifier les limites
    this.checkLimits();
  }

  /**
   * 📊 Enregistrer un render
   */
  trackRender(componentName?: string): void {
    this.metrics.renderCount++;
    
    if (this.config.enableLogging && componentName) {
      console.log(`🔄 Render: ${componentName} (Total: ${this.metrics.renderCount})`);
    }
  }

  /**
   * 📊 Mesurer l'utilisation mémoire
   */
  trackMemory(): void {
    try {
      if ('memory' in performance && (performance as any).memory) {
        // API expérimentale disponible dans Chrome
        this.metrics.memoryUsage = (performance as any).memory.usedJSHeapSize;

        if (this.metrics.memoryUsage > this.config.memoryThreshold) {
          if (this.config.enableLogging) {
            console.warn(`🧠 Utilisation mémoire élevée: ${Math.round(this.metrics.memoryUsage / 1024 / 1024)}MB`);
          }
        }
      } else {
        // Fallback pour les navigateurs sans support
        this.metrics.memoryUsage = 0;
      }
    } catch (error) {
      // Silencieux en cas d'erreur
      this.metrics.memoryUsage = 0;
    }
  }

  /**
   * ⚠️ Vérifier les limites de performance
   */
  private checkLimits(): void {
    // Trop de requêtes par minute
    if (this.metrics.queryCount > this.config.maxQueriesPerMinute) {
      if (this.config.enableLogging) {
        console.error(`🚨 ALERTE: Trop de requêtes (${this.metrics.queryCount}/min)`);
        console.log('💡 Suggestion: Augmenter staleTime et réduire refetchInterval');
      }
    }

    // Trop de requêtes lentes
    const recentSlowQueries = this.metrics.slowQueries.filter(
      q => Date.now() - q.timestamp < 60000
    );
    
    if (recentSlowQueries.length > 3) {
      if (this.config.enableLogging) {
        console.error(`🚨 ALERTE: ${recentSlowQueries.length} requêtes lentes dans la dernière minute`);
        console.log('💡 Suggestion: Optimiser les requêtes ou ajouter des index');
      }
    }
  }

  /**
   * 📊 Obtenir les métriques actuelles
   */
  getMetrics(): PerformanceMetrics {
    this.trackMemory();
    return { ...this.metrics };
  }

  /**
   * 📊 Obtenir un rapport de performance
   */
  getReport(): string {
    const metrics = this.getMetrics();
    
    return `
🚀 RAPPORT DE PERFORMANCE
========================
📊 Requêtes/minute: ${metrics.queryCount}/${this.config.maxQueriesPerMinute}
⏱️  Temps moyen: ${Math.round(metrics.averageQueryTime)}ms
🐌 Requêtes lentes: ${metrics.slowQueries.length}
🧠 Mémoire: ${Math.round(metrics.memoryUsage / 1024 / 1024)}MB
🔄 Renders: ${metrics.renderCount}

${metrics.slowQueries.length > 0 ? `
🐌 REQUÊTES LENTES RÉCENTES:
${metrics.slowQueries.slice(-3).map(q => 
  `- ${q.key}: ${q.duration}ms`
).join('\n')}
` : '✅ Aucune requête lente récente'}

💡 RECOMMANDATIONS:
${this.getRecommendations().join('\n')}
    `.trim();
  }

  /**
   * 💡 Obtenir des recommandations d'optimisation
   */
  private getRecommendations(): string[] {
    const recommendations: string[] = [];
    const metrics = this.getMetrics();

    if (metrics.queryCount > this.config.maxQueriesPerMinute * 0.8) {
      recommendations.push('- Augmenter staleTime pour réduire les requêtes');
      recommendations.push('- Désactiver refetchOnWindowFocus sur les données non critiques');
    }

    if (metrics.averageQueryTime > 1000) {
      recommendations.push('- Optimiser les requêtes Supabase avec des index');
      recommendations.push('- Réduire la quantité de données récupérées');
    }

    if (metrics.slowQueries.length > 2) {
      recommendations.push('- Identifier et optimiser les requêtes les plus lentes');
      recommendations.push('- Considérer la pagination pour les grandes listes');
    }

    if (metrics.memoryUsage > this.config.memoryThreshold * 0.8) {
      recommendations.push('- Nettoyer les caches inutilisés');
      recommendations.push('- Implémenter le lazy loading pour les composants');
    }

    if (recommendations.length === 0) {
      recommendations.push('✅ Performance optimale !');
    }

    return recommendations;
  }

  /**
   * 🧹 Nettoyer les métriques anciennes
   */
  cleanup(): void {
    const now = Date.now();
    
    // Nettoyer les requêtes lentes de plus de 5 minutes
    this.metrics.slowQueries = this.metrics.slowQueries.filter(
      q => now - q.timestamp < 5 * 60 * 1000
    );
    
    // Nettoyer les temps de requête anciens
    if (this.queryTimes.size > 100) {
      const entries = Array.from(this.queryTimes.entries());
      this.queryTimes = new Map(entries.slice(-50));
    }
  }

  /**
   * 📊 Logger le rapport périodiquement
   */
  startPeriodicReporting(intervalMs: number = 60000): () => void {
    if (!this.config.enableLogging) return () => {};
    
    const interval = setInterval(() => {
      // Log seulement en développement et très rarement
      if (import.meta.env.DEV && Math.random() < 0.05) { // 5% de chance de log
        console.group('⚡ PERFORMANCE REPORT');
        console.log(this.getReport());
        console.groupEnd();
      }
      this.cleanup();
    }, intervalMs);

    return () => clearInterval(interval);
  }
}

// Instance globale
export const performanceManager = new PerformanceManager();

/**
 * 🎯 Hook pour tracker les performances d'un composant
 */
export const usePerformanceTracker = (componentName: string) => {
  const startTime = Date.now();
  
  // Track render
  performanceManager.trackRender(componentName);
  
  return {
    trackQuery: (queryKey: string) => {
      performanceManager.trackQuery(queryKey, startTime);
    },
    getMetrics: () => performanceManager.getMetrics(),
    getReport: () => performanceManager.getReport()
  };
};
