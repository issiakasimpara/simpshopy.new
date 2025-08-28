// 🔐 VALIDATEUR DE SÉCURITÉ
// Vérifie que l'application respecte les bonnes pratiques de sécurité

interface SecurityCheck {
  name: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  message: string;
  critical: boolean;
}

interface SecurityReport {
  overall: 'SECURE' | 'VULNERABLE' | 'CRITICAL';
  score: number;
  checks: SecurityCheck[];
  recommendations: string[];
}

/**
 * 🔍 Validation complète de la sécurité
 */
export const validateSecurity = (): SecurityReport => {
  const checks: SecurityCheck[] = [];
  const recommendations: string[] = [];

  // 1. Vérifier les variables d'environnement
  checks.push(checkEnvironmentVariables());
  
  // 2. Vérifier l'absence de clés hardcodées
  checks.push(checkHardcodedSecrets());
  
  // 3. Vérifier la configuration Supabase
  checks.push(checkSupabaseConfig());
  
  // 4. Vérifier HTTPS
  checks.push(checkHTTPS());
  
  // 5. Vérifier les headers de sécurité
  checks.push(checkSecurityHeaders());

  // Calculer le score
  const totalChecks = checks.length;
  const passedChecks = checks.filter(c => c.status === 'PASS').length;
  const criticalFailures = checks.filter(c => c.status === 'FAIL' && c.critical).length;
  
  const score = Math.round((passedChecks / totalChecks) * 100);
  
  // Déterminer le statut global
  let overall: 'SECURE' | 'VULNERABLE' | 'CRITICAL';
  if (criticalFailures > 0) {
    overall = 'CRITICAL';
    recommendations.push('🚨 URGENT: Corriger immédiatement les failles critiques');
  } else if (score < 70) {
    overall = 'VULNERABLE';
    recommendations.push('⚠️ Améliorer la sécurité avant la production');
  } else {
    overall = 'SECURE';
    recommendations.push('✅ Sécurité acceptable, continuer la surveillance');
  }

  // Ajouter des recommandations spécifiques
  if (checks.some(c => c.name.includes('Environment') && c.status === 'FAIL')) {
    recommendations.push('📝 Configurer correctement les variables d\'environnement');
  }
  
  if (checks.some(c => c.name.includes('HTTPS') && c.status === 'FAIL')) {
    recommendations.push('🔒 Activer HTTPS en production');
  }

  return {
    overall,
    score,
    checks,
    recommendations
  };
};

/**
 * 🔍 Vérifier les variables d'environnement
 */
const checkEnvironmentVariables = (): SecurityCheck => {
  const requiredVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
  const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missingVars.length > 0) {
    return {
      name: 'Environment Variables',
      status: 'FAIL',
      message: `Variables manquantes: ${missingVars.join(', ')}`,
      critical: true
    };
  }
  
  return {
    name: 'Environment Variables',
    status: 'PASS',
    message: 'Toutes les variables d\'environnement sont présentes',
    critical: false
  };
};

/**
 * 🔍 Vérifier l'absence de clés hardcodées
 */
const checkHardcodedSecrets = (): SecurityCheck => {
  // Cette vérification est symbolique - en réalité, elle devrait être faite par un linter
  const codeContent = document.documentElement.innerHTML;
  
  // Patterns dangereux
  const dangerousPatterns = [
    /sk_live_[a-zA-Z0-9]+/, // Stripe live keys
    /pk_live_[a-zA-Z0-9]+/, // Stripe public live keys
    /AKIA[0-9A-Z]{16}/, // AWS Access Keys
    /[0-9a-f]{32}/, // Potential API keys (32 hex chars)
  ];
  
  const foundPatterns = dangerousPatterns.some(pattern => pattern.test(codeContent));
  
  if (foundPatterns) {
    return {
      name: 'Hardcoded Secrets',
      status: 'FAIL',
      message: 'Clés potentiellement exposées détectées dans le code',
      critical: true
    };
  }
  
  return {
    name: 'Hardcoded Secrets',
    status: 'PASS',
    message: 'Aucune clé hardcodée détectée',
    critical: false
  };
};

/**
 * 🔍 Vérifier la configuration Supabase
 */
const checkSupabaseConfig = (): SecurityCheck => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  
  if (!supabaseUrl?.startsWith('https://')) {
    return {
      name: 'Supabase Config',
      status: 'FAIL',
      message: 'URL Supabase doit utiliser HTTPS',
      critical: true
    };
  }
  
  if (!supabaseUrl?.includes('.supabase.co')) {
    return {
      name: 'Supabase Config',
      status: 'WARNING',
      message: 'URL Supabase non standard détectée',
      critical: false
    };
  }
  
  return {
    name: 'Supabase Config',
    status: 'PASS',
    message: 'Configuration Supabase sécurisée',
    critical: false
  };
};

/**
 * 🔍 Vérifier HTTPS
 */
const checkHTTPS = (): SecurityCheck => {
  const isHTTPS = window.location.protocol === 'https:';
  const isLocalhost = window.location.hostname === 'localhost';
  
  if (!isHTTPS && !isLocalhost) {
    return {
      name: 'HTTPS',
      status: 'FAIL',
      message: 'HTTPS requis en production',
      critical: true
    };
  }
  
  return {
    name: 'HTTPS',
    status: 'PASS',
    message: isLocalhost ? 'Localhost (HTTPS non requis)' : 'HTTPS activé',
    critical: false
  };
};

/**
 * 🔍 Vérifier les headers de sécurité
 */
const checkSecurityHeaders = (): SecurityCheck => {
  // Cette vérification nécessiterait une requête réseau pour être complète
  // Pour l'instant, on fait une vérification basique
  
  return {
    name: 'Security Headers',
    status: 'WARNING',
    message: 'Vérification des headers de sécurité recommandée',
    critical: false
  };
};

/**
 * 🔍 Afficher le rapport de sécurité dans la console
 */
export const logSecurityReport = (): void => {
  // Log seulement en développement et très rarement pour éviter la pollution
  if (import.meta.env.DEV && Math.random() < 0.01) { // 1% de chance de log
    const report = validateSecurity();
    
    console.group('🔐 RAPPORT DE SÉCURITÉ');
    console.log(`📊 Score: ${report.score}/100`);
    console.log(`🎯 Statut: ${report.overall}`);
    
    console.group('📋 Vérifications:');
    report.checks.forEach(check => {
      const icon = check.status === 'PASS' ? '✅' : check.status === 'WARNING' ? '⚠️' : '❌';
      console.log(`${icon} ${check.name}: ${check.message}`);
    });
    console.groupEnd();
    
    if (report.recommendations.length > 0) {
      console.group('💡 Recommandations:');
      report.recommendations.forEach(rec => console.log(rec));
      console.groupEnd();
    }
    
    console.groupEnd();
  }
};
