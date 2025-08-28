// 🎯 GESTIONNAIRE D'ÉTAT GLOBAL
// Synchronise tous les états de l'application et évite les incohérences

interface StateSnapshot {
  timestamp: number;
  data: any;
  version: number;
}

interface StateConfig {
  enablePersistence: boolean;
  enableSync: boolean;
  maxHistorySize: number;
  syncInterval: number;
}

class GlobalStateManager {
  private static instance: GlobalStateManager;
  private state: Map<string, any> = new Map();
  private stateHistory: Map<string, StateSnapshot[]> = new Map();
  private subscribers: Map<string, Set<(data: any) => void>> = new Map();
  private syncTimer: NodeJS.Timeout | null = null;
  
  private config: StateConfig = {
    enablePersistence: true,
    enableSync: true,
    maxHistorySize: 10,
    syncInterval: 5000 // 5 secondes
  };

  private constructor() {
    this.loadPersistedState();
    this.startSync();
  }

  static getInstance(): GlobalStateManager {
    if (!GlobalStateManager.instance) {
      GlobalStateManager.instance = new GlobalStateManager();
    }
    return GlobalStateManager.instance;
  }

  /**
   * 📥 Charger l'état persistant
   */
  private loadPersistedState(): void {
    if (!this.config.enablePersistence) return;

    try {
      const persisted = localStorage.getItem('simpshopy_global_state');
      if (persisted) {
        const parsed = JSON.parse(persisted);
        for (const [key, value] of Object.entries(parsed)) {
          this.state.set(key, value);
        }
      }
    } catch (error) {
      console.warn('⚠️ Erreur lors du chargement de l\'état persistant:', error);
    }
  }

  /**
   * 📤 Sauvegarder l'état persistant
   */
  private savePersistedState(): void {
    if (!this.config.enablePersistence) return;

    try {
      const stateObject = Object.fromEntries(this.state);
      localStorage.setItem('simpshopy_global_state', JSON.stringify(stateObject));
    } catch (error) {
      console.warn('⚠️ Erreur lors de la sauvegarde de l\'état persistant:', error);
    }
  }

  /**
   * 🔄 Démarrer la synchronisation
   */
  private startSync(): void {
    if (!this.config.enableSync) return;

    this.syncTimer = setInterval(() => {
      this.syncState();
    }, this.config.syncInterval);
  }

  /**
   * 🔄 Synchroniser l'état
   */
  private syncState(): void {
    // Synchroniser avec le serveur si nécessaire
    this.savePersistedState();
    
    // Nettoyer l'historique
    this.cleanupHistory();
  }

  /**
   * 🧹 Nettoyer l'historique
   */
  private cleanupHistory(): void {
    for (const [key, history] of this.stateHistory) {
      if (history.length > this.config.maxHistorySize) {
        this.stateHistory.set(key, history.slice(-this.config.maxHistorySize));
      }
    }
  }

  /**
   * 📝 Définir un état
   */
  setState<T>(key: string, data: T, options?: { persist?: boolean; notify?: boolean }): void {
    const previousData = this.state.get(key);
    
    // Sauvegarder dans l'historique
    this.saveToHistory(key, previousData);
    
    // Mettre à jour l'état
    this.state.set(key, data);
    
    // Notifier les abonnés
    if (options?.notify !== false) {
      this.notifySubscribers(key, data);
    }
    
    // Persister si demandé
    if (options?.persist || this.config.enablePersistence) {
      this.savePersistedState();
    }
  }

  /**
   * 📖 Obtenir un état
   */
  getState<T>(key: string, defaultValue?: T): T | undefined {
    return this.state.get(key) ?? defaultValue;
  }

  /**
   * 🔄 Mettre à jour un état partiellement
   */
  updateState<T>(key: string, updater: (current: T) => T, options?: { persist?: boolean }): void {
    const currentData = this.state.get(key);
    const newData = updater(currentData);
    this.setState(key, newData, options);
  }

  /**
   * 📊 Sauvegarder dans l'historique
   */
  private saveToHistory(key: string, data: any): void {
    if (!this.stateHistory.has(key)) {
      this.stateHistory.set(key, []);
    }
    
    const history = this.stateHistory.get(key)!;
    const snapshot: StateSnapshot = {
      timestamp: Date.now(),
      data,
      version: history.length + 1
    };
    
    history.push(snapshot);
  }

  /**
   * 🔔 Notifier les abonnés
   */
  private notifySubscribers(key: string, data: any): void {
    const subscribers = this.subscribers.get(key);
    if (subscribers) {
      subscribers.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('❌ Erreur dans le callback de notification:', error);
        }
      });
    }
  }

  /**
   * 👂 S'abonner aux changements d'état
   */
  subscribe<T>(key: string, callback: (data: T) => void): () => void {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    
    this.subscribers.get(key)!.add(callback);
    
    // Retourner la fonction de désabonnement
    return () => {
      const subscribers = this.subscribers.get(key);
      if (subscribers) {
        subscribers.delete(callback);
        if (subscribers.size === 0) {
          this.subscribers.delete(key);
        }
      }
    };
  }

  /**
   * 🔙 Obtenir l'historique d'un état
   */
  getHistory(key: string): StateSnapshot[] {
    return this.stateHistory.get(key) || [];
  }

  /**
   * ⏪ Restaurer un état précédent
   */
  restoreState(key: string, version: number): boolean {
    const history = this.stateHistory.get(key);
    if (!history) return false;
    
    const snapshot = history.find(s => s.version === version);
    if (!snapshot) return false;
    
    this.setState(key, snapshot.data);
    return true;
  }

  /**
   * 🗑️ Supprimer un état
   */
  deleteState(key: string): void {
    this.state.delete(key);
    this.stateHistory.delete(key);
    this.subscribers.delete(key);
    this.savePersistedState();
  }

  /**
   * 📊 Obtenir tous les états
   */
  getAllStates(): Record<string, any> {
    return Object.fromEntries(this.state);
  }

  /**
   * 🧹 Nettoyer tous les états
   */
  clearAllStates(): void {
    this.state.clear();
    this.stateHistory.clear();
    this.subscribers.clear();
    localStorage.removeItem('simpshopy_global_state');
  }

  /**
   * 🔄 Forcer la synchronisation
   */
  forceSync(): void {
    this.syncState();
  }

  /**
   * 🛑 Arrêter la synchronisation
   */
  stopSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }

  /**
   * 📊 Obtenir les statistiques
   */
  getStats(): {
    totalStates: number;
    totalSubscribers: number;
    totalHistoryEntries: number;
  } {
    let totalSubscribers = 0;
    for (const subscribers of this.subscribers.values()) {
      totalSubscribers += subscribers.size;
    }
    
    let totalHistoryEntries = 0;
    for (const history of this.stateHistory.values()) {
      totalHistoryEntries += history.length;
    }
    
    return {
      totalStates: this.state.size,
      totalSubscribers,
      totalHistoryEntries
    };
  }
}

// Instance globale
export const globalStateManager = GlobalStateManager.getInstance();

// Hook React pour utiliser le gestionnaire d'état global
export const useGlobalState = <T>(key: string, defaultValue?: T) => {
  const [state, setState] = React.useState<T | undefined>(
    () => globalStateManager.getState<T>(key, defaultValue)
  );

  React.useEffect(() => {
    const unsubscribe = globalStateManager.subscribe<T>(key, (newData) => {
      setState(newData);
    });

    return unsubscribe;
  }, [key]);

  const updateState = React.useCallback((newData: T | ((current: T) => T)) => {
    if (typeof newData === 'function') {
      globalStateManager.updateState(key, newData as (current: T) => T);
    } else {
      globalStateManager.setState(key, newData);
    }
  }, [key]);

  return [state, updateState] as const;
};

// Hook pour les états persistants
export const usePersistentState = <T>(key: string, defaultValue?: T) => {
  const [state, setState] = useGlobalState<T>(key, defaultValue);

  const updateState = React.useCallback((newData: T | ((current: T) => T)) => {
    if (typeof newData === 'function') {
      globalStateManager.updateState(key, newData as (current: T) => T, { persist: true });
    } else {
      globalStateManager.setState(key, newData, { persist: true });
    }
  }, [key]);

  return [state, updateState] as const;
}; 