# 🚀 Guide de Déploiement WhatsApp - Interface Web

## 🎯 **Problème CORS Détecté**

L'erreur CORS indique que la fonction Edge `whatsapp-send` n'est pas accessible depuis votre domaine local.

## 🔧 **Solution : Redéployer via l'Interface Web**

### **Étape 1 : Accéder à Supabase Dashboard**
1. **Allez sur [supabase.com](https://supabase.com)**
2. **Connectez-vous et ouvrez votre projet** `grutldacuowplosarucp`
3. **Cliquez sur "Edge Functions"** dans le menu de gauche

### **Étape 2 : Vérifier la Fonction**
1. **Cherchez** `whatsapp-send` dans la liste
2. **Si elle existe** : Cliquez dessus et vérifiez qu'elle est "Active"
3. **Si elle n'existe pas** : Créez-la

### **Étape 3 : Créer/Modifier la Fonction**
1. **Cliquez sur "Create a new function"** (si elle n'existe pas)
2. **Nom** : `whatsapp-send`
3. **Cliquez sur "Create function"**

### **Étape 4 : Copier le Code**
1. **Ouvrez le fichier** `supabase/functions/whatsapp-send/index.ts` dans votre éditeur
2. **Copiez tout le contenu**
3. **Collez-le** dans l'éditeur de Supabase

### **Étape 5 : Configurer les Variables d'Environnement**
1. **Dans Supabase Dashboard** → **Settings** → **Edge Functions**
2. **Ajoutez ces variables :**
   ```
   GUPSHUP_API_KEY=your_gupshup_api_key_here
   GUPSHUP_APP_NAME=MALIBASHOPY
   GUPSHUP_CHANNEL_ID=whatsapp
   GUPSHUP_API_URL=https://api.gupshup.io/wa/api/v1
   ```

### **Étape 6 : Déployer**
1. **Cliquez sur "Deploy"**
2. **Attendez** que le déploiement soit terminé
3. **Vérifiez** que le statut est "Active"

## 🧪 **Tester Après Déploiement**

1. **Retournez sur votre page de test** : `http://localhost:4000/whatsapp-test`
2. **Cliquez sur "🔍 Tester la Connexion"**
3. **Vérifiez** que l'erreur CORS a disparu

## 🚨 **En Cas de Problème**

### **Erreur 404**
- La fonction n'est pas déployée
- Vérifiez le nom exact : `whatsapp-send`

### **Erreur 500**
- Problème dans le code
- Vérifiez les logs dans Supabase Dashboard

### **Erreur CORS persistante**
- Vérifiez que la fonction est bien "Active"
- Attendez quelques minutes après le déploiement

## 📞 **Support**

Si le problème persiste, vérifiez :
1. **Les logs** dans Supabase Dashboard → Edge Functions → Logs
2. **Les variables d'environnement** sont bien configurées
3. **Le nom de la fonction** est exactement `whatsapp-send`
