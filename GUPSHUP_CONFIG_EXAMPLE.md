# 🔧 Configuration Gupshup - Variables d'Environnement

## 📋 Variables à configurer dans Supabase

Ajoutez ces variables dans votre projet Supabase :
**Dashboard Supabase → Settings → Environment Variables**

```bash
# Configuration Gupshup WhatsApp API
GUPSHUP_API_KEY=votre_api_key_ici
GUPSHUP_APP_NAME=SimpShopy
GUPSHUP_CHANNEL_ID=whatsapp
GUPSHUP_API_URL=https://api.gupshup.io/wa/api/v1
```

## 🔑 Comment obtenir vos identifiants Gupshup

### 1. Créer un compte Gupshup
- Allez sur [gupshup.io](https://gupshup.io)
- Créez un compte développeur
- Vérifiez votre email et numéro de téléphone

### 2. Créer une application WhatsApp
- Dans votre dashboard Gupshup, allez dans "Apps" → "Create App"
- Sélectionnez "WhatsApp" comme plateforme
- Donnez un nom à votre app (ex: "SimpShopy-Notifications")
- Suivez le processus de vérification

### 3. Récupérer vos identifiants
- **API Key** : Trouvez-la dans "Apps" → Votre app → "API Keys"
- **App Name** : Le nom de votre application (ex: "SimpShopy")
- **Channel ID** : Généralement "whatsapp" (par défaut)

## 🚀 Déploiement

### 1. Déployer la fonction Edge
```bash
supabase functions deploy whatsapp-send
```

### 2. Vérifier le déploiement
```bash
supabase functions list
```

### 3. Tester l'intégration
Utilisez le panneau de test intégré dans SimpShopy pour vérifier que tout fonctionne.

## 📱 Test

### Message de test
```bash
curl -X POST https://votre-projet.supabase.co/functions/v1/whatsapp-send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer votre_anon_key" \
  -d '{
    "action": "test_connection"
  }'
```

## 🔒 Sécurité

- ✅ Ne jamais commiter les clés API dans le code
- ✅ Utiliser les variables d'environnement Supabase
- ✅ Limiter les permissions de l'API key Gupshup
- ✅ Surveiller l'utilisation dans votre dashboard Gupshup

## 💰 Coûts

- **Messages WhatsApp** : ~0.002€ par message
- **API Calls** : Gratuits (inclus dans le plan)
- **Support** : Disponible selon votre plan

---

💡 **Besoin d'aide ?** Consultez le guide complet dans `WHATSAPP_INTEGRATION_GUIDE.md`
