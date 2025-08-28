// 🛡️ SYSTÈME DE RÉCUPÉRATION D'ERREURS GLOBAL
// Gère tous les types d'erreurs et permet la récupération automatique

interface ErrorContext {
  component?: string;
  action?: string;
  data?: any;
  timestamp: number;
  userId?: string;
}

interface RecoveryAction {
  type: 'retry' | 'fallback' | 'reset' | 'redirect';
  action: () => Promise<void>;
  maxAttempts: number;
  delay: number;
}

interface ErrorRecoveryConfig {
  enableAutoRecovery: boolean;
  maxRetryAttempts: number;
  retryDelay: number;
  enableLogging: boolean;
  enableAnalytics: boolean;
}

class ErrorRecoveryManager {
  private static instance: ErrorRecoveryManager;
  private errorHistory: Map<string, ErrorContext[]> = new Map();
  private recoveryActions: Map<string, RecoveryAction> = new Map();
  private retryCounts: Map<string, number> = new Map();
  
  private config: ErrorRecoveryConfig = {
    enableAutoRecovery: true,
    maxRetryAttempts: 3,
    retryDelay: 1000,
    enableLogging: import.meta.env.DEV,
    enableAnalytics: true
  };

  private constructor() {
    this.setupGlobalErrorHandlers();
  }

  static getInstance(): ErrorRecoveryManager {
    if (!ErrorRecoveryManager.instance) {
      ErrorRecoveryManager.instance = new ErrorRecoveryManager();
    }
    return ErrorRecoveryManager.instance;
  }

  /**
   * 🛡️ Gestionnaire d'erreurs global
   */
  private setupGlobalErrorHandlers(): void {
    // Gestionnaire d'erreurs non capturées
    window.addEventListener('error', (event) => {
      this.handleError(event.error, {
        component: 'Global',
        action: 'Unhandled Error',
        timestamp: Date.now()
      });
    });

    // Gestionnaire de promesses rejetées
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason, {
        component: 'Global',
        action: 'Unhandled Promise Rejection',
        timestamp: Date.now()
      });
    });

    // Gestionnaire d'erreurs réseau
    window.addEventListener('offline', () => {
      this.handleError(new Error('Network offline'), {
        component: 'Network',
        action: 'Connection Lost',
        timestamp: Date.now()
      });
    });
  }

  /**
   * 🛡️ Gérer une erreur avec récupération automatique
   */
  async handleError(error: Error, context: ErrorContext): Promise<void> {
    const errorKey = this.generateErrorKey(error, context);
    
    // Enregistrer l'erreur
    this.logError(error, context);
    
    // Vérifier si une action de récupération existe
    const recoveryAction = this.recoveryActions.get(errorKey);
    
    if (recoveryAction && this.config.enableAutoRecovery) {
      await this.attemptRecovery(errorKey, recoveryAction, context);
    } else {
      // Action de récupération par défaut
      await this.defaultRecovery(error, context);
    }
  }

  /**
   * 🔄 Tenter la récupération automatique
   */
  private async attemptRecovery(
    errorKey: string, 
    recoveryAction: RecoveryAction, 
    context: ErrorContext
  ): Promise<void> {
    const currentAttempts = this.retryCounts.get(errorKey) || 0;
    
    if (currentAttempts >= recoveryAction.maxAttempts) {
      console.error(`❌ Récupération échouée après ${currentAttempts} tentatives:`, context);
      await this.defaultRecovery(new Error('Max retry attempts reached'), context);
      return;
    }

    try {
      // Attendre avant de retenter
      await new Promise(resolve => setTimeout(resolve, recoveryAction.delay));
      
      // Incrémenter le compteur de tentatives
      this.retryCounts.set(errorKey, currentAttempts + 1);
      
      // Exécuter l'action de récupération
      await recoveryAction.action();
      
      // Réinitialiser le compteur en cas de succès
      this.retryCounts.delete(errorKey);
      
      if (this.config.enableLogging) {
        console.log(`✅ Récupération réussie après ${currentAttempts + 1} tentatives`);
      }
      
    } catch (recoveryError) {
      console.error('❌ Échec de la récupération:', recoveryError);
      await this.attemptRecovery(errorKey, recoveryAction, context);
    }
  }

  /**
   * 🛡️ Récupération par défaut
   */
  private async defaultRecovery(error: Error, context: ErrorContext): Promise<void> {
    // Actions de récupération par défaut selon le type d'erreur
    const errorMessage = error.message || error.toString() || '';
    
    if (errorMessage.includes('Network') || errorMessage.includes('fetch')) {
      await this.handleNetworkError(context);
    } else if (errorMessage.includes('auth') || errorMessage.includes('session')) {
      await this.handleAuthError(context);
    } else if (errorMessage.includes('database') || errorMessage.includes('supabase')) {
      await this.handleDatabaseError(context);
    } else {
      await this.handleGenericError(context);
    }
  }

  /**
   * 🌐 Gérer les erreurs réseau
   */
  private async handleNetworkError(context: ErrorContext): Promise<void> {
    // Attendre que la connexion soit rétablie
    if (!navigator.onLine) {
      await new Promise<void>((resolve) => {
        const handleOnline = () => {
          window.removeEventListener('online', handleOnline);
          resolve();
        };
        window.addEventListener('online', handleOnline);
      });
    }
    
    // Retenter l'action après reconnexion
    if (context.action) {
      await this.retryAction(context.action, context);
    }
  }

  /**
   * 🔐 Gérer les erreurs d'authentification
   */
  private async handleAuthError(context: ErrorContext): Promise<void> {
    // Rediriger vers la page de connexion sur admin.simpshopy.com
    const currentHostname = window.location.hostname;
    const currentPath = window.location.pathname;
    
    if (currentHostname === 'admin.simpshopy.com') {
      if (currentPath !== '/auth') {
        window.location.href = '/auth?redirect=' + encodeURIComponent(currentPath);
      }
    } else {
      window.location.href = 'https://admin.simpshopy.com/auth?redirect=' + encodeURIComponent(currentPath);
    }
  }

  /**
   * 🗄️ Gérer les erreurs de base de données
   */
  private async handleDatabaseError(context: ErrorContext): Promise<void> {
    // Nettoyer le cache et retenter
    if (window.location.pathname.includes('/dashboard')) {
      window.location.reload();
    }
  }

  /**
   * 🔄 Gérer les erreurs génériques
   */
  private async handleGenericError(context: ErrorContext): Promise<void> {
    // Afficher un message d'erreur utilisateur-friendly
    this.showUserFriendlyError(context);
  }

  /**
   * 🔄 Retenter une action
   */
  private async retryAction(action: string, context: ErrorContext): Promise<void> {
    // Implémentation spécifique selon l'action
    switch (action) {
      case 'fetch_products':
        // Retenter le chargement des produits
        window.dispatchEvent(new CustomEvent('retry-fetch-products'));
        break;
      case 'create_product':
        // Retenter la création de produit
        window.dispatchEvent(new CustomEvent('retry-create-product'));
        break;
      default:
        // Action générique
        window.location.reload();
    }
  }

  /**
   * 📝 Enregistrer une erreur
   */
  private logError(error: Error, context: ErrorContext): void {
    const errorKey = this.generateErrorKey(error, context);
    
    if (!this.errorHistory.has(errorKey)) {
      this.errorHistory.set(errorKey, []);
    }
    
    this.errorHistory.get(errorKey)!.push(context);
    
    if (this.config.enableLogging) {
      console.error('🚨 Erreur capturée:', {
        error: error.message,
        stack: error.stack,
        context
      });
    }
  }

  /**
   * 🔑 Générer une clé d'erreur unique
   */
  private generateErrorKey(error: Error, context: ErrorContext): string {
    return `${context.component || 'unknown'}_${context.action || 'unknown'}_${error.name}`;
  }

  /**
   * 📱 Afficher une erreur utilisateur-friendly
   */
  private showUserFriendlyError(context: ErrorContext): void {
    // Créer une notification d'erreur
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerHTML = `
      <div class="error-content">
        <h3>Une erreur est survenue</h3>
        <p>Nous travaillons pour résoudre ce problème. Veuillez réessayer dans quelques instants.</p>
        <button onclick="this.parentElement.parentElement.remove()">Fermer</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-suppression après 5 secondes
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

  /**
   * ➕ Enregistrer une action de récupération
   */
  registerRecoveryAction(
    errorKey: string, 
    recoveryAction: RecoveryAction
  ): void {
    this.recoveryActions.set(errorKey, recoveryAction);
  }

  /**
   * 📊 Obtenir les statistiques d'erreurs
   */
  getErrorStats(): { total: number; byComponent: Record<string, number> } {
    const stats = { total: 0, byComponent: {} as Record<string, number> };
    
    for (const [key, contexts] of this.errorHistory) {
      stats.total += contexts.length;
      const component = key.split('_')[0];
      stats.byComponent[component] = (stats.byComponent[component] || 0) + contexts.length;
    }
    
    return stats;
  }

  /**
   * 🧹 Nettoyer l'historique des erreurs
   */
  cleanup(): void {
    this.errorHistory.clear();
    this.retryCounts.clear();
  }
}

// Instance globale
export const errorRecoveryManager = ErrorRecoveryManager.getInstance();

// Hook React pour utiliser le gestionnaire d'erreurs
export const useErrorRecovery = (componentName: string) => {
  const handleError = (error: Error, action?: string, data?: any) => {
    errorRecoveryManager.handleError(error, {
      component: componentName,
      action,
      data,
      timestamp: Date.now()
    });
  };

  const registerRecovery = (errorKey: string, recoveryAction: RecoveryAction) => {
    errorRecoveryManager.registerRecoveryAction(errorKey, recoveryAction);
  };

  return { handleError, registerRecovery };
}; 