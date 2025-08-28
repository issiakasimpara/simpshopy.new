# 🌐 GUIDE DE CONFIGURATION DES DOMAINES

## 📋 PRÉREQUIS

### 1. Configuration Vercel ✅ (Déjà fait)
- ✅ Project ID configuré
- ✅ Token Vercel configuré

### 2. Configuration Cloudflare (Optionnel mais recommandé)
Pour une configuration automatique des DNS, ajoutez ces variables :

```bash
# Dans votre fichier .env
VITE_CLOUDFLARE_TOKEN=your_cloudflare_token
VITE_CLOUDFLARE_ZONE_ID=your_cloudflare_zone_id
```

## 🔧 CONFIGURATION CLOUDFLARE

### Étape 1 : Obtenir le Token Cloudflare
1. Allez sur https://dash.cloudflare.com/profile/api-tokens
2. Cliquez sur "Create Token"
3. Sélectionnez "Custom token"
4. Permissions nécessaires :
   - Zone:Zone:Read
   - Zone:DNS:Edit
5. Resources : Include: All zones
6. Copiez le token généré

### Étape 2 : Obtenir le Zone ID
1. Dans Cloudflare, sélectionnez votre domaine
2. Allez dans "Overview"
3. Copiez le "Zone ID" (32 caractères)

## 🚀 TEST DU SYSTÈME

### 1. Exécuter le script SQL
```sql
-- Exécutez ce script dans Supabase SQL Editor
ALTER TABLE custom_domains 
ADD COLUMN IF NOT EXISTS dns_configured BOOLEAN DEFAULT FALSE;

UPDATE custom_domains 
SET dns_configured = verified 
WHERE dns_configured IS NULL;
```

### 2. Tester l'ajout de domaine
1. Allez dans votre application
2. Onglet "Configuration" → "Domaines"
3. Ajoutez un domaine (ex: test.mon-domaine.com)
4. Le système va automatiquement :
   - ✅ Ajouter le domaine sur Vercel
   - ✅ Configurer les DNS sur Cloudflare
   - ✅ Vérifier que tout fonctionne

## 🔍 VÉRIFICATION

### Test automatique
Le système vérifie automatiquement :
- ✅ Résolution DNS
- ✅ Configuration SSL
- ✅ Accessibilité du domaine

### Test manuel
1. Allez sur `/test-domains`
2. Entrez votre domaine
3. Cliquez sur "Vérifier"

## 🛠️ CONFIGURATION MANUELLE (si automatique échoue)

### Vercel
1. Dashboard Vercel → Votre projet
2. Settings → Domains
3. Ajoutez votre domaine
4. Suivez les instructions DNS

### Cloudflare
1. DNS → Records
2. Ajoutez un enregistrement CNAME :
   - Nom : votre-domaine.com
   - Cible : simpshopy.com
   - Proxy : Activé (orange)

## 📊 MONITORING

Le système surveille :
- ✅ Temps de réponse des domaines
- ✅ Statut SSL
- ✅ Configuration DNS
- ✅ Erreurs de résolution

## 🆘 DÉPANNAGE

### Erreur "Could not find the 'dns_configured' column"
```sql
-- Exécutez ce script
ALTER TABLE custom_domains 
ADD COLUMN IF NOT EXISTS dns_configured BOOLEAN DEFAULT FALSE;
```

### Domaine ne se vérifie pas
1. Vérifiez la configuration DNS
2. Attendez 5-10 minutes pour la propagation
3. Utilisez `/test-domains` pour diagnostiquer

### Erreur Vercel/Cloudflare
1. Vérifiez les tokens dans `.env`
2. Vérifiez les permissions des tokens
3. Testez manuellement l'API

## 🎯 RÉSULTAT ATTENDU

Après configuration, vous devriez avoir :
- ✅ Domaine ajouté automatiquement sur Vercel
- ✅ DNS configuré automatiquement sur Cloudflare
- ✅ SSL activé automatiquement
- ✅ Domaine accessible en temps réel
- ✅ Boutique accessible via votre domaine personnalisé

**Testez maintenant avec un vrai domaine !** 🚀 