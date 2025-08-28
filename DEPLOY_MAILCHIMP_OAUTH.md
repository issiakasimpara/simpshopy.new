# 🚀 GUIDE DE DÉPLOIEMENT INTÉGRATION OAUTH MAILCHIMP

## 🎯 **ÉTAPES DE DÉPLOIEMENT**

### **Étape 1 : Configuration des variables d'environnement**

Va sur : https://supabase.com/dashboard/project/grutldacuowplosarucp/settings/environment-variables

Ajoute ces variables :
```bash
MAILCHIMP_CLIENT_ID=477462211553
MAILCHIMP_CLIENT_SECRET=your_client_secret_here
MAILCHIMP_OAUTH_URL=https://login.mailchimp.com/oauth2/authorize
MAILCHIMP_TOKEN_URL=https://login.mailchimp.com/oauth2/token
MAILCHIMP_API_URL=https://us1.api.mailchimp.com/3.0
SITE_URL=https://simpshopy.com
```

### **Étape 2 : Déployer la migration SQL**

Va sur : https://supabase.com/dashboard/project/grutldacuowplosarucp/sql

Copie et exécute ce SQL :

```sql
-- Migration pour créer les tables OAuth
-- Date: 2025-01-20

-- Table pour stocker les intégrations OAuth
CREATE TABLE IF NOT EXISTS oauth_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  provider TEXT NOT NULL, -- 'mailchimp', 'stripe', etc.
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  provider_user_id TEXT, -- ID utilisateur chez le provider
  provider_account_id TEXT, -- ID compte chez le provider
  metadata JSONB, -- Données supplémentaires (audience_id, etc.)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les logs de synchronisation
CREATE TABLE IF NOT EXISTS oauth_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id UUID REFERENCES oauth_integrations(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'customer_synced', 'campaign_sent', 'token_refreshed'
  status TEXT NOT NULL, -- 'success', 'error', 'pending'
  data JSONB,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_oauth_user_id ON oauth_integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_oauth_store_id ON oauth_integrations(store_id);
CREATE INDEX IF NOT EXISTS idx_oauth_provider ON oauth_integrations(provider);
CREATE INDEX IF NOT EXISTS idx_oauth_active ON oauth_integrations(is_active);
CREATE INDEX IF NOT EXISTS idx_oauth_sync_integration_id ON oauth_sync_logs(integration_id);
CREATE INDEX IF NOT EXISTS idx_oauth_sync_created_at ON oauth_sync_logs(created_at);

-- RLS (Row Level Security)
ALTER TABLE oauth_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE oauth_sync_logs ENABLE ROW LEVEL SECURITY;

-- Policies pour oauth_integrations
CREATE POLICY "Users can view their own oauth integrations" ON oauth_integrations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own oauth integrations" ON oauth_integrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own oauth integrations" ON oauth_integrations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own oauth integrations" ON oauth_integrations
  FOR DELETE USING (auth.uid() = user_id);

-- Policies pour oauth_sync_logs
CREATE POLICY "Users can view their own oauth sync logs" ON oauth_sync_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM oauth_integrations 
      WHERE oauth_integrations.id = oauth_sync_logs.integration_id 
      AND oauth_integrations.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can insert oauth sync logs" ON oauth_sync_logs
  FOR INSERT WITH CHECK (true);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_oauth_integrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour updated_at
CREATE TRIGGER update_oauth_integrations_updated_at_trigger
  BEFORE UPDATE ON oauth_integrations
  FOR EACH ROW
  EXECUTE FUNCTION update_oauth_integrations_updated_at();
```

### **Étape 3 : Déployer les Edge Functions**

Va sur : https://supabase.com/dashboard/project/grutldacuowplosarucp/functions

#### **A. Créer la fonction `oauth/mailchimp/authorize`**

1. Clique sur **"Create a new function"**
2. Nom : `oauth/mailchimp/authorize`
3. Copie le code de `supabase/functions/oauth/mailchimp/authorize/index.ts`

#### **B. Créer la fonction `oauth/mailchimp/callback`**

1. Clique sur **"Create a new function"**
2. Nom : `oauth/mailchimp/callback`
3. Copie le code de `supabase/functions/oauth/mailchimp/callback/index.ts`

### **Étape 4 : Configurer l'app Mailchimp**

Va sur : https://developer.mailchimp.com/

1. **OAuth URLs** → Ajouter :
   ```
   Redirect URI: https://simpshopy.com/api/oauth/mailchimp/callback
   ```

2. **Scopes** → Activer :
   - `read_write` (accès complet)

### **Étape 5 : Ajouter la route dans l'app**

Dans `src/App.tsx`, ajoute la route :

```typescript
import MailchimpIntegration from './pages/integrations/MailchimpIntegration'

// Dans les routes
<Route path="/integrations/mailchimp" element={<MailchimpIntegration />} />
```

### **Étape 6 : Tester l'intégration**

1. Va sur : `https://simpshopy.com/integrations/mailchimp`
2. Clique sur **"Installer Mailchimp"**
3. Suis le flux OAuth
4. Vérifie que l'installation fonctionne

## 🎉 **RÉSULTAT ATTENDU**

Après le déploiement, les créateurs pourront :

1. **Installer Mailchimp en 1 clic** via OAuth
2. **Synchroniser automatiquement** leurs clients
3. **Gérer leurs campagnes** depuis SimpShopy
4. **Voir les analytics** intégrés

## 🔧 **DÉPANNAGE**

### **Erreur "Client ID non configuré"**
- Vérifie que `MAILCHIMP_CLIENT_ID` est bien configuré dans Supabase

### **Erreur "Redirect URI mismatch"**
- Vérifie que l'URL de callback est bien configurée dans l'app Mailchimp

### **Erreur "Token expired"**
- Implémente le refresh automatique des tokens

## 💰 **MODÈLE ÉCONOMIQUE**

Une fois déployé, tu pourras :

- **Commission Mailchimp** : 10-15% sur les abonnements
- **Plan premium** : Automatisations avancées
- **Services** : Templates personnalisés, formation

**🎯 L'intégration OAuth Mailchimp transforme SimpShopy en plateforme d'intégrations professionnelle !**
