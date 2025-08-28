# 🚀 GUIDE DÉPLOIEMENT VERCEL + CLOUDFLARE

## 🎯 **ARCHITECTURE RECOMMANDÉE**

```
simpshopy.com → Cloudflare → Vercel → Ton app React
```

### **Avantages :**
- ✅ **Performance** : CDN global Cloudflare
- ✅ **Sécurité** : Protection DDoS incluse
- ✅ **SSL** : Certificats automatiques
- ✅ **Déploiement** : Automatique depuis GitHub
- ✅ **Gratuit** : Plans gratuits suffisants

---

## 🔧 **ÉTAPE 1 : DÉPLOYER SUR VERCEL**

### **1. Préparer le projet**

#### **A. Vérifier package.json**
```json
{
  "name": "malibashopy",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

#### **B. Créer vercel.json (optionnel)**
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

### **2. Déployer sur Vercel**

#### **A. Aller sur Vercel**
1. Va sur https://vercel.com
2. Connecte-toi avec ton compte GitHub
3. Clique sur **"New Project"**

#### **B. Importer ton projet**
1. Sélectionne ton repository `malibashopy`
2. Vercel détectera automatiquement que c'est un projet Vite/React
3. Clique sur **"Deploy"**

#### **C. Configuration automatique**
Vercel va :
- ✅ Détecter le framework (Vite)
- ✅ Installer les dépendances
- ✅ Builder le projet
- ✅ Déployer sur leur CDN

#### **D. Variables d'environnement**
Dans les paramètres du projet Vercel, ajoute :
```
VITE_SUPABASE_URL=https://grutldacuowplosarucp.supabase.co
VITE_SUPABASE_ANON_KEY=ton_anon_key
```

### **3. Vérifier le déploiement**
- Ton app sera disponible sur : `https://malibashopy.vercel.app`
- Vérifie que tout fonctionne correctement

---

## 🌐 **ÉTAPE 2 : CONFIGURER CLOUDFLARE**

### **1. Créer un compte Cloudflare**
1. Va sur https://cloudflare.com
2. Crée un compte gratuit
3. Clique sur **"Add a Site"**

### **2. Ajouter simpshopy.com**
1. Entre `simpshopy.com`
2. Choisis le plan **"Free"**
3. Cloudflare va scanner tes DNS actuels

### **3. Configuration DNS Cloudflare**

#### **A. Enregistrements pour Vercel**
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

### **4. Changer les nameservers OVH**

#### **A. Dans Cloudflare**
1. Va dans **"Overview"**
2. Copie les 2 nameservers Cloudflare :
   - `nina.ns.cloudflare.com`
   - `rick.ns.cloudflare.com`

#### **B. Dans OVH**
1. Va dans ton panel OVH
2. **"Domaines"** → **"simpshopy.com"**
3. **"Zone DNS"** → **"Nameservers"**
4. Remplace par les nameservers Cloudflare

---

## 🔄 **ÉTAPE 3 : CONFIGURER VERCEL POUR LE DOMAINE**

### **1. Dans Vercel**
1. Va dans ton projet
2. **"Settings"** → **"Domains"**
3. Ajoute `simpshopy.com`
4. Ajoute `www.simpshopy.com`

### **2. Vérification DNS**
Vercel va vérifier que les enregistrements DNS sont corrects.

### **3. SSL automatique**
Vercel va générer automatiquement un certificat SSL pour ton domaine.

---

## 🧪 **ÉTAPE 4 : TESTER**

### **1. Vérifier le domaine principal**
```bash
curl -I https://simpshopy.com
curl -I https://www.simpshopy.com
```

### **2. Vérifier les sous-domaines**
```bash
curl -I https://test.simpshopy.com
curl -I https://boutique.simpshopy.com
```

### **3. Vérifier les emails**
```bash
nslookup -type=mx simpshopy.com
```

---

## 🎯 **AVANTAGES DE CETTE CONFIGURATION**

### **✅ Performance**
- **CDN Cloudflare** : Chargement ultra-rapide
- **Edge Functions** : Vercel pour les API
- **Cache global** : Réduction des temps de chargement

### **✅ Sécurité**
- **Protection DDoS** : Cloudflare incluse
- **SSL automatique** : Certificats gratuits
- **WAF** : Protection contre les attaques

### **✅ Simplicité**
- **Déploiement automatique** : Depuis GitHub
- **Configuration DNS** : Interface Cloudflare simple
- **Monitoring** : Analytics inclus

### **✅ Scalabilité**
- **Sous-domaines illimités** : Via wildcard
- **Trafic illimité** : Plans gratuits suffisants
- **Support global** : CDN dans le monde entier

---

## 🚀 **PROCHAINES ÉTAPES**

### **1. Déployer sur Vercel**
- Connecter ton GitHub
- Configurer les variables d'environnement
- Vérifier le déploiement

### **2. Configurer Cloudflare**
- Ajouter simpshopy.com
- Configurer les enregistrements DNS
- Changer les nameservers OVH

### **3. Tester le système**
- Vérifier le domaine principal
- Tester les sous-domaines
- Configurer l'intégration Resend

**Cette configuration te donnera une plateforme professionnelle, rapide et sécurisée !** 🎉 