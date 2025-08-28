-- Vérifier et créer les tables OAuth si elles n'existent pas

-- 1. Créer la table oauth_integrations
CREATE TABLE IF NOT EXISTS oauth_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  provider_user_id TEXT,
  provider_account_id TEXT,
  metadata JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Créer la table oauth_sync_logs
CREATE TABLE IF NOT EXISTS oauth_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id UUID REFERENCES oauth_integrations(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  status TEXT NOT NULL,
  error_message TEXT,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Créer les index
CREATE INDEX IF NOT EXISTS idx_oauth_integrations_user_store_provider 
ON oauth_integrations(user_id, store_id, provider);

CREATE INDEX IF NOT EXISTS idx_oauth_integrations_active 
ON oauth_integrations(is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_oauth_sync_logs_integration 
ON oauth_sync_logs(integration_id);

-- 4. Activer RLS
ALTER TABLE oauth_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE oauth_sync_logs ENABLE ROW LEVEL SECURITY;

-- 5. Créer les politiques RLS pour oauth_integrations
DROP POLICY IF EXISTS "Users can view their own oauth integrations" ON oauth_integrations;
CREATE POLICY "Users can view their own oauth integrations" ON oauth_integrations
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own oauth integrations" ON oauth_integrations;
CREATE POLICY "Users can insert their own oauth integrations" ON oauth_integrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own oauth integrations" ON oauth_integrations;
CREATE POLICY "Users can update their own oauth integrations" ON oauth_integrations
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own oauth integrations" ON oauth_integrations;
CREATE POLICY "Users can delete their own oauth integrations" ON oauth_integrations
  FOR DELETE USING (auth.uid() = user_id);

-- 6. Créer les politiques RLS pour oauth_sync_logs
DROP POLICY IF EXISTS "Users can view their own oauth sync logs" ON oauth_sync_logs;
CREATE POLICY "Users can view their own oauth sync logs" ON oauth_sync_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM oauth_integrations 
      WHERE oauth_integrations.id = oauth_sync_logs.integration_id 
      AND oauth_integrations.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert their own oauth sync logs" ON oauth_sync_logs;
CREATE POLICY "Users can insert their own oauth sync logs" ON oauth_sync_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM oauth_integrations 
      WHERE oauth_integrations.id = oauth_sync_logs.integration_id 
      AND oauth_integrations.user_id = auth.uid()
    )
  );

-- 7. Créer le trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_oauth_integrations_updated_at ON oauth_integrations;
CREATE TRIGGER update_oauth_integrations_updated_at
    BEFORE UPDATE ON oauth_integrations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 8. Nettoyer les anciennes intégrations Mailchimp si elles existent
DELETE FROM oauth_integrations WHERE provider = 'mailchimp' AND is_active = false;

-- 9. Vérifier que les tables existent
SELECT 
  'oauth_integrations' as table_name,
  COUNT(*) as row_count
FROM oauth_integrations
UNION ALL
SELECT 
  'oauth_sync_logs' as table_name,
  COUNT(*) as row_count
FROM oauth_sync_logs;
