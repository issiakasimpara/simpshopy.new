Write-Host "Fix Mailchimp OAuth Integration" -ForegroundColor Cyan

Write-Host "`nStep 1: Clean existing integrations" -ForegroundColor Yellow
Write-Host "Run this SQL in Supabase Dashboard > SQL Editor:" -ForegroundColor Gray
Write-Host "DELETE FROM installed_integrations WHERE integration_id = 'mailchimp' AND user_id = 'fb990001-06d0-4fee-9152-027af91ff48f';" -ForegroundColor Gray
Write-Host "DELETE FROM oauth_integrations WHERE provider = 'mailchimp' AND user_id = 'fb990001-06d0-4fee-9152-027af91ff48f';" -ForegroundColor Gray

Write-Host "`nStep 2: Check tables exist" -ForegroundColor Yellow
Write-Host "Run this SQL to check if tables exist:" -ForegroundColor Gray
Write-Host "SELECT 'oauth_integrations' as table_name, EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oauth_integrations') as exists;" -ForegroundColor Gray

Write-Host "`nStep 3: Deploy Edge Functions" -ForegroundColor Yellow
Write-Host "In Supabase Dashboard > Edge Functions:" -ForegroundColor Gray
Write-Host "1. Go to 'oauth/mailchimp/authorize' and click 'Deploy'" -ForegroundColor Gray
Write-Host "2. Go to 'oauth/mailchimp/callback' and click 'Deploy'" -ForegroundColor Gray

Write-Host "`nStep 4: Check Environment Variables" -ForegroundColor Yellow
Write-Host "In Supabase Dashboard > Settings > Environment Variables:" -ForegroundColor Gray
Write-Host "Verify these variables exist:" -ForegroundColor Gray
Write-Host "- MAILCHIMP_CLIENT_ID=477462211553" -ForegroundColor Gray
Write-Host "- MAILCHIMP_CLIENT_SECRET=***HIDDEN***" -ForegroundColor Gray
Write-Host "- MAILCHIMP_OAUTH_URL=https://login.mailchimp.com/oauth2/authorize" -ForegroundColor Gray
Write-Host "- MAILCHIMP_TOKEN_URL=https://login.mailchimp.com/oauth2/token" -ForegroundColor Gray
Write-Host "- MAILCHIMP_API_URL=https://us1.api.mailchimp.com/3.0" -ForegroundColor Gray

Write-Host "`nStep 5: Test URL" -ForegroundColor Yellow
Write-Host "Test this URL in browser:" -ForegroundColor Gray
Write-Host "https://grutldacuowplosarucp.supabase.co/functions/v1/oauth/mailchimp/authorize?user_id=test&store_id=test" -ForegroundColor Gray

Write-Host "`nStep 6: Configure Mailchimp App" -ForegroundColor Yellow
Write-Host "In https://developer.mailchimp.com/:" -ForegroundColor Gray
Write-Host "1. Go to Apps > Your Mailchimp app" -ForegroundColor Gray
Write-Host "2. Set Redirect URI: https://grutldacuowplosarucp.supabase.co/functions/v1/oauth/mailchimp/callback" -ForegroundColor Gray
Write-Host "3. Set Scopes: read_write" -ForegroundColor Gray

Write-Host "`nDone! Follow these steps in order." -ForegroundColor Green
