# 🌐 Architecture de Routage Basée sur les Domaines

## 📋 Vue d'ensemble

Simpshopy utilise maintenant une architecture de routage basée sur les domaines pour séparer clairement les interfaces publiques et administratives :

- **`simpshopy.com`** : Site public et authentification
- **`admin.simpshopy.com`** : Interface administrative (protégée)

## 🏗️ Structure des Domaines

### 1. **simpshopy.com** (Domaine Principal)
**Accès :** Public
**Fonction :** Site vitrine et authentification

#### Pages Accessibles :
- ✅ **Pages publiques** : `/`, `/features`, `/pricing`, `/about`, etc.
- ✅ **Authentification** : `/auth` (login/register)
- ✅ **E-commerce public** : `/store/:slug`, `/cart`, `/checkout`
- ❌ **Pages admin** : Redirigées vers `admin.simpshopy.com`

### 2. **admin.simpshopy.com** (Sous-domaine Admin)
**Accès :** Authentification obligatoire
**Fonction :** Interface administrative complète

#### Pages Accessibles :
- ✅ **Dashboard** : `/dashboard`, `/analytics`, `/products`, etc.
- ✅ **Onboarding** : `/onboarding`
- ✅ **Configuration** : `/settings`, `/site-builder`, etc.
- ❌ **Pages publiques** : Redirigées vers `simpshopy.com`

## 🔧 Composants Principaux

### 1. **DomainBasedRouter** (`src/components/DomainBasedRouter.tsx`)
**Rôle :** Gestionnaire principal du routage basé sur les domaines

**Fonctionnalités :**
- Détection automatique du domaine
- Redirection intelligente selon l'état de l'utilisateur
- Protection des routes inappropriées

```typescript
// Exemple d'utilisation
<DomainBasedRouter>
  <Routes>
    {/* Toutes les routes de l'application */}
  </Routes>
</DomainBasedRouter>
```

### 2. **PublicRouteGuard** (`src/components/PublicRouteGuard.tsx`)
**Rôle :** Protection des routes publiques

**Fonctionnalités :**
- Empêche l'accès aux pages publiques sur `admin.simpshopy.com`
- Redirige automatiquement vers le domaine principal

```typescript
// Exemple d'utilisation
<Route path="/features" element={
  <PublicRouteGuard>
    <Features />
  </PublicRouteGuard>
} />
```

### 3. **AdminRouteGuard** (`src/components/AdminRouteGuard.tsx`)
**Rôle :** Protection des routes administratives

**Fonctionnalités :**
- Vérification de l'authentification
- Redirection vers la connexion si non authentifié
- Protection contre l'accès aux routes admin sur le domaine principal

### 4. **SmartNavigationButton** (`src/components/SmartNavigationButton.tsx`)
**Rôle :** Boutons de navigation intelligents

**Fonctionnalités :**
- Redirection automatique selon le domaine et l'état de l'utilisateur
- Gestion des cas d'onboarding
- Navigation fluide entre les domaines

```typescript
// Exemple d'utilisation
<SmartNavigationButton className="btn-primary">
  {user ? 'Mon Dashboard' : 'Commencer'}
</SmartNavigationButton>
```

## 🔄 Logique de Redirection

### Connexion Utilisateur
1. **Utilisateur non connecté** → `/auth` sur `simpshopy.com`
2. **Connexion réussie** → Redirection vers `admin.simpshopy.com/onboarding`
3. **Onboarding terminé** → `admin.simpshopy.com/dashboard`

### Navigation Intelligente
1. **Utilisateur connecté sur simpshopy.com** → Redirection automatique vers admin
2. **Utilisateur non connecté sur admin.simpshopy.com** → Redirection vers simpshopy.com/auth
3. **Accès direct à une route admin** → Vérification d'authentification

### Déconnexion
- **Déconnexion depuis admin.simpshopy.com** → Redirection vers `simpshopy.com`

## 🛡️ Sécurité

### Protection des Routes
- **Routes publiques** : Accessibles uniquement sur `simpshopy.com`
- **Routes admin** : Accessibles uniquement sur `admin.simpshopy.com` avec authentification
- **Authentification** : Accessible sur les deux domaines

### Vérifications Automatiques
- Détection du domaine au chargement
- Vérification de l'authentification pour les routes protégées
- Redirection automatique en cas d'accès non autorisé

## 🚀 Déploiement

### Configuration Vercel
1. **Domaine principal** : `simpshopy.com`
2. **Sous-domaine** : `admin.simpshopy.com`
3. **Même application** : Les deux domaines pointent vers la même app Vercel

### Variables d'Environnement
```env
# Supabase (requis pour les deux domaines)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Autres configurations
VITE_APP_ENV=production
```

## 🔍 Développement Local

### Mode Développement
- **localhost** : Toutes les fonctionnalités disponibles
- **Pas de redirection** : Navigation libre entre les "domaines"
- **Debugging** : Logs détaillés pour le développement

### Test des Domaines
```bash
# Test du domaine principal
npm run dev

# Test du sous-domaine admin (simulation)
# Modifier le hostname dans le code pour tester
```

## 📝 Logs et Debugging

### Logs de Routage
```javascript
// Logs automatiques pour le debugging
console.log('🔍 DomainBasedRouter - Checking:', { hostname, pathname });
console.log('🔒 Unauthorized access to admin - redirecting to main site');
console.log('🔄 Admin route accessed on main domain - redirecting to admin domain');
```

### Monitoring
- Vérification des redirections
- Suivi des erreurs d'authentification
- Monitoring des performances de routage

## 🎯 Avantages

### Sécurité
- ✅ Séparation claire des interfaces
- ✅ Protection automatique des routes
- ✅ Authentification obligatoire pour l'admin

### UX
- ✅ Navigation intuitive
- ✅ Redirections intelligentes
- ✅ Expérience utilisateur fluide

### Maintenance
- ✅ Code modulaire et réutilisable
- ✅ Logique centralisée
- ✅ Facilité de débogage

## 🔮 Évolutions Futures

### Fonctionnalités Prévues
- [ ] Support des domaines personnalisés
- [ ] Cache de routage pour les performances
- [ ] Analytics de navigation entre domaines
- [ ] Gestion des sessions multi-domaines

### Optimisations
- [ ] Préchargement des domaines
- [ ] Compression des redirections
- [ ] Cache intelligent des états d'authentification
