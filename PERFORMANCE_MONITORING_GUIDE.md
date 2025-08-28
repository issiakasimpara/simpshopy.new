# 📊 Guide de Monitoring des Performances Simpshopy

## 🎯 Objectif
Surveiller l'impact des optimisations sur les performances et les coûts Supabase.

## 📈 Métriques à Surveiller

### 1. **Requêtes Market Settings**
```sql
-- Vérifier les requêtes market_settings
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  (calls / EXTRACT(EPOCH FROM (NOW() - query_start_time))) as calls_per_second
FROM pg_stat_statements 
WHERE query LIKE '%market_settings%'
ORDER BY calls DESC;
```

**Objectif :** Réduction de 90% des appels

### 2. **Appels Realtime**
```sql
-- Vérifier les appels realtime.list_changes
SELECT 
  query,
  calls,
  total_time,
  mean_time
FROM pg_stat_statements 
WHERE query LIKE '%realtime.list_changes%'
ORDER BY calls DESC;
```

**Objectif :** Réduction de 80% des appels

### 3. **Performance Générale**
```sql
-- Vue d'ensemble des requêtes les plus fréquentes
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  (total_time / calls) as avg_time_per_call
FROM pg_stat_statements 
ORDER BY calls DESC
LIMIT 10;
```

## 🔍 Dashboard Supabase

### 1. **Analytics Dashboard**
- Aller sur : https://supabase.com/dashboard
- Sélectionner votre projet
- Onglet "Analytics"

### 2. **Métriques à Surveiller**
- **Database Requests** : Devrait baisser significativement
- **Realtime Connections** : Devrait être plus stable
- **Storage** : Pas de changement majeur attendu
- **Edge Function Invocations** : Pas de changement attendu

### 3. **Logs en Temps Réel**
- Onglet "Logs" dans Supabase
- Filtrer par "Database" pour voir les requêtes
- Surveiller les patterns de requêtes

## 📊 Métriques Vercel

### 1. **Performance**
- **Core Web Vitals** : Devraient s'améliorer
- **Largest Contentful Paint (LCP)** : < 2.5s
- **First Input Delay (FID)** : < 100ms
- **Cumulative Layout Shift (CLS)** : < 0.1

### 2. **Analytics**
- **Page Views** : Pas de changement attendu
- **Session Duration** : Devrait augmenter (meilleure UX)
- **Bounce Rate** : Devrait baisser

## 🚨 Alertes à Configurer

### 1. **Supabase Alertes**
```sql
-- Alerte si trop de requêtes market_settings
SELECT 
  CASE 
    WHEN COUNT(*) > 100 THEN 'ALERTE: Trop de requêtes market_settings'
    ELSE 'OK'
  END as status
FROM pg_stat_statements 
WHERE query LIKE '%market_settings%'
AND calls > 50;
```

### 2. **Vercel Alertes**
- Configurer des alertes sur les erreurs 500+
- Surveiller les temps de réponse > 3s
- Alerter si le build échoue

## 📋 Checklist de Vérification

### **Jour 1 (Immédiat)**
- [ ] Vérifier que le build s'est bien passé
- [ ] Déployer sur Vercel
- [ ] Tester les fonctionnalités principales
- [ ] Vérifier les logs Supabase

### **Jour 2-3 (Court terme)**
- [ ] Comparer les métriques avec l'avant
- [ ] Vérifier la réduction des requêtes
- [ ] Tester avec plusieurs utilisateurs
- [ ] Surveiller les erreurs

### **Semaine 1 (Moyen terme)**
- [ ] Analyser les tendances de performance
- [ ] Vérifier l'impact sur les coûts
- [ ] Ajuster si nécessaire
- [ ] Documenter les améliorations

### **Mois 1 (Long terme)**
- [ ] Évaluer l'impact sur l'expérience utilisateur
- [ ] Analyser les métriques de rétention
- [ ] Planifier les optimisations futures
- [ ] Mettre à jour la documentation

## 🎯 Objectifs de Performance

### **Avant Optimisations**
```
Market Settings: 60+ requêtes simultanées
Realtime: 1029 appels/minute
Temps de réponse: 2-3 secondes
Coûts Supabase: Élevés
```

### **Après Optimisations (Objectifs)**
```
Market Settings: 1-2 requêtes (cache global)
Realtime: ~200 appels/minute
Temps de réponse: < 1 seconde
Coûts Supabase: -90%
```

## 🔧 Outils de Monitoring

### 1. **Supabase Dashboard**
- Métriques en temps réel
- Logs détaillés
- Alertes configurables

### 2. **Vercel Analytics**
- Performance des pages
- Métriques utilisateur
- Temps de réponse

### 3. **Browser DevTools**
- Network tab pour voir les requêtes
- Performance tab pour les métriques
- Console pour les erreurs

### 4. **Logs Personnalisés**
```typescript
// Ajouter dans le code pour tracer
console.log('📦 Cache global hit pour store', storeId);
console.log('🚫 Appel realtime ignoré - trop fréquent');
console.log('🌐 Requête globale market_settings pour store', storeId);
```

## ⚠️ Signaux d'Alerte

### **Rouge (Action Immédiate)**
- Augmentation des erreurs 500+
- Temps de réponse > 5 secondes
- Coûts Supabase qui augmentent
- Cache qui ne fonctionne pas

### **Orange (Surveillance)**
- Performance qui se dégrade lentement
- Cache hit rate < 80%
- Plus d'erreurs que d'habitude

### **Vert (Tout va bien)**
- Performance stable ou améliorée
- Cache hit rate > 90%
- Coûts qui baissent
- Utilisateurs satisfaits

## 📞 Actions en Cas de Problème

### 1. **Performance qui se dégrade**
- Vérifier les logs Supabase
- Analyser les requêtes lentes
- Ajuster les paramètres de cache

### 2. **Cache qui ne fonctionne pas**
- Vérifier les clés de cache
- Contrôler la validation multi-tenant
- Redémarrer l'application

### 3. **Coûts qui augmentent**
- Analyser les requêtes excessives
- Vérifier les polling intervals
- Optimiser davantage si nécessaire

## 🎉 Succès Criteria

### **Performance**
- ✅ Temps de chargement < 2 secondes
- ✅ Réduction de 90% des requêtes market_settings
- ✅ Réduction de 80% des appels realtime

### **Coûts**
- ✅ Réduction de 90% des coûts Supabase
- ✅ Facturation stable et prévisible

### **UX**
- ✅ Interface plus fluide
- ✅ Moins de loading states
- ✅ Navigation plus rapide

---

**📊 Ce guide vous permettra de surveiller efficacement l'impact des optimisations et d'ajuster si nécessaire.**
