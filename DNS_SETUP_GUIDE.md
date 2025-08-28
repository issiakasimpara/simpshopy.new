# 🌐 GUIDE CONFIGURATION DNS CLOUDFLARE - SOUS-DOMAINES

## 🎯 **Objectif**
Configurer Cloudflare pour que tous les sous-domaines `*.simpshopy.com` pointent vers votre application Vercel.

---

## 🔧 **ÉTAPE 1 : ACCÉDER À CLOUDFLARE**

### **1. Connexion**
1. Allez sur https://dash.cloudflare.com
2. Connectez-vous à votre compte
3. Sélectionnez le domaine `simpshopy.com`

### **2. Navigation**
1. Cliquez sur **"DNS"** dans le menu de gauche
2. Cliquez sur **"Records"**

---

## 📝 **ÉTAPE 2 : CONFIGURER LES ENREGISTREMENTS DNS**

### **A. Enregistrement CNAME Wildcard (CRITIQUE)**

```
Type: CNAME
Nom: *
Valeur: simpshopy.com
Proxy: ✅ (Orange)
TTL: Auto
Commentaire: Wildcard pour tous les sous-domaines
```

**Explication :**
- `*` = Tous les sous-domaines (`bestboutique.simpshopy.com`, `maboutique.simpshopy.com`, etc.)
- `simpshopy.com` = Redirige vers votre domaine principal
- `Proxy: ✅` = Active la protection Cloudflare

### **B. Enregistrement A pour le domaine principal (si pas déjà fait)**

```
Type: A
Nom: @
Valeur: 76.76.19.36
Proxy: ✅ (Orange)
TTL: Auto
Commentaire: Domaine principal vers Vercel
```

**Note :** L'IP `76.76.19.36` est l'IP de Vercel. Si vous avez une IP différente, utilisez celle-ci.

### **C. Enregistrement CNAME pour www (optionnel)**

```
Type: CNAME
Nom: www
Valeur: simpshopy.com
Proxy: ✅ (Orange)
TTL: Auto
Commentaire: Redirection www vers domaine principal
```

---

## 🔒 **ÉTAPE 3 : CONFIGURATION SSL/TLS**

### **1. Paramètres SSL/TLS**
1. Cliquez sur **"SSL/TLS"** dans le menu
2. Dans **"Overview"**, sélectionnez :
   - **Mode :** `Full` ou `Full (strict)`
   - **Always Use HTTPS :** ✅ Activé

### **2. Paramètres Edge Certificates**
1. Cliquez sur **"Edge Certificates"**
2. Activez :
   - ✅ **Always Use HTTPS**
   - ✅ **Minimum TLS Version :** 1.2
   - ✅ **Opportunistic Encryption**
   - ✅ **TLS 1.3**
   - ✅ **Automatic HTTPS Rewrites**

---

## ⚡ **ÉTAPE 4 : RÈGLES DE TRANSFORMATION**

### **1. Règle de redirection www**
1. Allez dans **"Rules"** → **"Transform Rules"**
2. Cliquez sur **"Create Transform Rule"**
3. Configurez :
   ```
   Name: Redirect www to apex
   When incoming requests match: Hostname equals www.simpshopy.com
   Then: Redirect to 301 https://simpshopy.com$1
   ```

### **2. Règle de sécurité pour les sous-domaines**
1. Créez une autre règle :
   ```
   Name: Subdomain security headers
   When incoming requests match: Hostname matches *.simpshopy.com
   Then: Set dynamic (HTTP Response Headers)
   - X-Frame-Options: DENY
   - X-Content-Type-Options: nosniff
   ```

---

## 🧪 **ÉTAPE 5 : TESTS DE VALIDATION**

### **1. Test DNS**
```bash
# Test du domaine principal
nslookup simpshopy.com

# Test d'un sous-domaine
nslookup bestboutique.simpshopy.com

# Test avec dig (si disponible)
dig bestboutique.simpshopy.com
```

### **2. Test de propagation**
1. Allez sur https://www.whatsmydns.net/
2. Entrez `bestboutique.simpshopy.com`
3. Vérifiez que tous les serveurs DNS montrent la même IP

### **3. Test de connectivité**
```bash
# Test HTTP
curl -I http://bestboutique.simpshopy.com

# Test HTTPS
curl -I https://bestboutique.simpshopy.com
```

---

## 🚀 **ÉTAPE 6 : DÉPLOIEMENT FRONTEND**

### **1. Commit et push**
```bash
git add .
git commit -m "Add subdomain routing system and fix CSP"
git push
```

### **2. Vérification Vercel**
1. Allez sur https://vercel.com/dashboard
2. Vérifiez que le déploiement est réussi
3. Testez `simpshopy.com` (interface admin)

---

## 🎯 **ÉTAPE 7 : TEST FINAL**

### **URLs à tester :**
- ✅ `https://simpshopy.com` → Interface admin
- ✅ `https://bestboutique.simpshopy.com` → Boutique publique
- ✅ `https://www.simpshopy.com` → Redirection vers simpshopy.com

### **Fonctionnalités à vérifier :**
1. **Interface admin** : Création de boutiques, gestion
2. **Sous-domaines** : Affichage des boutiques publiques
3. **SSL** : Certificats valides sur tous les domaines
4. **Performance** : Chargement rapide

---

## 🔍 **DÉPANNAGE**

### **Erreur 525 (SSL Handshake Failed)**
**Cause :** DNS non configuré ou SSL mal configuré
**Solution :**
1. Vérifier les enregistrements DNS
2. Attendre la propagation (jusqu'à 24h)
3. Vérifier la configuration SSL Cloudflare

### **Erreur 404 (Domain not found)**
**Cause :** Sous-domaine non créé dans la base de données
**Solution :**
1. Exécuter le script SQL de création
2. Vérifier que la boutique existe
3. Tester l'Edge Function

### **Erreur de certificat SSL**
**Cause :** Mode SSL incorrect
**Solution :**
1. Passer en mode "Full" dans Cloudflare
2. Attendre la génération du certificat
3. Vérifier "Always Use HTTPS"

---

## 📞 **SUPPORT**

Si vous rencontrez des problèmes :
1. Vérifiez les logs Cloudflare
2. Testez l'Edge Function directement
3. Vérifiez la configuration DNS avec `nslookup`
4. Contactez le support si nécessaire

**Le système de sous-domaines sera opérationnel une fois le DNS configuré ! 🎉**
