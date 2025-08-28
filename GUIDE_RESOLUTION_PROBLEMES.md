# 🔧 Guide de Résolution des Problèmes d'Onboarding

## ✅ **Problèmes Identifiés et Solutions**

### 1. **Erreur `getCurrenciesForCountry is not a function`**
**Problème** : La fonction n'était pas exportée par le hook `useOnboarding`
**Solution** : ✅ **CORRIGÉ** - Ajout de la fonction dans le hook

### 2. **Colonne `sector` manquante dans la base de données**
**Problème** : La table `user_onboarding` n'avait pas la colonne `sector`
**Solution** : ✅ **CORRIGÉ** - Script `ADD_SECTOR_COLUMN.sql` créé

### 3. **Données de base manquantes (pays et devises)**
**Problème** : Les tables `supported_countries`, `supported_currencies`, `country_currencies` n'existent pas ou sont vides
**Solution** : Script `SETUP_BASE_DATA.sql` créé

## 🚀 **Étapes de Résolution**

### **Étape 1 : Exécuter le script de mise à jour de la base de données**

1. **Ouvrez votre dashboard Supabase**
2. **Allez dans l'éditeur SQL**
3. **Exécutez le script `SETUP_BASE_DATA.sql`**

Ce script va :
- ✅ Créer les tables manquantes
- ✅ Insérer les pays supportés
- ✅ Insérer les devises supportées
- ✅ Créer les relations pays-devises

### **Étape 2 : Vérifier que tout fonctionne**

Après avoir exécuté le script, testez l'onboarding :

1. **Connectez-vous** à votre compte
2. **Suivez les étapes** jusqu'à l'étape 4 (Configuration géographique)
3. **Sélectionnez un pays** - vous devriez voir les devises disponibles
4. **Sélectionnez une devise** - elle devrait être automatiquement proposée

## 🔍 **Vérifications à Faire**

### **Dans la console du navigateur (F12) :**

**Logs normaux attendus :**
```
🔄 Synchronisation des données d'onboarding: Object
✅ Sauvegarde réussie: true
➡️ Passage à l'étape suivante
```

**Pas d'erreurs :**
- ❌ `getCurrenciesForCountry is not a function`
- ❌ `400 (Bad Request)`
- ❌ `column "sector" does not exist`

### **Dans l'interface :**

1. **Étape 3 (Secteur)** : Sélection possible, passage à l'étape 4
2. **Étape 4 (Configuration géographique)** :
   - ✅ Liste des pays disponible
   - ✅ Sélection d'un pays fonctionne
   - ✅ Devises du pays s'affichent automatiquement
   - ✅ Sélection de devise fonctionne
   - ✅ Passage à l'étape 5

## 🎯 **Résultat Final Attendu**

Après les corrections, vous devriez avoir :

1. ✅ **5 étapes d'onboarding** qui fonctionnent parfaitement
2. ✅ **Sélection de secteur** qui sauvegarde correctement
3. ✅ **Configuration géographique** avec pays et devises dynamiques
4. ✅ **Résumé et création** de boutique fonctionnelle
5. ✅ **Deux options** : Validation complète ou démarrage à zéro

## 🚨 **Si les problèmes persistent**

### **Vérifiez dans Supabase :**

1. **Tables existantes :**
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_name IN ('user_onboarding', 'supported_countries', 'supported_currencies', 'country_currencies');
   ```

2. **Colonne sector :**
   ```sql
   SELECT column_name FROM information_schema.columns 
   WHERE table_name = 'user_onboarding' AND column_name = 'sector';
   ```

3. **Données de base :**
   ```sql
   SELECT COUNT(*) FROM supported_countries;
   SELECT COUNT(*) FROM supported_currencies;
   SELECT COUNT(*) FROM country_currencies;
   ```

### **Si les tables n'existent pas :**
Exécutez le script `SETUP_BASE_DATA.sql` dans Supabase.

### **Si les données sont vides :**
Le script `SETUP_BASE_DATA.sql` les créera automatiquement.

## 🎉 **L'onboarding devrait maintenant fonctionner parfaitement !**

Une fois ces étapes effectuées, l'onboarding sera complet et robuste avec :
- ✅ Gestion d'erreurs
- ✅ Données dynamiques
- ✅ Sauvegarde correcte
- ✅ Navigation fluide
- ✅ Création de boutique automatique

**Testez maintenant et dites-moi si tout fonctionne !** 🚀
