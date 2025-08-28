# 🌐 Guide de Configuration des Sous-domaines

## 🎯 **Objectif**
Séparer l'interface d'administration et les boutiques publiques avec des sous-domaines :
- **Admin :** `simpshopy.com` (interface de gestion)
- **Boutiques :** `[nom-boutique].simpshopy.com` (boutiques publiques)

## 📋 **Étapes de Configuration**

### **1. Configuration DNS (Cloudflare)**

#### **Option A : Wildcard (Recommandé)**
Ajoutez un enregistrement wildcard dans Cloudflare :

```
Type: CNAME
Nom: *
Valeur: simpshopy.com
Proxy: ✅ (Orange)
TTL: Auto
```

#### **Option B : Sous-domaines spécifiques**
Si vous préférez configurer manuellement :

```
Type: CNAME
Nom: *
Valeur: cname.vercel-dns-017.com
Proxy: ✅ (Orange)
TTL: Auto
```

### **2. Configuration Vercel**

#### **Vérifier les domaines :**
1. Aller dans votre dashboard Vercel
2. Sélectionner votre projet
3. Aller dans **Settings** → **Domains**
4. Vérifier que `simpshopy.com` est configuré
5. Le wildcard `*.simpshopy.com` devrait être automatiquement géré

### **3. Déploiement du Code**

#### **A. Appliquer la migration :**
```bash
# Dans votre terminal
supabase db push
```

#### **B. Déployer l'Edge Function :**
```bash
# Déployer la fonction domain-router
supabase functions deploy domain-router
```

#### **C. Déployer le frontend :**
```bash
# Déployer sur Vercel
git add .
git commit -m "Add subdomain routing system"
git push
```

### **4. Test du Système**

#### **A. Test en développement :**
```typescript
// Dans la console du navigateur
import { testSubdomainSystem } from './src/utils/testSubdomainSystem';
await testSubdomainSystem();
```

#### **B. Test en production :**
1. Créer une boutique dans l'admin
2. Vérifier que le sous-domaine est créé automatiquement
3. Tester l'accès : `[nom-boutique].simpshopy.com`

## 🔧 **Architecture Technique**

### **Flux de Routing :**

```
1. Utilisateur visite [boutique].simpshopy.com
2. Cloudflare redirige vers Vercel
3. Vercel sert l'application React
4. SubdomainRouter détecte le sous-domaine
5. Appel à l'Edge Function domain-router
6. Récupération des données de la boutique
7. Affichage du StorefrontRenderer
```

### **Composants Clés :**

#### **Frontend :**
- `SubdomainRouter.tsx` : Détecte admin vs storefront
- `StorefrontRenderer.tsx` : Affiche les boutiques publiques
- `App.tsx` : Intègre le routing

#### **Backend :**
- `domain-router` Edge Function : Gère le routing des domaines
- `store_domains` table : Stocke les domaines
- `get_store_by_domain()` function : Récupère les boutiques

## 🚨 **Dépannage**

### **Problème : Sous-domaine non accessible**
```bash
# Vérifier la configuration DNS
dig [boutique].simpshopy.com

# Vérifier les logs Vercel
vercel logs

# Tester l'Edge Function
curl -X POST https://[project].supabase.co/functions/v1/domain-router \
  -H "Content-Type: application/json" \
  -d '{"hostname": "[boutique].simpshopy.com"}'
```

### **Problème : Boutique non trouvée**
```sql
-- Vérifier les sous-domaines dans la base
SELECT * FROM store_domains WHERE domain_type = 'subdomain';

-- Vérifier les boutiques actives
SELECT id, name, slug, status FROM stores WHERE status = 'active';
```

### **Problème : Erreur Edge Function**
```bash
# Vérifier les logs Supabase
supabase functions logs domain-router

# Redéployer la fonction
supabase functions deploy domain-router
```

## 📊 **Monitoring**

### **Logs à surveiller :**
- **Vercel :** Accès aux sous-domaines
- **Supabase :** Appels à l'Edge Function
- **Frontend :** Erreurs de routing

### **Métriques importantes :**
- Nombre de sous-domaines actifs
- Temps de réponse de l'Edge Function
- Erreurs 404 sur les sous-domaines

## 🔒 **Sécurité**

### **Politiques RLS :**
- Seuls les propriétaires peuvent gérer leurs domaines
- Lecture publique pour le routing
- Vérification des domaines actifs uniquement

### **Validation :**
- Vérification du format des sous-domaines
- Protection contre les injections
- Limitation des tentatives d'accès

## 🚀 **Optimisations**

### **Performance :**
- Cache des données de boutique
- Lazy loading des composants
- Optimisation des requêtes

### **SEO :**
- Meta tags dynamiques par boutique
- Sitemap par sous-domaine
- Canonical URLs

## 📞 **Support**

En cas de problème :
1. Vérifier les logs Vercel et Supabase
2. Tester avec l'utilitaire `testSubdomainSystem`
3. Vérifier la configuration DNS
4. Contacter l'équipe technique

---

**✅ Le système de sous-domaines est maintenant opérationnel !**
