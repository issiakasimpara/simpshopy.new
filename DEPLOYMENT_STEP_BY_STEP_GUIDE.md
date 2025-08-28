# 🚀 GUIDE COMPLET DÉPLOIEMENT VERCEL + CLOUDFLARE

## 📋 **PRÉREQUIS**
- ✅ Repository GitHub : https://github.com/issiakasimpara/Simpshopy.com.git
- ✅ Domaine acheté : simpshopy.com (OVH)
- ✅ Compte GitHub connecté

---

## 🎯 **ÉTAPE 1 : DÉPLOYER SUR VERCEL**

### **Action 1.1 : Aller sur Vercel**
1. Ouvre ton navigateur
2. Va sur : https://vercel.com
3. Clique sur **"Sign Up"** (si pas de compte) ou **"Login"**

### **Action 1.2 : Se connecter avec GitHub**
1. Choisis **"Continue with GitHub"**
2. Autorise Vercel à accéder à ton compte GitHub
3. Tu seras redirigé vers le dashboard Vercel

### **Action 1.3 : Créer un nouveau projet**
1. Clique sur **"New Project"** (bouton vert)
2. Tu verras la liste de tes repositories GitHub
3. Cherche et sélectionne : **"issiakasimpara/Simpshopy.com"**

### **Action 1.4 : Configuration du projet**
1. **Framework Preset** : Vercel détectera automatiquement "Vite"
2. **Root Directory** : Laisse vide (par défaut)
3. **Build Command** : `npm run build` (déjà configuré)
4. **Output Directory** : `dist` (déjà configuré)
5. **Install Command** : `npm install` (déjà configuré)

### **Action 1.5 : Variables d'environnement**
1. Clique sur **"Environment Variables"**
2. Ajoute ces variables :
   ```
   Name: VITE_SUPABASE_URL
   Value: https://grutldacuowplosarucp.supabase.co
   ```
3. Clique sur **"Add"**
4. Ajoute la deuxième variable :
   ```
   Name: VITE_SUPABASE_ANON_KEY
   Value: [ton_anon_key_supabase]
   ```
5. Clique sur **"Add"**

### **Action 1.6 : Déployer**
1. Clique sur **"Deploy"** (bouton bleu)
2. Attends 2-3 minutes que Vercel :
   - Clone ton repository
   - Installe les dépendances
   - Build le projet
   - Déploie sur leur CDN

### **Action 1.7 : Vérifier le déploiement**
1. Une fois terminé, tu verras : **"Ready"** en vert
2. Clique sur le lien : `https://malibashopy.vercel.app`
3. Vérifie que ton app fonctionne correctement
4. Teste quelques fonctionnalités (login, création boutique, etc.)

### **Action 1.8 : Noter l'URL Vercel**
- **URL importante** : `https://malibashopy.vercel.app`
- Garde cette URL, tu en auras besoin pour Cloudflare

---

## 🌐 **ÉTAPE 2 : CONFIGURER CLOUDFLARE**

### **Action 2.1 : Créer un compte Cloudflare**
1. Va sur : https://cloudflare.com
2. Clique sur **"Sign Up"**
3. Entre ton email et crée un mot de passe
4. Clique sur **"Create Account"**
5. Vérifie ton email si demandé

### **Action 2.2 : Ajouter ton site**
1. Dans le dashboard Cloudflare, clique sur **"Add a Site"**
2. Entre : `simpshopy.com`
3. Clique sur **"Add Site"**

### **Action 2.3 : Choisir le plan**
1. Sélectionne le plan **"Free"** (gratuit)
2. Clique sur **"Continue"**

### **Action 2.4 : Scanner DNS**
1. Cloudflare va scanner tes enregistrements DNS actuels
2. Tu verras une liste d'enregistrements existants
3. Clique sur **"Continue"**

### **Action 2.5 : Récupérer les nameservers**
1. Dans la section **"Overview"**, tu verras 2 nameservers
2. Note-les précieusement :
   - `nina.ns.cloudflare.com`
   - `rick.ns.cloudflare.com`

### **Action 2.6 : Configurer les enregistrements DNS**
1. Va dans l'onglet **"DNS"**
2. Clique sur **"Add record"**

#### **Enregistrement 1 : Domaine principal**
```
Type: CNAME
Name: @
Target: malibashopy.vercel.app
Proxy status: ✅ Proxied (orange cloud)
```
Clique sur **"Save"**

#### **Enregistrement 2 : Sous-domaine www**
```
Type: CNAME
Name: www
Target: malibashopy.vercel.app
Proxy status: ✅ Proxied (orange cloud)
```
Clique sur **"Save"**

#### **Enregistrement 3 : Wildcard pour sous-domaines**
```
Type: CNAME
Name: *
Target: malibashopy.vercel.app
Proxy status: ✅ Proxied (orange cloud)
```
Clique sur **"Save"**

#### **Enregistrement 4 : Email MX (Resend)**
```
Type: MX
Name: @
Mail server: mxa.resend.com
Priority: 10
Proxy status: ❌ DNS only (gris)
```
Clique sur **"Save"**

#### **Enregistrement 5 : SPF pour emails**
```
Type: TXT
Name: @
Content: v=spf1 include:spf.resend.com ~all
Proxy status: ❌ DNS only (gris)
```
Clique sur **"Save"**

### **Action 2.7 : Changer les nameservers OVH**
1. Ouvre un nouvel onglet
2. Va sur : https://www.ovh.com/manager/
3. Connecte-toi à ton compte OVH
4. Va dans **"Domaines"**
5. Clique sur **"simpshopy.com"**
6. Va dans **"Zone DNS"**
7. Clique sur **"Nameservers"**
8. Remplace les nameservers actuels par :
   - `nina.ns.cloudflare.com`
   - `rick.ns.cloudflare.com`
9. Clique sur **"Enregistrer"**

---

## 🔄 **ÉTAPE 3 : CONFIGURER VERCEL POUR LE DOMAINE**

### **Action 3.1 : Retourner sur Vercel**
1. Va sur : https://vercel.com/dashboard
2. Clique sur ton projet **"malibashopy"**

### **Action 3.2 : Ajouter le domaine**
1. Va dans **"Settings"** (onglet)
2. Clique sur **"Domains"** (menu de gauche)
3. Dans le champ "Add Domain", entre : `simpshopy.com`
4. Clique sur **"Add"**

### **Action 3.3 : Ajouter www**
1. Dans le même champ, entre : `www.simpshopy.com`
2. Clique sur **"Add"**

### **Action 3.4 : Vérifier la configuration**
1. Vercel va vérifier les enregistrements DNS
2. Tu verras des points verts ✅ si tout est correct
3. Si des erreurs, attends 10-15 minutes et rafraîchis

---

## ⏳ **ÉTAPE 4 : ATTENDRE LA PROPAGATION DNS**

### **Action 4.1 : Temps d'attente**
- **Temps estimé** : 24-48 heures
- **Propagation partielle** : 2-6 heures
- **Test toutes les heures** : https://dnschecker.org

### **Action 4.2 : Vérifier la propagation**
1. Va sur : https://dnschecker.org
2. Entre : `simpshopy.com`
3. Vérifie que les enregistrements CNAME pointent vers Vercel
4. Vérifie que les MX pointent vers Resend

---

## 🧪 **ÉTAPE 5 : TESTER LE SYSTÈME**

### **Action 5.1 : Test du domaine principal**
1. Ouvre ton navigateur
2. Va sur : `https://simpshopy.com`
3. Vérifie que ton app se charge
4. Teste quelques fonctionnalités

### **Action 5.2 : Test du sous-domaine www**
1. Va sur : `https://www.simpshopy.com`
2. Vérifie que ça redirige vers `simpshopy.com`

### **Action 5.3 : Test des sous-domaines**
1. Va sur : `https://test.simpshopy.com`
2. Vérifie que ça charge ton app
3. Teste : `https://boutique.simpshopy.com`

### **Action 5.4 : Test des emails**
1. Ouvre un terminal
2. Tape : `nslookup -type=mx simpshopy.com`
3. Vérifie que ça affiche : `mxa.resend.com`

---

## 🎯 **ÉTAPE 6 : CONFIGURER L'INTÉGRATION RESEND**

### **Action 6.1 : Aller sur Supabase**
1. Va sur : https://supabase.com/dashboard
2. Connecte-toi à ton compte
3. Sélectionne ton projet

### **Action 6.2 : Aller dans les intégrations**
1. Dans le menu de gauche, clique sur **"Integrations"**
2. Cherche **"Resend"**
3. Clique sur **"Add Integration"**

### **Action 6.3 : Configurer Resend**
1. **Domain** : `simpshopy.com`
2. **API Key** : Resend créera automatiquement une clé
3. Clique sur **"Add Integration"**

### **Action 6.4 : Tester les emails**
1. Crée une boutique de test
2. Passe une commande de test
3. Vérifie que tu reçois les emails

---

## 🎉 **ÉTAPE 7 : VALIDATION FINALE**

### **Action 7.1 : Checklist finale**
- ✅ `simpshopy.com` fonctionne
- ✅ `www.simpshopy.com` redirige
- ✅ `*.simpshopy.com` fonctionne
- ✅ Emails Resend fonctionnent
- ✅ SSL (https) fonctionne
- ✅ Performance optimale

### **Action 7.2 : Monitoring**
1. **Cloudflare Analytics** : Vérifie le trafic
2. **Vercel Analytics** : Vérifie les performances
3. **Supabase Logs** : Vérifie les erreurs

---

## 🔍 **DÉPANNAGE**

### **Problème : Domaine ne fonctionne pas**
**Solution :**
1. Vérifie les nameservers OVH
2. Attends la propagation DNS
3. Vérifie les enregistrements Cloudflare

### **Problème : Sous-domaines ne fonctionnent pas**
**Solution :**
1. Vérifie l'enregistrement wildcard `*`
2. Vérifie que le proxy est activé (orange)
3. Vérifie la configuration Vercel

### **Problème : Emails ne fonctionnent pas**
**Solution :**
1. Vérifie les enregistrements MX et TXT
2. Vérifie que le proxy est désactivé (gris)
3. Vérifie l'intégration Resend

---

## 📞 **SUPPORT**

### **Ressources utiles :**
- **DNS Checker** : https://dnschecker.org
- **SSL Checker** : https://www.ssllabs.com/ssltest/
- **Vercel Docs** : https://vercel.com/docs
- **Cloudflare Docs** : https://developers.cloudflare.com

### **En cas de problème :**
1. Vérifie les logs Vercel
2. Vérifie les logs Cloudflare
3. Vérifie les logs Supabase
4. Contacte le support si nécessaire

---

## 🎯 **RÉSULTAT FINAL**

**Une fois terminé, tu auras :**

- ✅ **simpshopy.com** → Ton app React déployée
- ✅ ***.simpshopy.com** → Sous-domaines automatiques
- ✅ **noreply@simpshopy.com** → Emails professionnels
- ✅ **Performance mondiale** → CDN Cloudflare
- ✅ **Sécurité maximale** → Protection DDoS
- ✅ **SSL automatique** → Certificats gratuits

**Ton système multi-domaines sera 100% fonctionnel !** 🚀 