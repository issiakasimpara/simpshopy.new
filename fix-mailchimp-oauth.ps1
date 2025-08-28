# Script de correction pour l'intégration Mailchimp OAuth
Write-Host "🔧 Correction de l'intégration Mailchimp OAuth" -ForegroundColor Cyan

# 1. Nettoyage des intégrations existantes
Write-Host "`n🧹 Étape 1: Nettoyage des intégrations existantes" -ForegroundColor Yellow

$cleanupSQL = @"
-- Supprimer l'intégration Mailchimp existante (erreur 409)
DELETE FROM installed_integrations 
WHERE integration_id = 'mailchimp' 
AND user_id = 'fb990001-06d0-4fee-9152-027af91ff48f';

-- Supprimer les intégrations OAuth existantes
DELETE FROM oauth_integrations 
WHERE provider = 'mailchimp' 
AND user_id = 'fb990001-06d0-4fee-9152-027af91ff48f';

-- Vérifier que les tables existent
SELECT 'oauth_integrations' as table_name, EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'oauth_integrations'
) as exists;

SELECT 'oauth_sync_logs' as table_name, EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'oauth_sync_logs'
) as exists;
"@

Write-Host "Exécutez ce SQL dans Supabase Dashboard > SQL Editor:"
Write-Host $cleanupSQL -ForegroundColor Gray

# 2. Recréer les tables si nécessaire
Write-Host "`n📊 Étape 2: Recréation des tables OAuth" -ForegroundColor Yellow

$recreateTablesSQL = @"
-- Recréer les tables OAuth si elles n'existent pas
DO $$ 
BEGIN
    -- Table oauth_integrations
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oauth_integrations') THEN
        CREATE TABLE oauth_integrations (
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
        
        -- Index
        CREATE INDEX idx_oauth_user_id ON oauth_integrations(user_id);
        CREATE INDEX idx_oauth_store_id ON oauth_integrations(store_id);
        CREATE INDEX idx_oauth_provider ON oauth_integrations(provider);
        CREATE INDEX idx_oauth_active ON oauth_integrations(is_active);
        
        -- RLS
        ALTER TABLE oauth_integrations ENABLE ROW LEVEL SECURITY;
        
        -- Policies
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
    END IF;
    
    -- Table oauth_sync_logs
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oauth_sync_logs') THEN
        CREATE TABLE oauth_sync_logs (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            integration_id UUID REFERENCES oauth_integrations(id) ON DELETE CASCADE,
            action TEXT NOT NULL,
            status TEXT NOT NULL,
            data JSONB,
            error_message TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Index
        CREATE INDEX idx_oauth_sync_integration_id ON oauth_sync_logs(integration_id);
        CREATE INDEX idx_oauth_sync_created_at ON oauth_sync_logs(created_at);
        
        -- RLS
        ALTER TABLE oauth_sync_logs ENABLE ROW LEVEL SECURITY;
        
        -- Policies
        DROP POLICY IF EXISTS "Users can view their own oauth sync logs" ON oauth_sync_logs;
        CREATE POLICY "Users can view their own oauth sync logs" ON oauth_sync_logs
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM oauth_integrations 
                    WHERE oauth_integrations.id = oauth_sync_logs.integration_id 
                    AND oauth_integrations.user_id = auth.uid()
                )
            );
            
        DROP POLICY IF EXISTS "Service role can insert oauth sync logs" ON oauth_sync_logs;
        CREATE POLICY "Service role can insert oauth sync logs" ON oauth_sync_logs
            FOR INSERT WITH CHECK (true);
    END IF;
END $$;
"@

Write-Host "Exécutez ce SQL pour recréer les tables si nécessaire:"
Write-Host $recreateTablesSQL -ForegroundColor Gray

# 3. Vérifier les Edge Functions
Write-Host "`n🔗 Étape 3: Vérification des Edge Functions" -ForegroundColor Yellow
Write-Host "Dans Supabase Dashboard > Edge Functions:" -ForegroundColor Gray
Write-Host "1. Vérifiez que 'oauth/mailchimp/authorize' existe et est déployé" -ForegroundColor Gray
Write-Host "2. Vérifiez que 'oauth/mailchimp/callback' existe et est déployé" -ForegroundColor Gray
Write-Host "3. Testez l'URL: https://grutldacuowplosarucp.supabase.co/functions/v1/oauth/mailchimp/authorize?user_id=test&store_id=test" -ForegroundColor Gray

# 4. Vérifier les variables d'environnement
Write-Host "`n🔑 Étape 4: Vérification des variables d'environnement" -ForegroundColor Yellow
Write-Host "Dans Supabase Dashboard > Settings > Environment Variables:" -ForegroundColor Gray
Write-Host "Vérifiez que ces variables sont présentes:" -ForegroundColor Gray
Write-Host "- MAILCHIMP_CLIENT_ID=477462211553" -ForegroundColor Gray
Write-Host "- MAILCHIMP_CLIENT_SECRET=***HIDDEN***" -ForegroundColor Gray
Write-Host "- MAILCHIMP_OAUTH_URL=https://login.mailchimp.com/oauth2/authorize" -ForegroundColor Gray
Write-Host "- MAILCHIMP_TOKEN_URL=https://login.mailchimp.com/oauth2/token" -ForegroundColor Gray
Write-Host "- MAILCHIMP_API_URL=https://us1.api.mailchimp.com/3.0" -ForegroundColor Gray

# 5. Test final
Write-Host "`n🧪 Étape 5: Test final" -ForegroundColor Yellow
Write-Host "Après avoir exécuté les étapes précédentes:" -ForegroundColor Gray
Write-Host "1. Allez sur https://simpshopy.com/integrations/mailchimp" -ForegroundColor Gray
Write-Host "2. Cliquez sur 'Installer Mailchimp'" -ForegroundColor Gray
Write-Host "3. Vérifiez que vous êtes redirigé vers Mailchimp" -ForegroundColor Gray

Write-Host "`n✅ Instructions terminées. Suivez chaque étape dans l'ordre." -ForegroundColor Green
