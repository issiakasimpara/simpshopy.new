Write-Host "Auto-deploying Mailchimp integration" -ForegroundColor Cyan

# Configuration
$SUPABASE_PROJECT_ID = "grutldacuowplosarucp"
$SUPABASE_PATH = ".\node_modules\.bin\supabase"

# 1. Check Supabase CLI
Write-Host "`nChecking Supabase CLI..." -ForegroundColor Yellow
try {
    $version = & $SUPABASE_PATH --version
    Write-Host "Supabase CLI: $version" -ForegroundColor Green
} catch {
    Write-Host "Supabase CLI not working. Trying alternative path..." -ForegroundColor Red
    $SUPABASE_PATH = ".\node_modules\supabase\bin\supabase"
    try {
        $version = & $SUPABASE_PATH --version
        Write-Host "Supabase CLI: $version" -ForegroundColor Green
    } catch {
        Write-Host "Supabase CLI not found. Please install manually." -ForegroundColor Red
        exit 1
    }
}

# 2. Login to Supabase
Write-Host "`nLogging in to Supabase..." -ForegroundColor Yellow
Write-Host "You need to login to Supabase. Run this command:" -ForegroundColor Gray
Write-Host "$SUPABASE_PATH login" -ForegroundColor Gray

# 3. Deploy Edge Functions
Write-Host "`nDeploying Edge Functions..." -ForegroundColor Yellow

# Deploy authorize
Write-Host "Deploying oauth/mailchimp/authorize..." -ForegroundColor Gray
try {
    & $SUPABASE_PATH functions deploy oauth/mailchimp/authorize --project-ref $SUPABASE_PROJECT_ID
    Write-Host "authorize deployed successfully" -ForegroundColor Green
} catch {
    Write-Host "Failed to deploy authorize" -ForegroundColor Red
}

# Deploy callback
Write-Host "Deploying oauth/mailchimp/callback..." -ForegroundColor Gray
try {
    & $SUPABASE_PATH functions deploy oauth/mailchimp/callback --project-ref $SUPABASE_PROJECT_ID
    Write-Host "callback deployed successfully" -ForegroundColor Green
} catch {
    Write-Host "Failed to deploy callback" -ForegroundColor Red
}

# 4. Apply database migrations
Write-Host "`nApplying database migrations..." -ForegroundColor Yellow
try {
    & $SUPABASE_PATH db push --project-ref $SUPABASE_PROJECT_ID
    Write-Host "Migrations applied successfully" -ForegroundColor Green
} catch {
    Write-Host "Failed to apply migrations" -ForegroundColor Red
}

# 5. Clean existing integrations
Write-Host "`nCleaning existing integrations..." -ForegroundColor Yellow
Write-Host "Run this SQL in Supabase Dashboard > SQL Editor:" -ForegroundColor Gray
Write-Host "DELETE FROM installed_integrations WHERE integration_id = 'mailchimp';" -ForegroundColor Gray
Write-Host "DELETE FROM oauth_integrations WHERE provider = 'mailchimp';" -ForegroundColor Gray

# 6. Test deployment
Write-Host "`nTesting deployment..." -ForegroundColor Yellow
Write-Host "Test URL: https://$SUPABASE_PROJECT_ID.supabase.co/functions/v1/oauth/mailchimp/authorize?user_id=test&store_id=test" -ForegroundColor Gray

Write-Host "`nDeployment completed!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Configure environment variables in Supabase Dashboard" -ForegroundColor Gray
Write-Host "2. Configure Mailchimp app in https://developer.mailchimp.com/" -ForegroundColor Gray
Write-Host "3. Test integration at https://simpshopy.com/integrations/mailchimp" -ForegroundColor Gray
