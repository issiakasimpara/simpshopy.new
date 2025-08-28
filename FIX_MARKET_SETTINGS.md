# 🔧 Guide de résolution - Table market_settings manquante

## 🚨 Problème identifié
La table `market_settings` n'existe pas dans votre base de données Supabase, ce qui cause des erreurs 406 (Not Acceptable) lors des requêtes de devise.

## ✅ Solution

### Étape 1 : Accéder à votre base de données Supabase
1. Connectez-vous à votre dashboard Supabase
2. Allez dans **Table Editor** ou **SQL Editor**
3. Ouvrez l'éditeur SQL

### Étape 2 : Exécuter le script de création
1. Copiez le contenu du fichier `CREATE_MARKET_SETTINGS_MANUAL.sql`
2. Collez-le dans l'éditeur SQL de Supabase
3. Cliquez sur **Run** pour exécuter le script

### Étape 3 : Vérifier la création
Après l'exécution, vous devriez voir :
```
✅ Table market_settings créée avec succès
nombre_boutiques_configurees: 1
```

## 🔍 Vérification

### Dans l'interface Supabase :
1. Allez dans **Table Editor**
2. Vous devriez voir la table `market_settings` dans la liste
3. Cliquez dessus pour voir sa structure

### Dans votre application :
1. Rechargez la page
2. Les erreurs 406 devraient disparaître
3. La devise devrait se charger correctement

## 📊 Structure de la table créée

```sql
market_settings (
  id UUID PRIMARY KEY,
  store_id UUID REFERENCES stores(id),
  default_currency VARCHAR(3) DEFAULT 'XOF',
  enabled_currencies TEXT[],
  enabled_countries TEXT[],
  currency_format VARCHAR(50),
  decimal_places INTEGER,
  exchange_rates JSONB,
  auto_currency_detection BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

## 🛡️ Sécurité
- RLS (Row Level Security) activé
- Politiques de sécurité configurées
- Seuls les propriétaires des boutiques peuvent accéder à leurs paramètres

## 🚀 Après la création
Une fois la table créée :
- ✅ Les erreurs 406 disparaîtront
- ✅ La gestion des devises fonctionnera correctement
- ✅ Les conversions automatiques seront disponibles
- ✅ Les paramètres de devise seront persistants

## 📝 Notes importantes
- Cette table est essentielle pour la gestion des devises
- Elle est automatiquement liée aux boutiques existantes
- Les données par défaut sont configurées pour l'Afrique de l'Ouest
- La table est optimisée avec des index pour les performances
