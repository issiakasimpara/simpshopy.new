# 🚀 GUIDE D'INTÉGRATION RESEND + SUPABASE NATIVE

## 🎯 **POURQUOI CETTE APPROCHE EST MEILLEURE**

✅ **Intégration native** : Plus fiable que nos tests manuels  
✅ **Configuration automatique** : Resend gère tout  
✅ **Email professionnel** : `noreply@simpshopy.com`  
✅ **Gratuit** : 3,000 emails/mois inclus  
✅ **Templates automatiques** : Resend propose des templates  

---

## 🌐 **ÉTAPE 1 : ACHETER LE DOMAINE SIMPSHOPY.COM**

### **Registrars recommandés :**
- **Namecheap** : ~10€/an
- **OVH** : ~12€/an  
- **Google Domains** : ~15€/an

### **Configuration DNS :**
Une fois le domaine acheté, tu auras besoin de configurer les enregistrements DNS pour Resend.

---

## 🔧 **ÉTAPE 2 : INTÉGRATION RESEND + SUPABASE**

### **1. Aller sur l'intégration**
- Va sur : https://supabase.com/dashboard/project/grutldacuowplosarucp/integrations
- Clique sur **"Resend"**

### **2. Configuration**
- **Nom de domaine** : `simpshopy.com`
- **Clé API** : Resend créera automatiquement une clé nommée "Supabase Integration"
- **Templates** : Resend propose des templates automatiques

### **3. Variables d'environnement**
Supabase configurera automatiquement :
```
RESEND_API_KEY=re_xxxxxxxxxx
RESEND_DOMAIN=simpshopy.com
```

---

## 📧 **ÉTAPE 3 : TEMPLATES D'EMAILS PERSONNALISÉS**

### **Email Client (Confirmation de commande)**
```html
✅ Confirmation de votre commande #{{order_number}}

Bonjour {{customer_name}},

Votre commande a été confirmée et est en cours de traitement.

📦 **Détails de la commande :**
- Numéro : #{{order_number}}
- Montant : {{total_amount}} CFA
- Statut : En préparation

🚚 **Livraison :**
- Délai estimé : {{delivery_time}}
- Adresse : {{shipping_address}}

Merci de votre confiance !
{{store_name}}
```

### **Email Admin (Nouvelle commande)**
```html
🎉 Nouvelle commande #{{order_number}}

Une nouvelle commande a été reçue !

👤 **Client :**
- Nom : {{customer_name}}
- Email : {{customer_email}}

💰 **Commande :**
- Montant : {{total_amount}} CFA
- Produits : {{items_count}} articles

📧 Répondre à : {{customer_email}}
```

---

## 🔄 **ÉTAPE 4 : INTÉGRATION DANS L'APP**

### **Le système est déjà intégré !**

Dans `src/hooks/useOrders.tsx`, l'envoi d'emails est déjà configuré :

```typescript
// Appel automatique de l'Edge Function
const response = await fetch(`${SUPABASE_URL}/functions/v1/send-order-emails`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
  },
  body: JSON.stringify({ 
    orderId: newOrder.id,
    customerName: emailData.customerName,
    customerEmail: emailData.customerEmail,
    storeName: emailData.storeName,
    totalAmount: emailData.total
  })
});
```

### **Déclenchement automatique :**
- ✅ À chaque nouvelle commande
- ✅ Email client automatique
- ✅ Email admin automatique
- ✅ Gestion d'erreurs (non bloquant)

---

## 🧪 **ÉTAPE 5 : TESTER LE SYSTÈME**

### **1. Créer une commande de test**
1. Va sur ton app
2. Ajoute un produit au panier
3. Passe une commande avec ton email
4. Vérifie ta boîte mail

### **2. Vérifier les logs**
Dans Supabase Dashboard :
- **Edge Functions** → **Logs**
- **Database** → **email_logs** (si configuré)

---

## 🎨 **ÉTAPE 6 : PERSONNALISATION**

### **Couleurs de la boutique**
Dans `src/hooks/useOrders.tsx`, ajouter :
```typescript
// Récupérer les couleurs de la boutique
const { data: storeData } = await supabase
  .from('stores')
  .select('primary_color, logo_url')
  .eq('id', orderData.storeId)
  .single();

// Passer aux templates
body: JSON.stringify({ 
  orderId: newOrder.id,
  storeColor: storeData?.primary_color || '#6366f1',
  storeLogo: storeData?.logo_url,
  // ... autres données
})
```

### **Templates personnalisés**
Dans l'Edge Function, utiliser les données pour personnaliser :
- Couleurs de la boutique
- Logo de la boutique
- Informations de contact

---

## 🚀 **AVANTAGES DE CETTE APPROCHE**

### **✅ Professionnel**
- Email `noreply@simpshopy.com`
- Templates modernes
- Gestion automatique

### **✅ Fiable**
- Intégration native Supabase
- Pas de tests manuels
- Gestion d'erreurs automatique

### **✅ Évolutif**
- 3,000 emails/mois gratuits
- Templates personnalisables
- Statistiques automatiques

### **✅ Simple**
- Configuration en 5 minutes
- Pas de code complexe
- Maintenance automatique

---

## 🎯 **PROCHAINES ÉTAPES**

1. **Acheter simpshopy.com** (~10-15€/an)
2. **Configurer l'intégration Resend** (5 minutes)
3. **Tester avec une vraie commande**
4. **Personnaliser les templates** (optionnel)

**Le système d'emails automatiques sera alors 100% fonctionnel !** 🎉 