/**
 * Système de monitoring avancé pour Simpshopy
 * Détection en temps réel des problèmes de performance, sécurité et stabilité
 */

interface MonitoringEvent {
  id: string;
  type: 'error' | 'warning' | 'info' | 'security' | 'performance';
  message: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: any;
  userId?: string;
  sessionId?: string;
}

interface PerformanceMetrics {
  pageLoadTime: number;
  apiResponseTime: number;
  memoryUsage: number;
  renderCount: number;
  errorCount: number;
}

interface SecurityMetrics {
  failedLogins: number;
  suspiciousRequests: number;
  csrfViolations: number;
  xssAttempts: number;
  invalidTokens: number;
}

class AdvancedMonitoring {
  private static instance: AdvancedMonitoring;
  private events: MonitoringEvent[] = [];
  private performanceMetrics: PerformanceMetrics = {
    pageLoadTime: 0,
    apiResponseTime: 0,
    memoryUsage: 0,
    renderCount: 0,
    errorCount: 0
  };
  private securityMetrics: SecurityMetrics = {
    failedLogins: 0,
    suspiciousRequests: 0,
    csrfViolations: 0,
    xssAttempts: 0,
    invalidTokens: 0
  };
  private isMonitoring = false;
  private sessionId: string;

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeMonitoring();
  }

  static getInstance(): AdvancedMonitoring {
    if (!AdvancedMonitoring.instance) {
      AdvancedMonitoring.instance = new AdvancedMonitoring();
    }
    return AdvancedMonitoring.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    
    // Monitoring des erreurs JavaScript
    window.addEventListener('error', (event) => {
      this.trackError('JavaScript Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack
      });
    });

    // Monitoring des promesses rejetées
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError('Unhandled Promise Rejection', {
        reason: event.reason,
        promise: event.promise
      });
    });

    // Monitoring des performances
    this.monitorPerformance();
    
    // Monitoring de la mémoire
    this.monitorMemory();
    
    // Monitoring des requêtes réseau
    this.monitorNetworkRequests();
    
    // Monitoring de la sécurité
    this.monitorSecurity();
    
    console.log('🔍 Monitoring avancé initialisé');
  }

  private monitorPerformance(): void {
    // DÉSACTIVÉ TEMPORAIREMENT - Cause des conflits avec React
    // TODO: Implémenter une version non-intrusive
    console.log('🔍 Monitoring de performance désactivé temporairement');
  }

  private monitorMemory(): void {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        this.performanceMetrics.memoryUsage = memory.usedJSHeapSize;
        
        // Alerte si utilisation mémoire élevée
        if (memory.usedJSHeapSize > 50 * 1024 * 1024) { // 50MB
          this.trackWarning('High Memory Usage', {
            usedMemory: memory.usedJSHeapSize,
            totalMemory: memory.totalJSHeapSize,
            threshold: 50 * 1024 * 1024,
            message: 'Utilisation mémoire élevée détectée'
          });
        }
      }, 30000); // Vérification toutes les 30 secondes
    }
  }

  private monitorNetworkRequests(): void {
    // DÉSACTIVÉ TEMPORAIREMENT - Cause des conflits avec les appels API
    // TODO: Implémenter une version non-intrusive
    console.log('🔍 Monitoring des requêtes réseau désactivé temporairement');
  }

  private monitorSecurity(): void {
    // DÉSACTIVÉ TEMPORAIREMENT - Cause des conflits avec React
    // TODO: Implémenter une version non-intrusive
    console.log('🔍 Monitoring de sécurité désactivé temporairement');
  }

  trackEvent(type: MonitoringEvent['type'], message: string, context?: any, severity: MonitoringEvent['severity'] = 'medium'): void {
    const event: MonitoringEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      message,
      timestamp: new Date(),
      severity,
      context,
      sessionId: this.sessionId
    };

    this.events.push(event);
    
    // Limiter le nombre d'événements en mémoire
    if (this.events.length > 1000) {
      this.events = this.events.slice(-500);
    }

    // Log selon la sévérité
    const logMethod = severity === 'critical' ? 'error' : 
                     severity === 'high' ? 'warn' : 'log';
    
    console[logMethod](`🔍 [${type.toUpperCase()}] ${message}`, context);
    
    // Alerte pour les événements critiques
    if (severity === 'critical') {
      this.sendAlert(event);
    }
  }

  trackError(message: string, context?: any): void {
    this.performanceMetrics.errorCount++;
    this.trackEvent('error', message, context, 'high');
  }

  trackWarning(message: string, context?: any): void {
    this.trackEvent('warning', message, context, 'medium');
  }

  trackSecurityViolation(message: string, context?: any): void {
    this.securityMetrics.suspiciousRequests++;
    this.trackEvent('security', message, context, 'high');
  }

  trackPerformanceIssue(message: string, context?: any): void {
    this.trackEvent('performance', message, context, 'medium');
  }

  private sendAlert(event: MonitoringEvent): void {
    // Envoyer une alerte (email, webhook, etc.)
    console.error('🚨 ALERTE CRITIQUE:', event);
    
    // Ici tu peux ajouter l'envoi d'email ou webhook
    // this.sendEmailAlert(event);
    // this.sendWebhookAlert(event);
  }

  getMetrics(): { performance: PerformanceMetrics; security: SecurityMetrics; events: MonitoringEvent[] } {
    return {
      performance: { ...this.performanceMetrics },
      security: { ...this.securityMetrics },
      events: [...this.events]
    };
  }

  getRecentEvents(limit: number = 50): MonitoringEvent[] {
    return this.events.slice(-limit);
  }

  getEventsByType(type: MonitoringEvent['type']): MonitoringEvent[] {
    return this.events.filter(event => event.type === type);
  }

  getEventsBySeverity(severity: MonitoringEvent['severity']): MonitoringEvent[] {
    return this.events.filter(event => event.severity === severity);
  }

  clearEvents(): void {
    this.events = [];
  }

  generateReport(): string {
    const metrics = this.getMetrics();
    const criticalEvents = this.getEventsBySeverity('critical');
    const highSeverityEvents = this.getEventsBySeverity('high');
    
    return `
🔍 RAPPORT DE MONITORING SIMPSHOPY
====================================
📊 Métriques de Performance:
- Temps de chargement: ${metrics.performance.pageLoadTime.toFixed(2)}ms
- Temps de réponse API: ${metrics.performance.apiResponseTime.toFixed(2)}ms
- Utilisation mémoire: ${(metrics.performance.memoryUsage / 1024 / 1024).toFixed(2)}MB
- Nombre de re-renders: ${metrics.performance.renderCount}
- Nombre d'erreurs: ${metrics.performance.errorCount}

🔐 Métriques de Sécurité:
- Tentatives de connexion échouées: ${metrics.security.failedLogins}
- Requêtes suspectes: ${metrics.security.suspiciousRequests}
- Violations CSRF: ${metrics.security.csrfViolations}
- Tentatives XSS: ${metrics.security.xssAttempts}
- Tokens invalides: ${metrics.security.invalidTokens}

🚨 Événements Critiques: ${criticalEvents.length}
⚠️ Événements Haute Sévérité: ${highSeverityEvents.length}
📈 Total d'événements: ${metrics.events.length}

🆔 Session ID: ${this.sessionId}
⏰ Généré le: ${new Date().toLocaleString()}
    `;
  }
}

// Export de l'instance singleton
export const monitoring = AdvancedMonitoring.getInstance();

// Hook React pour le monitoring
export const useMonitoring = () => {
  return {
    trackEvent: monitoring.trackEvent.bind(monitoring),
    trackError: monitoring.trackError.bind(monitoring),
    trackWarning: monitoring.trackWarning.bind(monitoring),
    trackSecurityViolation: monitoring.trackSecurityViolation.bind(monitoring),
    trackPerformanceIssue: monitoring.trackPerformanceIssue.bind(monitoring),
    getMetrics: monitoring.getMetrics.bind(monitoring),
    generateReport: monitoring.generateReport.bind(monitoring)
  };
}; 