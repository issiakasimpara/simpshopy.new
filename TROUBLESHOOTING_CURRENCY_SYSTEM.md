# 🔧 Guide de résolution des problèmes - Système de conversion de devises

## ❌ Erreur 500 sur l'Edge Function

### Problème
L'Edge Function retourne une erreur 500 (Erreur interne du serveur).

### Solutions

#### 1. Vérifier que la table `currency_rates` existe

Exécutez cette requête SQL dans l'éditeur Supabase :

```sql
-- Vérifier si la table existe
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'currency_rates'
) as table_exists;
```

**Si la table n'existe pas :**
1. Exécutez le script `CREATE_CURRENCY_RATES_TABLE.sql` dans l'éditeur SQL de Supabase
2. Vérifiez qu'il n'y a pas d'erreurs lors de l'exécution

#### 2. Vérifier les logs de l'Edge Function

1. Allez dans le Dashboard Supabase
2. Cliquez sur **"Edge Functions"**
3. Cliquez sur **"update-currency-rates"**
4. Cliquez sur **"Logs"** pour voir les erreurs détaillées

#### 3. Test manuel de l'API fixer.io

Testez si l'API fixer.io fonctionne :

```bash
curl "http://data.fixer.io/api/latest?access_key=aeea9d39ca828842e353d966234c7b7&base=EUR&symbols=XOF,USD,EUR"
```

**Si l'API ne fonctionne pas :**
- Vérifiez que la clé API est correcte
- Vérifiez que vous n'avez pas dépassé les limites de l'API

#### 4. Test simplifié de l'Edge Function

Créez une version simplifiée pour tester :

```typescript
// Test simple sans API externe
serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Test simple : insérer un taux de test
    const { data, error } = await supabaseClient
      .from('currency_rates')
      .upsert({
        base_currency: 'XOF',
        target_currency: 'EUR',
        rate: 0.00152
      })

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Test successful' }),
      { headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

## 📋 Étapes de résolution complètes

### Étape 1 : Créer la table
```sql
-- Exécutez ce script dans l'éditeur SQL de Supabase
-- Contenu du fichier CREATE_CURRENCY_RATES_TABLE.sql
```

### Étape 2 : Vérifier les permissions RLS
```sql
-- Vérifier les politiques RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'currency_rates';
```

### Étape 3 : Tester l'Edge Function
```bash
# Test avec curl
curl -X POST \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  https://grutldacuowplosarucp.supabase.co/functions/v1/update-currency-rates
```

### Étape 4 : Vérifier les variables d'environnement
Dans le Dashboard Supabase :
1. Allez dans **"Settings"** > **"Edge Functions"**
2. Vérifiez que `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` sont définis

## 🔄 Solutions alternatives

### Option A : Utiliser une API différente
Si fixer.io ne fonctionne pas, utilisez une API gratuite alternative :

```typescript
// API gratuite alternative
const apiUrl = 'https://api.exchangerate-api.com/v4/latest/EUR'
```

### Option B : Taux statiques temporaires
En attendant, utilisez des taux statiques :

```sql
-- Insérer des taux de base
INSERT INTO currency_rates (base_currency, target_currency, rate) VALUES
  ('XOF', 'EUR', 0.00152),
  ('XOF', 'USD', 0.00167),
  ('EUR', 'XOF', 657.89),
  ('USD', 'XOF', 598.80)
ON CONFLICT (base_currency, target_currency) 
DO UPDATE SET rate = EXCLUDED.rate;
```

### Option C : Test manuel de conversion
```sql
-- Test de conversion manuelle
SELECT 
  1000 as montant_original,
  'XOF' as devise_origine,
  'EUR' as devise_cible,
  1000 * 0.00152 as montant_converti;
```

## ✅ Vérification finale

Après résolution, testez :

1. **Table créée :**
   ```sql
   SELECT COUNT(*) FROM currency_rates;
   ```

2. **Edge Function fonctionne :**
   ```bash
   curl -X POST [URL_EDGE_FUNCTION]
   ```

3. **Conversion fonctionne :**
   ```sql
   SELECT convert_currency(1000, 'XOF', 'EUR');
   ```

## 📞 Support

Si les problèmes persistent :
1. Vérifiez les logs Supabase
2. Testez avec une API différente
3. Utilisez des taux statiques temporairement
