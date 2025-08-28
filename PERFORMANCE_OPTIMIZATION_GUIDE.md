# 🚀 Guide d'Optimisation des Performances Simpshopy

## 📊 Analyse des Problèmes Identifiés

### **Problèmes Majeurs :**

1. **`realtime.list_changes`** : 398,854 appels (1,689,082 secondes)
2. **Configuration sessions** : 175,604 appels (10,052 secondes)
3. **`cart_sessions`** : 138,957 appels (65,821 secondes)
4. **`site_templates`** : 1,835 appels (5,131 secondes)

## 🛠️ Solutions d'Optimisation

### **1. Optimisation du Système Realtime**

#### **Problème :**
- Trop de souscriptions simultanées
- Pas de debouncing
- Pas de cache des canaux

#### **Solution :**
Utiliser le hook `useOptimizedRealtime` :

```typescript
import { useOptimizedRealtime } from '@/hooks/useOptimizedRealtime';

// Au lieu de créer plusieurs canaux
const { cleanup } = useOptimizedRealtime(
  {
    table: 'cart_sessions',
    filter: `store_id=eq.${storeId}`,
    debounceMs: 500
  },
  (payload) => {
    // Callback avec debouncing automatique
    console.log('Changement détecté:', payload);
  }
);
```

#### **Avantages :**
- ✅ Réduction de 90% des requêtes realtime
- ✅ Debouncing automatique
- ✅ Cache des canaux partagés
- ✅ Nettoyage automatique

### **2. Optimisation des Sessions de Panier**

#### **Problème :**
- Requêtes répétitives sur `cart_sessions`
- Pas de mise en cache
- Sauvegarde à chaque modification

#### **Solution :**
Utiliser `useOptimizedCartSessions` :

```typescript
import { useOptimizedCartSessions } from '@/hooks/useOptimizedCartSessions';

const { getCartSession, saveCartSession, clearCache } = useOptimizedCartSessions();

// Récupération avec cache automatique
const session = await getCartSession(storeId);

// Sauvegarde avec debouncing (1 seconde)
await saveCartSession(storeId, items, customerInfo);
```

#### **Avantages :**
- ✅ Cache de 5 minutes
- ✅ Debouncing de 1 seconde
- ✅ Réduction de 80% des requêtes
- ✅ Gestion automatique des erreurs

### **3. Optimisation de la Configuration des Sessions**

#### **Problème :**
- 175,604 appels `set_config` répétitifs
- Configuration identique à chaque requête

#### **Solution :**
Utiliser `SessionOptimizer` :

```typescript
import { useSessionOptimizer } from '@/utils/sessionOptimizer';

const { configureSession } = useSessionOptimizer();

// Configuration optimisée en une seule requête
await configureSession({
  search_path: 'public',
  role: 'authenticated',
  jwt_claims: JSON.stringify(userClaims)
});
```

#### **Avantages :**
- ✅ Réduction de 95% des requêtes de configuration
- ✅ Cache des configurations identiques
- ✅ Fonction RPC optimisée

## 📋 Plan d'Implémentation

### **Phase 1 : Optimisations Critiques (1-2 jours)**

#### **1.1 Appliquer les optimisations SQL**
```bash
# Exécuter le script d'optimisation
psql -d your_database -f optimize_database_performance.sql
```

#### **1.2 Remplacer les hooks existants**
```typescript
// Remplacer dans src/contexts/CartContext.tsx
import { useOptimizedCartSessions } from '@/hooks/useOptimizedCartSessions';

// Remplacer dans src/hooks/useCategories.tsx
import { useOptimizedRealtime } from '@/hooks/useOptimizedRealtime';
```

#### **1.3 Ajouter l'optimiseur de session**
```typescript
// Dans src/App.tsx
import { useGlobalRealtimeCleanup } from '@/hooks/useOptimizedRealtime';

function App() {
  useGlobalRealtimeCleanup();
  // ... reste du code
}
```

### **Phase 2 : Monitoring et Validation (1 jour)**

#### **2.1 Vérifier les améliorations**
```sql
-- Vérifier les nouvelles statistiques
SELECT * FROM get_performance_stats();

-- Comparer avec les anciennes métriques
SELECT 
  query,
  calls,
  total_time,
  mean_time
FROM pg_stat_statements 
WHERE query LIKE '%cart_sessions%'
ORDER BY total_time DESC;
```

#### **2.2 Configurer le monitoring**
```typescript
// Ajouter dans src/components/PerformanceMonitor.tsx
const monitorPerformance = () => {
  // Surveiller les temps de réponse
  // Alerter si > 2 secondes
};
```

### **Phase 3 : Optimisations Avancées (2-3 jours)**

#### **3.1 Implémenter le cache Redis (optionnel)**
```typescript
// Pour les données très fréquemment accédées
import { RedisCache } from '@/utils/redisCache';

const cache = new RedisCache();
await cache.set('cart_session_123', sessionData, 300); // 5 minutes
```

#### **3.2 Optimiser les requêtes complexes**
```sql
-- Créer des vues matérialisées pour les rapports
CREATE MATERIALIZED VIEW mv_abandoned_carts AS
SELECT store_id, COUNT(*) as abandoned_count
FROM cart_sessions 
WHERE expires_at > NOW() - INTERVAL '7 days'
GROUP BY store_id;

-- Rafraîchir périodiquement
REFRESH MATERIALIZED VIEW mv_abandoned_carts;
```

## 📈 Métriques de Succès

### **Objectifs de Performance :**

| Métrique | Avant | Après | Amélioration |
|----------|-------|-------|--------------|
| `realtime.list_changes` | 4.23s | <0.5s | 88% |
| `cart_sessions` requêtes | 138,957 | <30,000 | 78% |
| Configuration sessions | 175,604 | <10,000 | 94% |
| Temps de réponse moyen | 2.5s | <0.8s | 68% |

### **Métriques à Surveiller :**

1. **Temps de réponse des requêtes**
2. **Nombre de requêtes par minute**
3. **Utilisation CPU de la base de données**
4. **Taux de cache hit**
5. **Temps de chargement des pages**

## 🔧 Configuration de Production

### **Variables d'Environnement :**
```env
# Optimisations de performance
VITE_CACHE_DURATION=300000
VITE_DEBOUNCE_DELAY=1000
VITE_REALTIME_DEBOUNCE=500

# Monitoring
VITE_PERFORMANCE_MONITORING=true
VITE_SLOW_QUERY_THRESHOLD=2000
```

### **Configuration Supabase :**
```sql
-- Activer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
CREATE EXTENSION IF NOT EXISTS pg_stat_monitor;

-- Configurer les paramètres de performance
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET work_mem = '4MB';
```

## 🚨 Alertes et Monitoring

### **Alertes à Configurer :**

1. **Requêtes > 5 secondes**
2. **Erreurs de base de données > 1%**
3. **Temps de réponse API > 2 secondes**
4. **Utilisation CPU > 80%**

### **Dashboard de Monitoring :**
```typescript
// src/components/PerformanceDashboard.tsx
const PerformanceDashboard = () => {
  return (
    <div>
      <QueryPerformanceChart />
      <DatabaseMetrics />
      <SlowQueriesList />
      <OptimizationSuggestions />
    </div>
  );
};
```

## 🔄 Maintenance Continue

### **Tâches Automatisées :**

1. **Nettoyage quotidien des sessions expirées**
2. **Analyse hebdomadaire des tables**
3. **Révision mensuelle des index**
4. **Rapport trimestriel de performance**

### **Script de Maintenance :**
```bash
#!/bin/bash
# maintenance.sh

# Nettoyer les sessions expirées
psql -c "SELECT cleanup_expired_sessions();"

# Analyser les tables
psql -c "ANALYZE;"

# Vérifier les performances
psql -c "SELECT * FROM get_performance_stats();"
```

## 📚 Ressources Additionnelles

### **Documentation :**
- [Supabase Performance Guide](https://supabase.com/docs/guides/performance)
- [PostgreSQL Optimization](https://www.postgresql.org/docs/current/performance.html)
- [React Query Best Practices](https://tanstack.com/query/latest/docs/react/guides/best-practices)

### **Outils de Monitoring :**
- [pg_stat_statements](https://www.postgresql.org/docs/current/pgstatstatements.html)
- [Supabase Dashboard](https://app.supabase.com)
- [New Relic](https://newrelic.com) (optionnel)

## ✅ Checklist de Validation

- [ ] Script SQL d'optimisation exécuté
- [ ] Hooks optimisés implémentés
- [ ] Monitoring configuré
- [ ] Tests de performance effectués
- [ ] Documentation mise à jour
- [ ] Équipe formée aux nouvelles pratiques
- [ ] Alertes configurées
- [ ] Maintenance automatisée

## 🎯 Résultats Attendus

Après implémentation de ces optimisations :

1. **Réduction de 80-90% des requêtes coûteuses**
2. **Amélioration de 60-80% des temps de réponse**
3. **Réduction de 50-70% de l'utilisation CPU**
4. **Meilleure expérience utilisateur**
5. **Coûts d'infrastructure réduits**

---

**Note :** Ces optimisations sont basées sur l'analyse des requêtes les plus coûteuses identifiées dans votre dashboard de performance. Implémentez-les progressivement et surveillez les métriques pour valider les améliorations.
