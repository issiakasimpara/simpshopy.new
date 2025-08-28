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
