# 🛒 Guide des Paniers Abandonnés

## 📋 Vue d'ensemble

La fonctionnalité **Paniers abandonnés** permet de suivre les clients qui ont ajouté des produits à leur panier mais n'ont pas finalisé leur achat. Cela vous aide à :

- 📊 **Analyser** le comportement des clients
- 💰 **Identifier** les ventes perdues
- 📧 **Relancer** les clients avec des emails de rappel
- 📈 **Améliorer** votre taux de conversion

## 🚀 Installation

### 1. Créer la table `cart_sessions`

Exécutez ce script SQL dans votre dashboard Supabase :

```sql
-- Création de la table cart_sessions pour les paniers abandonnés
CREATE TABLE IF NOT EXISTS cart_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  items JSONB DEFAULT '[]'::jsonb,
  customer_info JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days')
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_cart_sessions_session_id ON cart_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_cart_sessions_store_id ON cart_sessions(store_id);
CREATE INDEX IF NOT EXISTS idx_cart_sessions_created_at ON cart_sessions(created_at);

-- RLS (Row Level Security) pour la sécurité
ALTER TABLE cart_sessions ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité
CREATE POLICY "Users can view their store cart sessions" ON cart_sessions
  FOR SELECT USING (
    store_id IN (
      SELECT id FROM stores WHERE merchant_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert cart sessions" ON cart_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their store cart sessions" ON cart_sessions
  FOR UPDATE USING (
    store_id IN (
      SELECT id FROM stores WHERE merchant_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their store cart sessions" ON cart_sessions
  FOR DELETE USING (
    store_id IN (
      SELECT id FROM stores WHERE merchant_id = auth.uid()
    )
  );
```

### 2. Redéployer l'application

```bash
npm run build
git add .
git commit -m "Ajout fonctionnalité paniers abandonnés"
git push
```

## 📱 Utilisation

### Accès à la fonctionnalité

1. **Connectez-vous** à votre dashboard SimpShopy
2. **Allez dans** l'onglet "Commandes"
3. **Cliquez sur** l'onglet "Paniers abandonnés"

### Interface

L'interface affiche :

- 🆔 **ID de session** (8 derniers caractères)
- 📅 **Date de création** du panier
- 👤 **Informations client** (email, nom, téléphone)
- 📦 **Articles** dans le panier
- 💰 **Valeur totale** du panier
- ⏰ **Nombre de jours** depuis l'abandon
- 🏷️ **Badge de priorité** (rouge si > 7 jours, orange si > 3 jours)

### Actions disponibles

#### 📧 Envoyer un rappel
- **Cliquez sur** "Envoyer rappel"
- **Un email** sera envoyé au client
- **Disponible uniquement** si le client a fourni un email

#### 🗑️ Supprimer le panier
- **Cliquez sur** "Supprimer"
- **Le panier** sera définitivement supprimé
- **Utilisez** pour nettoyer les anciens paniers

## 🔧 Fonctionnement technique

### Comment ça marche

1. **Client ajoute** des produits au panier
2. **Système sauvegarde** automatiquement la session
3. **Client commence** le processus de checkout
4. **Informations client** sont sauvegardées
5. **Si paiement échoue** ou client abandonne → **Paniers abandonnés**

### Données collectées

- 📦 **Articles** : nom, prix, quantité
- 👤 **Client** : email, nom, téléphone, adresse
- 🏪 **Boutique** : ID de la boutique
- ⏰ **Temps** : date de création et mise à jour

### Sécurité

- 🔒 **RLS activé** : seuls les propriétaires de boutique voient leurs données
- 🗂️ **Isolation** : chaque boutique voit uniquement ses paniers
- ⏳ **Expiration** : sessions supprimées après 30 jours

## 📊 Statistiques utiles

### Métriques à surveiller

- **Taux d'abandon** = (Paniers abandonnés / Total paniers) × 100
- **Valeur perdue** = Somme des valeurs des paniers abandonnés
- **Temps moyen** avant abandon
- **Articles les plus abandonnés**

### Actions recommandées

1. **Analyser** les raisons d'abandon
2. **Optimiser** le processus de checkout
3. **Envoyer** des emails de rappel ciblés
4. **Ajuster** les prix ou offres
5. **Améliorer** l'expérience utilisateur

## 🎯 Bonnes pratiques

### Email de rappel

- **Envoyez** dans les 24h suivant l'abandon
- **Personnalisez** avec le nom du client
- **Incluez** les articles abandonnés
- **Proposez** une réduction ou offre spéciale
- **Rendez** facile de finaliser l'achat

### Nettoyage

- **Supprimez** les paniers de plus de 30 jours
- **Archivez** les données importantes
- **Surveillez** les performances

## 🚨 Dépannage

### Problèmes courants

#### "Aucun panier abandonné affiché"
- ✅ **Normal** si tous vos clients finalisent leurs achats
- ✅ **Vérifiez** que la table `cart_sessions` existe
- ✅ **Testez** en abandonnant un panier

#### "Erreur lors de l'envoi d'email"
- ⚠️ **Fonctionnalité** en développement
- ⚠️ **Intégrez** un service d'email (SendGrid, Mailgun)
- ⚠️ **Configurez** les webhooks

#### "Données incorrectes"
- ✅ **Vérifiez** les politiques RLS
- ✅ **Assurez-vous** d'être connecté
- ✅ **Vérifiez** les permissions

## 🔮 Évolutions futures

### Fonctionnalités prévues

- 📧 **Emails automatiques** de rappel
- 📊 **Tableau de bord** avec métriques
- 🎯 **Segmentation** des clients
- 💰 **Calcul ROI** des campagnes de relance
- 🤖 **IA** pour prédire les abandons

### Intégrations

- 📧 **SendGrid** pour les emails
- 📊 **Google Analytics** pour le tracking
- 💬 **Chat en direct** pour l'assistance
- 📱 **Notifications push** mobiles

---

**💡 Conseil** : Utilisez cette fonctionnalité pour transformer vos paniers abandonnés en ventes réelles ! 