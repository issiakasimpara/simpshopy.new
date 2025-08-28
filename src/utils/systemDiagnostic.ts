/**
 * Système de diagnostic pour identifier les problèmes de stabilité
 */

interface DiagnosticResult {
  timestamp: Date;
  errors: string[];
  warnings: string[];
  performance: {
    memoryUsage: number;
    renderCount: number;
    apiCalls: number;
  };
  recommendations: string[];
}

class SystemDiagnostic {
  private static instance: SystemDiagnostic;
  private isRunning = false;
  private errorCount = 0;
  private renderCount = 0;
  private apiCallCount = 0;

  private constructor() {
    this.initializeDiagnostic();
  }

  static getInstance(): SystemDiagnostic {
    if (!SystemDiagnostic.instance) {
      SystemDiagnostic.instance = new SystemDiagnostic();
    }
    return SystemDiagnostic.instance;
  }

  private initializeDiagnostic(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('🔍 Diagnostic système initialisé');

    // Capturer les erreurs JavaScript
    window.addEventListener('error', (event) => {
      this.errorCount++;
      console.error('🚨 Erreur JavaScript détectée:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack
      });
    });

    // Capturer les promesses rejetées
    window.addEventListener('unhandledrejection', (event) => {
      this.errorCount++;
      console.error('🚨 Promesse rejetée:', {
        reason: event.reason,
        promise: event.promise
      });
    });

    // Surveiller les re-renders excessifs
    let lastRenderTime = Date.now();
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      if (args[0]?.includes?.('render') || args[0]?.includes?.('re-render')) {
        this.renderCount++;
        const now = Date.now();
        if (now - lastRenderTime < 100) { // Re-render trop rapide
          console.warn('⚠️ Re-render excessif détecté:', {
            renderCount: this.renderCount,
            timeSinceLastRender: now - lastRenderTime
          });
        }
        lastRenderTime = now;
      }
      originalConsoleLog.apply(console, args);
    };

    // Surveiller les appels API
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      this.apiCallCount++;
      try {
        const response = await originalFetch(...args);
        return response;
      } catch (error) {
        console.error('🚨 Erreur API:', {
          url: args[0],
          error: error.message,
          apiCallCount: this.apiCallCount
        });
        throw error;
      }
    };
  }

  runDiagnostic(): DiagnosticResult {
    const result: DiagnosticResult = {
      timestamp: new Date(),
      errors: [],
      warnings: [],
      performance: {
        memoryUsage: this.getMemoryUsage(),
        renderCount: this.renderCount,
        apiCalls: this.apiCallCount
      },
      recommendations: []
    };

    // Vérifier les erreurs
    if (this.errorCount > 0) {
      result.errors.push(`${this.errorCount} erreurs JavaScript détectées`);
    }

    // Vérifier les re-renders
    if (this.renderCount > 100) {
      result.warnings.push(`${this.renderCount} re-renders détectés (possible optimisation nécessaire)`);
    }

    // Vérifier la mémoire
    const memoryUsage = this.getMemoryUsage();
    if (memoryUsage > 50 * 1024 * 1024) { // 50MB
      result.warnings.push(`Utilisation mémoire élevée: ${(memoryUsage / 1024 / 1024).toFixed(1)}MB`);
    }

    // Vérifier les appels API
    if (this.apiCallCount > 50) {
      result.warnings.push(`${this.apiCallCount} appels API détectés (possible optimisation nécessaire)`);
    }

    // Générer des recommandations
    if (result.errors.length > 0) {
      result.recommendations.push('Vérifier la console pour les erreurs JavaScript');
      result.recommendations.push('Implémenter une gestion d\'erreurs plus robuste');
    }

    if (result.warnings.length > 0) {
      result.recommendations.push('Optimiser les re-renders avec React.memo et useMemo');
      result.recommendations.push('Implémenter un cache pour les appels API');
      result.recommendations.push('Surveiller l\'utilisation mémoire');
    }

    return result;
  }

  private getMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return 0;
  }

  getStatus(): { isStable: boolean; issues: string[] } {
    const diagnostic = this.runDiagnostic();
    const issues: string[] = [];

    if (diagnostic.errors.length > 0) {
      issues.push(...diagnostic.errors);
    }

    if (diagnostic.warnings.length > 0) {
      issues.push(...diagnostic.warnings);
    }

    return {
      isStable: issues.length === 0,
      issues
    };
  }

  resetCounters(): void {
    this.errorCount = 0;
    this.renderCount = 0;
    this.apiCallCount = 0;
    console.log('🔍 Compteurs de diagnostic réinitialisés');
  }

  generateReport(): string {
    const diagnostic = this.runDiagnostic();
    
    return `
🔍 RAPPORT DE DIAGNOSTIC SYSTÈME
====================================
⏰ Timestamp: ${diagnostic.timestamp.toLocaleString()}

📊 Performance:
- Utilisation mémoire: ${(diagnostic.performance.memoryUsage / 1024 / 1024).toFixed(1)}MB
- Nombre de re-renders: ${diagnostic.performance.renderCount}
- Appels API: ${diagnostic.performance.apiCalls}

${diagnostic.errors.length > 0 ? `🚨 Erreurs (${diagnostic.errors.length}):\n${diagnostic.errors.map(e => `- ${e}`).join('\n')}\n` : ''}
${diagnostic.warnings.length > 0 ? `⚠️ Avertissements (${diagnostic.warnings.length}):\n${diagnostic.warnings.map(w => `- ${w}`).join('\n')}\n` : ''}
${diagnostic.recommendations.length > 0 ? `💡 Recommandations (${diagnostic.recommendations.length}):\n${diagnostic.recommendations.map(r => `- ${r}`).join('\n')}\n` : ''}

Statut: ${diagnostic.errors.length === 0 && diagnostic.warnings.length === 0 ? '✅ Stable' : '⚠️ Problèmes détectés'}
    `;
  }
}

export const systemDiagnostic = SystemDiagnostic.getInstance();

// Hook React pour le diagnostic
export const useSystemDiagnostic = () => {
  return {
    runDiagnostic: systemDiagnostic.runDiagnostic.bind(systemDiagnostic),
    getStatus: systemDiagnostic.getStatus.bind(systemDiagnostic),
    resetCounters: systemDiagnostic.resetCounters.bind(systemDiagnostic),
    generateReport: systemDiagnostic.generateReport.bind(systemDiagnostic)
  };
}; 