# 🔍 Diagnostic complet - Système de conversion de devises

## 📊 État actuel

✅ **Table `currency_rates`** : Existe et contient des données  
✅ **Extensions** : `pg_cron` et `http` sont activées  
❌ **Edge Function** : Retourne une erreur 500  

## 🔧 Étapes de diagnostic

### 1. Vérifier les variables d'environnement

Dans le Dashboard Supabase :
1. Allez dans **"Settings"** > **"Edge Functions"**
2. Vérifiez que ces variables sont définies :
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

### 2. Vérifier les logs de l'Edge Function

1. Allez dans **"Edge Functions"**
2. Cliquez sur **"update-currency-rates"**
3. Cliquez sur **"Logs"**
4. Regardez les erreurs détaillées

### 3. Test de l'API fixer.io

Exécutez cette requête dans l'éditeur SQL :

```sql
-- Test de l'API fixer.io
SELECT
  net.http_get(
    url := 'http://data.fixer.io/api/latest?access_key=aeea9d39ca828842e353d966234c7b7&base=EUR&symbols=XOF,USD,EUR'
  ) AS response;
```

### 4. Test de connexion à la base

Exécutez cette requête pour vérifier l'accès :

```sql
-- Test d'accès à la table
SELECT COUNT(*) FROM currency_rates;

-- Test des fonctions
SELECT convert_currency(1000, 'XOF', 'EUR');
```

## 🚀 Solutions alternatives

### Option A : Utiliser le Scheduler directement

Exécutez le script `SETUP_SCHEDULER_FINAL.sql` dans l'éditeur SQL.

### Option B : Utiliser GitHub Actions

Le fichier `.github/workflows/update-currency-rates.yml` est déjà configuré.

### Option C : Taux statiques temporaires

En attendant, utilisez des taux statiques :

```sql
-- Mettre à jour les taux manuellement
UPDATE currency_rates 
SET rate = CASE 
  WHEN base_currency = 'XOF' AND target_currency = 'EUR' THEN 0.00152
  WHEN base_currency = 'XOF' AND target_currency = 'USD' THEN 0.00167
  WHEN base_currency = 'EUR' AND target_currency = 'XOF' THEN 657.89
  WHEN base_currency = 'USD' AND target_currency = 'XOF' THEN 598.80
  ELSE rate
END
WHERE (base_currency, target_currency) IN 
  (('XOF', 'EUR'), ('XOF', 'USD'), ('EUR', 'XOF'), ('USD', 'XOF'));
```

## ✅ Vérification finale

Après résolution, testez :

1. **Conversion fonctionne :**
   ```sql
   SELECT convert_currency(1000, 'XOF', 'EUR');
   ```

2. **Application fonctionne :**
   - Changez la devise d'un store
   - Vérifiez que les prix se convertissent automatiquement

## 🎯 Prochaines étapes

1. **Exécutez le script SQL** `SETUP_SCHEDULER_FINAL.sql`
2. **Vérifiez les logs** de l'Edge Function
3. **Testez l'application** avec différentes devises

Le système de conversion est déjà intégré dans l'application, même si l'Edge Function ne fonctionne pas encore.
