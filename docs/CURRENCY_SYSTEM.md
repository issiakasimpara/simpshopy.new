# 💰 Système de Devise Multi-Boutique

## 📋 Vue d'ensemble

Le système de devise permet à chaque boutique d'avoir sa propre devise, choisie lors de l'onboarding et modifiable dans les paramètres. L'application supporte plusieurs devises africaines et internationales.

## 🎯 Fonctionnalités

### ✅ Implémentées
- **Une devise par boutique** : Chaque boutique a sa propre devise
- **Choix lors de l'onboarding** : La devise choisie est sauvegardée
- **Modification dans les paramètres** : Possibilité de changer la devise
- **Support multi-devises** : XOF, XAF, GHS, NGN, EUR, USD
- **Formatage automatique** : Les prix s'affichent selon la devise de la boutique
- **Composant réutilisable** : `FormattedPrice` pour remplacer les "CFA" en dur

### 🔄 Flux utilisateur
1. **Onboarding** : L'utilisateur choisit sa devise
2. **Sauvegarde** : La devise est sauvegardée dans `market_settings`
3. **Affichage** : Tous les prix utilisent la devise de la boutique
4. **Modification** : L'utilisateur peut changer sa devise dans les paramètres

## 🏗️ Architecture

### Base de données
```sql
-- Table market_settings
CREATE TABLE market_settings (
  id UUID PRIMARY KEY,
  store_id UUID NOT NULL,
  default_currency TEXT NOT NULL DEFAULT 'XOF',
  enabled_countries TEXT[] NOT NULL DEFAULT '{}',
  tax_settings JSONB DEFAULT '{"includeTax": false, "taxRate": 0, "taxLabel": "TVA"}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(store_id)
);
```

### Services
- **`StoreCurrencyService`** : Gestion des devises de boutique
- **`useStoreCurrency`** : Hook React pour utiliser les devises
- **`FormattedPrice`** : Composant pour afficher les prix

## 📁 Structure des fichiers

```
src/
├── services/
│   └── storeCurrencyService.ts     # Service de gestion des devises
├── hooks/
│   └── useStoreCurrency.tsx        # Hook React pour les devises
├── components/
│   ├── ui/
│   │   └── FormattedPrice.tsx      # Composant prix formaté
│   └── settings/
│       └── sections/
│           └── CurrencySection.tsx # Section devise dans les paramètres
├── utils/
│   ├── formatCurrency.ts           # Utilitaires de formatage
│   └── testCurrencySystem.ts       # Tests du système
└── pages/
    └── Settings.tsx                # Page paramètres (modifiée)

supabase/
└── migrations/
    └── 20250128_initialize_store_currencies.sql
```

## 🚀 Utilisation

### 1. Dans un composant React
```tsx
import { FormattedPrice } from '@/components/ui/FormattedPrice';

// Prix avec devise de la boutique
<FormattedPrice amount={15000} storeId={product.store_id} />

// Prix avec devise spécifique
<FormattedPrice amount={15000} currency="USD" />
```

### 2. Avec le hook
```tsx
import { useStoreCurrency } from '@/hooks/useStoreCurrency';

const { currency, formatPrice, updateCurrency } = useStoreCurrency(storeId);

// Formater un prix
const formattedPrice = formatPrice(15000);

// Changer la devise
await updateCurrency('USD');
```

### 3. Dans l'onboarding
```tsx
// La devise est automatiquement initialisée lors de la finalisation
const { initializeCurrency } = useStoreCurrency(storeId);
await initializeCurrency('EUR', ['FR', 'BE']);
```

## 💱 Devises supportées

| Code | Symbole | Nom | Pays |
|------|---------|-----|------|
| XOF | CFA | Franc CFA (BCEAO) | BF, CI, ML, NE, SN, TG |
| XAF | FCFA | Franc CFA (BEAC) | CM, CF, TD, CG, GA, GQ |
| GHS | ₵ | Cedi ghanéen | GH |
| NGN | ₦ | Naira nigérian | NG |
| EUR | € | Euro | EU |
| USD | $ | Dollar américain | US |

## 🔧 Migration

### Pour les boutiques existantes
```sql
-- Migration automatique
INSERT INTO market_settings (store_id, default_currency, enabled_countries)
SELECT 
  s.id as store_id,
  'XOF' as default_currency,
  ARRAY['ML', 'CI', 'SN', 'BF'] as enabled_countries
FROM stores s
WHERE NOT EXISTS (
  SELECT 1 FROM market_settings ms WHERE ms.store_id = s.id
);
```

### Exécuter la migration
```bash
# Via Supabase CLI
supabase db push

# Ou manuellement
psql -d your_database -f supabase/migrations/20250128_initialize_store_currencies.sql
```

## 🧪 Tests

### Tester le système
```typescript
import { testCurrencySystem } from '@/utils/testCurrencySystem';

// Exécuter les tests
await testCurrencySystem();

// Voir les statistiques
await showCurrencyStats();
```

### Tests manuels
1. **Créer une boutique** : Vérifier que la devise est initialisée
2. **Changer la devise** : Dans les paramètres → Devise
3. **Vérifier l'affichage** : Les prix doivent utiliser la nouvelle devise
4. **Test multi-boutiques** : Chaque boutique doit avoir sa propre devise

## 🔄 Remplacement des "CFA" en dur

### Avant
```tsx
<span>{formatPrice(15000)} CFA</span>
```

### Après
```tsx
<FormattedPrice amount={15000} storeId={product.store_id} />
```

### Fichiers à modifier
- `src/components/products/ProductCard.tsx` ✅
- `src/components/analytics/SalesChart.tsx`
- `src/components/dashboard/DashboardStats.tsx`
- `src/components/payments/TransactionsList.tsx`
- `src/pages/Checkout.tsx`
- Et tous les autres composants affichant des prix

## ⚠️ Points d'attention

### 1. Performance
- Les requêtes de devise sont mises en cache avec React Query
- Le stale time est de 5 minutes
- Les mutations invalident automatiquement le cache

### 2. Sécurité
- RLS activé sur `market_settings`
- Seuls les propriétaires peuvent modifier leur devise
- Lecture publique pour l'affichage

### 3. Compatibilité
- Fallback vers XOF si pas de devise configurée
- Support des devises existantes
- Migration automatique des boutiques existantes

### 4. UX
- Avertissement lors du changement de devise
- Aperçu de la nouvelle devise avant confirmation
- Loading states pendant les mises à jour

## 🎯 Prochaines étapes

### Phase 2 (Optionnel)
- [ ] Conversion automatique des prix existants
- [ ] Historique des changements de devise
- [ ] Devises multiples par produit (si demandé)
- [ ] API de taux de change en temps réel
- [ ] Devises cryptographiques

### Phase 3 (Avancé)
- [ ] Devises par pays de livraison
- [ ] Devises par méthode de paiement
- [ ] Devises saisonnières
- [ ] Devises promotionnelles

## 📞 Support

Pour toute question sur le système de devise :
1. Vérifier la documentation
2. Consulter les tests
3. Vérifier les logs de migration
4. Contacter l'équipe technique

---

**Note** : Ce système remplace complètement l'ancien système "CFA uniquement" et rend l'application vraiment multi-devise par boutique.
