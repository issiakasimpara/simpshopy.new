# 🌐 GUIDE CONFIGURATION DNS OVH POUR SIMPSHOPY.COM

## 🎯 **CONFIGURATION POUR SIMPSHOPY.COM**

### **Étape 1 : Accéder au panel OVH**

1. Va sur https://www.ovh.com/manager/
2. Connecte-toi avec tes identifiants
3. Va dans **"Domaines"** → **"simpshopy.com"**

### **Étape 2 : Configuration DNS**

#### **A. Enregistrements A (Adresses IP)**

Dans la section **"Zone DNS"**, ajoute/modifie :

```
Type    Nom                    Valeur
A       @                      [IP de ton serveur]
A       www                    [IP de ton serveur]
A       *                      [IP de ton serveur]
```

**Note :** Remplace `[IP de ton serveur]` par l'IP de ton serveur de production.

#### **B. Configuration Email (Resend)**

Pour que les emails fonctionnent avec `noreply@simpshopy.com` :

```
Type    Nom                    Valeur                    Priorité
MX      @                      mxa.resend.com            10
TXT     @                      v=spf1 include:spf.resend.com ~all
```

#### **C. Configuration CAA (Sécurité)**

```
Type    Nom                    Valeur
CAA     @                      0 issue "letsencrypt.org"
```

### **Étape 3 : Configuration pour les sous-domaines**

Le wildcard `*` permettra automatiquement :
- `boutique1.simpshopy.com`
- `boutique2.simpshopy.com`
- `client.simpshopy.com`
- etc.

---

## 🔧 **CONFIGURATION POUR LES CLIENTS**

### **Instructions pour tes clients (domaines personnalisés)**

Quand un client veut utiliser son domaine personnalisé (ex: `ma-boutique.com`), il doit configurer :

#### **Option A : CNAME (Recommandé)**

Dans le registrar du client :

```
Type    Nom                    Valeur
CNAME   www                    simpshopy.com
```

#### **Option B : A Records**

```
Type    Nom                    Valeur
A       @                      [IP de SimpShopy]
A       www                    [IP de SimpShopy]
```

---

## 🚀 **ÉTAPES SUIVANTES**

### **1. Déployer la migration**
```bash
# Dans ton projet Supabase
supabase db push
```

### **2. Tester le système**
1. Créer une boutique de test
2. Vérifier que `boutique-test.simpshopy.com` fonctionne
3. Ajouter un domaine personnalisé de test

### **3. Configurer l'intégration Resend**
1. Aller sur https://supabase.com/dashboard/project/grutldacuowplosarucp/integrations
2. Cliquer sur **"Resend"**
3. Configurer avec `simpshopy.com`

---

## 🎯 **AVANTAGES DE CETTE CONFIGURATION**

### **✅ Pour toi (SimpShopy)**
- **Sous-domaines automatiques** : `*.simpshopy.com`
- **Email professionnel** : `noreply@simpshopy.com`
- **Scalabilité** : Support illimité de domaines clients

### **✅ Pour tes clients**
- **Gratuit** : Sous-domaine inclus
- **Flexibilité** : Migration vers domaine personnalisé
- **Simplicité** : Configuration DNS simple

### **✅ Technique**
- **Wildcard DNS** : Un seul enregistrement pour tous les sous-domaines
- **Email Resend** : Intégration native avec Supabase
- **Sécurité** : Configuration CAA pour Let's Encrypt

---

## 🔍 **VÉRIFICATION**

### **Tester après configuration :**

1. **Sous-domaines** :
   ```bash
   curl -I https://test.simpshopy.com
   ```

2. **Email** :
   ```bash
   nslookup -type=mx simpshopy.com
   ```

3. **Wildcard** :
   ```bash
   curl -I https://random.simpshopy.com
   ```

---

## 📞 **SUPPORT**

Si tu as des problèmes avec la configuration DNS :

1. **Vérifier les enregistrements** dans le panel OVH
2. **Attendre la propagation** (peut prendre 24-48h)
3. **Tester avec des outils** comme https://dnschecker.org

**Le système multi-domaines sera alors 100% fonctionnel !** 🎉 