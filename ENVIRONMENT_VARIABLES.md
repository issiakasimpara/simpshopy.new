# 🔐 Configuration des Variables d'Environnement

## 🚨 **VARIABLES CRITIQUES MANQUANTES**

### **1. Supabase Edge Functions**

Ajoutez ces variables dans votre dashboard Supabase :
**Dashboard Supabase → Settings → Environment Variables**

```bash
# API Fixer.io pour la conversion de devises
FIXER_API_KEY=votre_clé_api_fixer_ici

# Moneroo pour les paiements
MONEROO_API_KEY=votre_clé_api_moneroo_ici
MONEROO_WEBHOOK_SECRET=votre_secret_webhook_moneroo_ici

# Mailchimp OAuth
MAILCHIMP_CLIENT_ID=votre_client_id_mailchimp
MAILCHIMP_CLIENT_SECRET=votre_client_secret_mailchimp
MAILCHIMP_OAUTH_URL=https://login.mailchimp.com/oauth2/authorize
MAILCHIMP_TOKEN_URL=https://login.mailchimp.com/oauth2/token
MAILCHIMP_API_URL=https://us1.api.mailchimp.com/3.0

# DSERS API
DSERS_API_URL=https://api.dsers.com
DSERS_API_VERSION=v1

# WhatsApp/Notifications
GUPSHUP_API_KEY=votre_clé_api_gupshup
GUPSHUP_APP_NAME=SimpShopy
GUPSHUP_CHANNEL_ID=whatsapp
GUPSHUP_API_URL=https://api.gupshup.io/wa/api/v1

# Site URL
SITE_URL=https://simpshopy.com
```

### **2. Comment obtenir ces clés**

#### **Fixer.io (Conversion de devises)**
1. Allez sur https://fixer.io/
2. Créez un compte gratuit
3. Récupérez votre clé API

#### **Moneroo (Paiements)**
1. Allez sur https://moneroo.io/
2. Créez un compte développeur
3. Récupérez votre clé API et secret webhook

#### **Mailchimp OAuth**
1. Allez sur https://developer.mailchimp.com/
2. Créez une app OAuth
3. Configurez les URLs de redirection

#### **Gupshup (WhatsApp)**
1. Allez sur https://gupshup.io/
2. Créez un compte développeur
3. Configurez une app WhatsApp

### **3. Variables Frontend (Vercel)**

Dans votre projet Vercel, ajoutez :
**Vercel Dashboard → Project Settings → Environment Variables**

```bash
# Supabase (déjà configuré)
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_anon_key

# Google Analytics (optionnel)
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

### **4. Vérification**

Après avoir ajouté ces variables :

1. **Redéployez les Edge Functions** :
```bash
supabase functions deploy --project-ref votre-projet-ref
```

2. **Redéployez sur Vercel** :
```bash
vercel --prod
```

3. **Testez les fonctionnalités** :
   - Conversion de devises
   - Paiements Moneroo
   - Intégration Mailchimp
   - Notifications WhatsApp

## 🔒 **SÉCURITÉ**

- ✅ **Ne jamais commiter** ces clés dans Git
- ✅ **Utiliser les variables d'environnement** Supabase/Vercel
- ✅ **Limiter les permissions** des clés API
- ✅ **Surveiller l'utilisation** dans les dashboards

## 📞 **Support**

Si vous avez des problèmes :
1. Vérifiez que toutes les variables sont configurées
2. Vérifiez les permissions des clés API
3. Consultez les logs des Edge Functions
4. Contactez le support si nécessaire
