Write-Host "Complete Mailchimp integration deployment" -ForegroundColor Cyan

# Configuration
$SUPABASE_PATH = ".\node_modules\.bin\supabase"
$PROJECT_ID = "grutldacuowplosarucp"

# 1. Check Supabase CLI
Write-Host "`nChecking Supabase CLI..." -ForegroundColor Yellow
try {
    $version = & $SUPABASE_PATH --version
    Write-Host "Supabase CLI: $version" -ForegroundColor Green
} catch {
    Write-Host "Supabase CLI not working" -ForegroundColor Red
    exit 1
}

# 2. Deploy Edge Functions
Write-Host "`nDeploying Edge Functions..." -ForegroundColor Yellow

# Deploy authorize
Write-Host "Deploying mailchimp-authorize..." -ForegroundColor Gray
try {
    & $SUPABASE_PATH functions deploy mailchimp-authorize --project-ref $PROJECT_ID
    Write-Host "mailchimp-authorize deployed successfully" -ForegroundColor Green
} catch {
    Write-Host "Failed to deploy mailchimp-authorize" -ForegroundColor Red
}

# Deploy callback
Write-Host "Deploying mailchimp-callback..." -ForegroundColor Gray
try {
    & $SUPABASE_PATH functions deploy mailchimp-callback --project-ref $PROJECT_ID
    Write-Host "mailchimp-callback deployed successfully" -ForegroundColor Green
} catch {
    Write-Host "Failed to deploy mailchimp-callback" -ForegroundColor Red
}

# 3. Apply migrations manually via SQL
Write-Host "`nApplying database migrations..." -ForegroundColor Yellow
Write-Host "Run this SQL in Supabase Dashboard > SQL Editor:" -ForegroundColor Gray

$migrationSQL = @"
-- Create oauth_integrations table if not exists
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

-- Create oauth_sync_logs table if not exists
CREATE TABLE IF NOT EXISTS oauth_sync_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    integration_id UUID REFERENCES oauth_integrations(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    status TEXT NOT NULL,
    data JSONB,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_oauth_user_id ON oauth_integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_oauth_store_id ON oauth_integrations(store_id);
CREATE INDEX IF NOT EXISTS idx_oauth_provider ON oauth_integrations(provider);
CREATE INDEX IF NOT EXISTS idx_oauth_active ON oauth_integrations(is_active);
CREATE INDEX IF NOT EXISTS idx_oauth_sync_integration_id ON oauth_sync_logs(integration_id);
CREATE INDEX IF NOT EXISTS idx_oauth_sync_created_at ON oauth_sync_logs(created_at);

-- Enable RLS
ALTER TABLE oauth_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE oauth_sync_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for oauth_integrations
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

-- Create policies for oauth_sync_logs
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

-- Clean existing integrations
DELETE FROM installed_integrations WHERE integration_id = 'mailchimp';
DELETE FROM oauth_integrations WHERE provider = 'mailchimp';
"@

Write-Host $migrationSQL -ForegroundColor Gray

# 4. Test deployment
Write-Host "`nTesting deployment..." -ForegroundColor Yellow
Write-Host "Test URLs:" -ForegroundColor Gray
Write-Host "1. Authorize: https://$PROJECT_ID.supabase.co/functions/v1/mailchimp-authorize?user_id=test&store_id=test" -ForegroundColor Gray
Write-Host "2. Callback: https://$PROJECT_ID.supabase.co/functions/v1/mailchimp-callback" -ForegroundColor Gray

# 5. Environment variables
Write-Host "`nEnvironment Variables to configure:" -ForegroundColor Yellow
Write-Host "In Supabase Dashboard > Settings > Environment Variables:" -ForegroundColor Gray
Write-Host "- MAILCHIMP_CLIENT_ID=477462211553" -ForegroundColor Gray
Write-Host "- MAILCHIMP_CLIENT_SECRET=***HIDDEN***" -ForegroundColor Gray
Write-Host "- MAILCHIMP_OAUTH_URL=https://login.mailchimp.com/oauth2/authorize" -ForegroundColor Gray
Write-Host "- MAILCHIMP_TOKEN_URL=https://login.mailchimp.com/oauth2/token" -ForegroundColor Gray
Write-Host "- MAILCHIMP_API_URL=https://us1.api.mailchimp.com/3.0" -ForegroundColor Gray

# 6. Mailchimp app configuration
Write-Host "`nMailchimp App Configuration:" -ForegroundColor Yellow
Write-Host "In https://developer.mailchimp.com/:" -ForegroundColor Gray
Write-Host "1. Go to Apps > Your Mailchimp app" -ForegroundColor Gray
Write-Host "2. Set Redirect URI: https://$PROJECT_ID.supabase.co/functions/v1/mailchimp-callback" -ForegroundColor Gray
Write-Host "3. Set Scopes: read_write" -ForegroundColor Gray

Write-Host "`nDeployment completed!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Execute the SQL above in Supabase Dashboard" -ForegroundColor Gray
Write-Host "2. Configure environment variables" -ForegroundColor Gray
Write-Host "3. Configure Mailchimp app" -ForegroundColor Gray
Write-Host "4. Test at https://simpshopy.com/integrations/mailchimp" -ForegroundColor Gray
