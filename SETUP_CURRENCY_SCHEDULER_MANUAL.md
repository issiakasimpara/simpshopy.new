# 🕐 Configuration manuelle du Supabase Scheduler

## ⚠️ Problème avec pg_cron

L'extension `pg_cron` nécessite des privilèges administrateur et n'est pas disponible dans tous les projets Supabase. Voici comment configurer le Scheduler manuellement via le Dashboard.

## 📋 Étapes à suivre

### 1. Accéder au Dashboard Supabase

1. Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet `grutldacuowplosarucp`
3. Dans le menu de gauche, cliquez sur **"Database"**

### 2. Configurer le Scheduler via l'interface

1. Dans la section **"Database"**, cliquez sur **"Scheduler"** (ou cherchez dans les onglets)
2. Cliquez sur **"Create a new scheduled function"**

### 3. Créer le job quotidien

**Nom du job :** `update-currency-rates-daily`

**Schedule (CRON) :** `0 6 * * *` (Tous les jours à 6h00 UTC)

**SQL Query :**
```sql
SELECT
  net.http_post(
    url := 'https://grutldacuowplosarucp.supabase.co/functions/v1/update-currency-rates',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdydXRsZGFjdW93cGxvc2FydWNwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MjA2NDY2NjE2MX0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8"}',
    body := '{}'
  ) AS request_id;
```

### 4. Créer le job de test (optionnel)

**Nom du job :** `update-currency-rates-test`

**Schedule (CRON) :** `0 * * * *` (Toutes les heures)

**SQL Query :** (même que ci-dessus)

## 🔧 Alternative : Utiliser l'Edge Function directement

Si le Scheduler n'est pas disponible, vous pouvez :

### Option A : Appel manuel quotidien
- Appeler l'Edge Function manuellement chaque jour
- URL : `https://grutldacuowplosarucp.supabase.co/functions/v1/update-currency-rates`

### Option B : Utiliser un service externe
- [Cron-job.org](https://cron-job.org) (gratuit)
- [EasyCron](https://www.easycron.com) (gratuit)
- [UptimeRobot](https://uptimerobot.com) (gratuit)

### Option C : Utiliser GitHub Actions
Créer un fichier `.github/workflows/update-currency-rates.yml` :

```yaml
name: Update Currency Rates

on:
  schedule:
    - cron: '0 6 * * *'  # Tous les jours à 6h00 UTC
  workflow_dispatch:  # Permet l'exécution manuelle

jobs:
  update-rates:
    runs-on: ubuntu-latest
    steps:
      - name: Call Supabase Edge Function
        run: |
          curl -X POST \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}" \
            -H "Content-Type: application/json" \
            https://grutldacuowplosarucp.supabase.co/functions/v1/update-currency-rates
```

## ✅ Vérification

Après configuration, testez le système :

1. **Test manuel de l'Edge Function :**
   ```bash
   curl -X POST \
     -H "Authorization: Bearer YOUR_ANON_KEY" \
     -H "Content-Type: application/json" \
     https://grutldacuowplosarucp.supabase.co/functions/v1/update-currency-rates
   ```

2. **Vérifier les taux dans la base :**
   ```sql
   SELECT COUNT(*) as nombre_taux FROM currency_rates;
   SELECT base_currency, target_currency, rate, last_updated 
   FROM currency_rates 
   ORDER BY last_updated DESC LIMIT 10;
   ```

## 🎯 Résultat attendu

- ✅ Taux de change mis à jour quotidiennement
- ✅ Support de toutes les devises du monde (~170 devises)
- ✅ Conversion automatique lors du changement de devise
- ✅ Système économique et fiable

## 📞 Support

Si vous rencontrez des problèmes avec le Scheduler, utilisez l'**Option C (GitHub Actions)** qui est la plus fiable et gratuite.
