# 🔗 CONFIGURATION WEBHOOK MONEROO

## 📋 INFORMATIONS WEBHOOK

### **URL du Webhook :**
```
https://votre-projet.supabase.co/functions/v1/moneroo-webhook
```

### **Secret de Signature :**
```
moneroo_webhook_secret_2024
```

## 🚀 ÉTAPES DE CONFIGURATION

### **1. Déployer la fonction Supabase**

```bash
# Installer Supabase CLI
npm install -g supabase

# Se connecter à votre projet
supabase login

# Déployer la fonction
supabase functions deploy moneroo-webhook
```

### **2. Configurer les variables d'environnement**

Dans votre dashboard Supabase, allez dans **Settings > Functions** et ajoutez :

```
MONEROO_WEBHOOK_SECRET=moneroo_webhook_secret_2024
```

### **3. Configurer dans Moneroo Dashboard**

1. **Allez sur** : https://dashboard.moneroo.io
2. **Section** : Développeurs > Webhooks
3. **Cliquez** : "Ajouter un webhook"
4. **Remplissez** :
   - **URL** : `https://votre-projet.supabase.co/functions/v1/moneroo-webhook`
   - **Hash secret** : `moneroo_webhook_secret_2024`

## 🔔 ÉVÉNEMENTS SUPPORTÉS

Le webhook gère automatiquement :

- ✅ `payment.success` - Paiement réussi
- ✅ `payment.failed` - Paiement échoué  
- ✅ `payment.cancelled` - Paiement annulé
- ✅ `payment.initiated` - Paiement initié

## 🛡️ SÉCURITÉ

- **Signature HMAC-SHA256** vérifiée
- **CORS** configuré
- **Validation** des données
- **Logs** détaillés

## 📊 FONCTIONNALITÉS

### **Automatique :**
- ✅ Mise à jour statut paiements
- ✅ Création commandes
- ✅ Gestion des erreurs
- ✅ Logs de debug

### **Base de données :**
- ✅ Table `payments` mise à jour
- ✅ Table `orders` créée automatiquement
- ✅ Métadonnées préservées

## 🧪 TEST DU WEBHOOK

### **Test manuel :**
```bash
curl -X POST https://votre-projet.supabase.co/functions/v1/moneroo-webhook \
  -H "Content-Type: application/json" \
  -H "x-moneroo-signature: test_signature" \
  -d '{
    "event": "payment.success",
    "data": {
      "id": "test_payment_id",
      "amount": 1500,
      "currency": "XOF",
      "status": "success"
    }
  }'
```

## 📝 NOTES IMPORTANTES

1. **Remplacez** `votre-projet` par votre vrai projet Supabase
2. **Vérifiez** que la fonction est déployée avant de configurer dans Moneroo
3. **Testez** avec un petit paiement d'abord
4. **Surveillez** les logs dans Supabase Dashboard

## 🔧 DÉPANNAGE

### **Erreur 403 :**
- Vérifiez le secret de signature
- Vérifiez l'URL du webhook

### **Erreur 500 :**
- Vérifiez les variables d'environnement
- Vérifiez les logs Supabase

### **Webhook non reçu :**
- Vérifiez l'URL dans Moneroo
- Vérifiez que le webhook est activé
- Testez avec un paiement réel

## 📞 SUPPORT

En cas de problème :
1. Vérifiez les logs Supabase
2. Testez avec l'API Moneroo
3. Contactez le support Moneroo si nécessaire 