
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './contexts/ThemeContext'

// 🔍 LOGS DE DIAGNOSTIC - DÉBUT
console.log('🚀 [DEBUG] main.tsx - Démarrage de l\'application');
console.log('🔍 [DEBUG] Environment:', import.meta.env.MODE);

// 🔧 DÉSACTIVER LES CONCURRENT FEATURES (Résout unstable_scheduleCallback)
// Cette configuration évite l'erreur React 18 Concurrent Features
if (typeof window !== 'undefined') {
  console.log('🔧 [DEBUG] Configuration des Concurrent Features...');
  
  // Désactiver les Concurrent Features qui causent l'erreur
  (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
    ...(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__,
    supportsFiber: false,
    supportsConcurrentMode: false
  };
  
  console.log('✅ [DEBUG] Concurrent Features désactivées');
}

// 🔐 Validation de sécurité au démarrage
console.log('📦 [DEBUG] Import securityValidator...');
import { logSecurityReport } from './utils/securityValidator'
console.log('✅ [DEBUG] securityValidator importé');

// ⚡ Monitoring de performance - ÉTAPE 1 RÉACTIVATION
console.log('📦 [DEBUG] Import performanceManager...');
import { performanceManager } from './utils/performanceManager'
console.log('✅ [DEBUG] performanceManager importé');

// 🛡️ Système de récupération d'erreurs global
console.log('📦 [DEBUG] Import errorRecoveryManager...');
import { errorRecoveryManager } from './utils/errorRecovery'
console.log('✅ [DEBUG] errorRecoveryManager importé');

// 🔍 Système de monitoring avancé (DÉSACTIVÉ TEMPORAIREMENT)
// import { monitoring } from './utils/monitoring'

// 🔍 Système de diagnostic pour identifier les problèmes
console.log('📦 [DEBUG] Import systemDiagnostic...');
import { systemDiagnostic } from './utils/systemDiagnostic'
console.log('✅ [DEBUG] systemDiagnostic importé');

// 🗄️ Migration de la base de données
console.log('📦 [DEBUG] Import applyMarketSettingsMigration...');
import { checkMarketSettingsTable, applyMarketSettingsMigration } from './scripts/applyMarketSettingsMigration'
console.log('✅ [DEBUG] applyMarketSettingsMigration importé');

// 🔍 Exécuter la validation de sécurité en développement uniquement (réduit)
if (import.meta.env.DEV && Math.random() < 0.1) {
  logSecurityReport();

  // ⚡ Monitoring de performance (développement uniquement - réduit)
  try {
    const stopPerformanceReporting = performanceManager.startPeriodicReporting(300000); // 5 minutes au lieu de 2
    
    // Nettoyer au démontage
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        stopPerformanceReporting();
      });
    }
  } catch (error) {
    // Log silencieux en production
  }
}

// 🛡️ Initialiser le système de récupération d'erreurs (silencieux)

// Enregistrer des actions de récupération spécifiques
errorRecoveryManager.registerRecoveryAction('Products_fetch_products_Error', {
  type: 'retry',
  action: async () => {
    // Retenter le chargement des produits
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('retry-fetch-products'));
    }
  },
  maxAttempts: 3,
  delay: 2000
});

errorRecoveryManager.registerRecoveryAction('Products_create_product_Error', {
  type: 'retry',
  action: async () => {
    // Retenter la création de produit
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('retry-create-product'));
    }
  },
  maxAttempts: 2,
  delay: 1000
});

errorRecoveryManager.registerRecoveryAction('Auth_signIn_Error', {
  type: 'redirect',
  action: async () => {
    // Rediriger vers la page de connexion sur admin.simpshopy.com
    if (typeof window !== 'undefined') {
      const currentHostname = window.location.hostname;
      if (currentHostname === 'admin.simpshopy.com') {
        window.location.href = '/auth';
      } else {
        window.location.href = 'https://admin.simpshopy.com/auth';
      }
    }
  },
  maxAttempts: 1,
  delay: 0
});

console.log('✅ Système de récupération d\'erreurs initialisé');

// 🗄️ Vérifier et appliquer les migrations de base de données
// NOTE: Migration désactivée - exécutez manuellement CREATE_MARKET_SETTINGS_MANUAL.sql
(async () => {
  try {
    const tableExists = await checkMarketSettingsTable();
    if (!tableExists) {
      console.log('⚠️ Table market_settings manquante - exécutez CREATE_MARKET_SETTINGS_MANUAL.sql manuellement');
    }
  } catch (error) {
    console.warn('⚠️ Erreur lors de la vérification des migrations:', error);
  }
})();

// 🔧 Configuration React 18 pour éviter unstable_scheduleCallback
console.log('🔧 [DEBUG] Configuration de createRoot...');

const rootElement = document.getElementById('root')!;
console.log('✅ [DEBUG] Root element trouvé:', rootElement);

// Utiliser createRoot sans options pour éviter les problèmes
console.log('🔧 [DEBUG] Création du root simple...');
const root = createRoot(rootElement);
console.log('✅ [DEBUG] Root créé avec succès');

console.log('🎨 [DEBUG] Rendu de l\'application...');
root.render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
console.log('✅ [DEBUG] Application rendue avec succès');
console.log('🎯 [DEBUG] main.tsx - Initialisation terminée');
