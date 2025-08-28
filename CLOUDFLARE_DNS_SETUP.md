# 🌐 GUIDE CONFIGURATION DNS CLOUDFLARE POUR SIMPSHOPY.COM

## 🎯 **POURQUOI CLOUDFLARE ?**

### **Avantages :**
- ✅ **Gratuit** : Plan gratuit suffisant
- ✅ **CDN global** : Performance mondiale
- ✅ **Protection DDoS** : Sécurité incluse
- ✅ **SSL automatique** : Certificats gratuits
- ✅ **Interface simple** : Configuration facile
- ✅ **Analytics** : Statistiques de trafic

---

## 🔧 **ÉTAPE 1 : CRÉER UN COMPTE CLOUDFLARE**

### **1. Inscription**
1. Va sur https://cloudflare.com
2. Clique sur **"Sign Up"**
3. Crée un compte avec ton email

### **2. Ajouter un site**
1. Clique sur **"Add a Site"**
2. Entre `simpshopy.com`
3. Choisis le plan **"Free"**
4. Clique sur **"Continue"**

---

## 🌐 **ÉTAPE 2 : CONFIGURATION DNS**

### **1. Scanner DNS automatique**
Cloudflare va scanner tes enregistrements DNS actuels.

### **2. Configuration recommandée**

#### **A. Enregistrements pour Vercel (domaine principal)**
```
Type    Nom                    Valeur                    Proxy
CNAME   @                      malibashopy.vercel.app    ✅ (Orange)
CNAME   www                    malibashopy.vercel.app    ✅ (Orange)
```

#### **B. Enregistrements pour les sous-domaines**
```
Type    Nom                    Valeur                    Proxy
CNAME   *                      malibashopy.vercel.app    ✅ (Orange)
```

#### **C. Configuration Email (Resend)**
```
Type    Nom                    Valeur                    Proxy
MX      @                      mxa.resend.com            10        ❌ (Gris)
TXT     @                      v=spf1 include:spf.resend.com ~all  ❌ (Gris)
```

### **3. Explication des colonnes :**

#### **Type :**
- **CNAME** : Alias vers un autre domaine
- **MX** : Serveur de mail
- **TXT** : Informations textuelles

#### **Nom :**
- **@** : Domaine racine (simpshopy.com)
- **www** : Sous-domaine www
- **\*** : Wildcard (tous les sous-domaines)

#### **Valeur :**
- **malibashopy.vercel.app** : Ton app déployée sur Vercel
- **mxa.resend.com** : Serveur email Resend

#### **Proxy :**
- **✅ (Orange)** : Trafic passe par Cloudflare (recommandé)
- **❌ (Gris)** : Trafic direct (pour les emails)

---

## 🔄 **ÉTAPE 3 : CHANGER LES NAMESERVERS**

### **1. Récupérer les nameservers Cloudflare**
Dans Cloudflare, va dans **"Overview"** et copie :
- `nina.ns.cloudflare.com`
- `rick.ns.cloudflare.com`

### **2. Changer dans OVH**
1. Va dans ton panel OVH
2. **"Domaines"** → **"simpshopy.com"**
3. **"Zone DNS"** → **"Nameservers"**
4. Remplace par les nameservers Cloudflare

### **3. Attendre la propagation**
- **Temps** : 24-48 heures
- **Vérification** : https://dnschecker.org

---

## 🚀 **ÉTAPE 4 : CONFIGURER VERCEL**

### **1. Ajouter le domaine dans Vercel**
1. Va dans ton projet Vercel
2. **"Settings"** → **"Domains"**
3. Ajoute `simpshopy.com`
4. Ajoute `www.simpshopy.com`

### **2. Vérification DNS**
Vercel va vérifier que les enregistrements sont corrects.

### **3. SSL automatique**
Vercel va générer un certificat SSL automatiquement.

---

## 🧪 **ÉTAPE 5 : TESTER**

### **1. Vérifier le domaine principal**
```bash
# Test HTTP
curl -I http://simpshopy.com
curl -I http://www.simpshopy.com

# Test HTTPS
curl -I https://simpshopy.com
curl -I https://www.simpshopy.com
```

### **2. Vérifier les sous-domaines**
```bash
# Test wildcard
curl -I https://test.simpshopy.com
curl -I https://boutique.simpshopy.com
curl -I https://client.simpshopy.com
```

### **3. Vérifier les emails**
```bash
# Vérifier MX records
nslookup -type=mx simpshopy.com

# Vérifier SPF
nslookup -type=txt simpshopy.com
```

---

## 🎯 **CONFIGURATION AVANCÉE CLOUDFLARE**

### **1. Page Rules (optionnel)**
```
URL: simpshopy.com/*
Settings:
- Always Use HTTPS: ON
- Cache Level: Standard
- Browser Cache TTL: 4 hours
```

### **2. Security Settings**
```
Security Level: Medium
Challenge Passage: 30 minutes
Browser Integrity Check: ON
```

### **3. Speed Settings**
```
Auto Minify: JavaScript, CSS, HTML
Brotli: ON
Rocket Loader: ON
```

---

## 🔍 **DÉPANNAGE**

### **Problème : Domaine ne fonctionne pas**
1. **Vérifier les nameservers** : Sont-ils bien changés ?
2. **Attendre la propagation** : 24-48h
3. **Vérifier les enregistrements** : Dans Cloudflare

### **Problème : Sous-domaines ne fonctionnent pas**
1. **Vérifier le wildcard** : `*` → `malibashopy.vercel.app`
2. **Proxy activé** : Orange cloud activé
3. **Vercel configuré** : Domaine ajouté dans Vercel

### **Problème : Emails ne fonctionnent pas**
1. **Proxy désactivé** : Gris cloud pour MX et TXT
2. **Vérifier Resend** : Configuration correcte
3. **Attendre la propagation** : DNS peut prendre du temps

---

## 📊 **MONITORING**

### **1. Analytics Cloudflare**
- **Trafic** : Nombre de visiteurs
- **Performance** : Temps de chargement
- **Sécurité** : Attaques bloquées

### **2. Vercel Analytics**
- **Déploiements** : Statut des déploiements
- **Performance** : Core Web Vitals
- **Erreurs** : Logs d'erreurs

---

## 🎉 **RÉSULTAT FINAL**

### **✅ Domaine principal**
- `simpshopy.com` → Ton app React
- `www.simpshopy.com` → Ton app React

### **✅ Sous-domaines automatiques**
- `boutique1.simpshopy.com` → Boutique 1
- `boutique2.simpshopy.com` → Boutique 2
- `*.simpshopy.com` → Toutes les boutiques

### **✅ Email professionnel**
- `noreply@simpshopy.com` → Emails automatiques
- Intégration Resend → Supabase

### **✅ Performance**
- CDN global Cloudflare
- SSL automatique
- Protection DDoS

**Ton système multi-domaines sera alors 100% fonctionnel !** 🚀 