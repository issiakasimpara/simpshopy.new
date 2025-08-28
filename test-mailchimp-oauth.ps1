# Script de test pour l'intégration Mailchimp OAuth
Write-Host "🔍 Test de l'intégration Mailchimp OAuth" -ForegroundColor Cyan

# 1. Test de la table oauth_integrations
Write-Host "`n📊 Test 1: Vérification de la table oauth_integrations" -ForegroundColor Yellow
$tableTest = @"
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'oauth_integrations'
);
"@

Write-Host "SQL à exécuter dans Supabase Dashboard > SQL Editor:"
Write-Host $tableTest -ForegroundColor Gray

# 2. Test du Edge Function authorize
Write-Host "`n🔗 Test 2: Test du Edge Function authorize" -ForegroundColor Yellow
$authorizeUrl = "https://grutldacuowplosarucp.supabase.co/functions/v1/oauth/mailchimp/authorize?user_id=test&store_id=test&return_url=https://simpshopy.com/integrations/mailchimp"

Write-Host "URL de test: $authorizeUrl" -ForegroundColor Gray
Write-Host "Testez cette URL dans votre navigateur ou avec curl/Postman"

# 3. Test des variables d'environnement
Write-Host "`n🔑 Test 3: Vérification des variables d'environnement" -ForegroundColor Yellow
Write-Host "Dans Supabase Dashboard > Settings > Environment Variables, vérifiez:" -ForegroundColor Gray
Write-Host "- MAILCHIMP_CLIENT_ID=477462211553" -ForegroundColor Gray
Write-Host "- MAILCHIMP_CLIENT_SECRET=83224e7dde454761bd0a29b9bf34b52a63d46b58f00f23cb64" -ForegroundColor Gray
Write-Host "- MAILCHIMP_OAUTH_URL=https://login.mailchimp.com/oauth2/authorize" -ForegroundColor Gray
Write-Host "- MAILCHIMP_TOKEN_URL=https://login.mailchimp.com/oauth2/token" -ForegroundColor Gray
Write-Host "- MAILCHIMP_API_URL=https://us1.api.mailchimp.com/3.0" -ForegroundColor Gray

# 4. Instructions de déploiement
Write-Host "`n🚀 Test 4: Déploiement des Edge Functions" -ForegroundColor Yellow
Write-Host "Dans Supabase Dashboard > Edge Functions:" -ForegroundColor Gray
Write-Host "1. Allez dans 'oauth/mailchimp/authorize'" -ForegroundColor Gray
Write-Host "2. Cliquez sur 'Deploy'" -ForegroundColor Gray
Write-Host "3. Allez dans 'oauth/mailchimp/callback'" -ForegroundColor Gray
Write-Host "4. Cliquez sur 'Deploy'" -ForegroundColor Gray

# 5. Test de l'intégration existante
Write-Host "`n🔄 Test 5: Nettoyage de l'intégration existante" -ForegroundColor Yellow
$cleanupSQL = @"
-- Supprimer l'intégration Mailchimp existante
DELETE FROM installed_integrations 
WHERE integration_id = 'mailchimp' 
AND user_id = 'fb990001-06d0-4fee-9152-027af91ff48f';

-- Supprimer les intégrations OAuth existantes
DELETE FROM oauth_integrations 
WHERE provider = 'mailchimp' 
AND user_id = 'fb990001-06d0-4fee-9152-027af91ff48f';
"@

Write-Host "SQL de nettoyage à exécuter:"
Write-Host $cleanupSQL -ForegroundColor Gray

# 6. Test de la configuration Mailchimp
Write-Host "`n📧 Test 6: Configuration Mailchimp Developer Portal" -ForegroundColor Yellow
Write-Host "Dans https://developer.mailchimp.com/:" -ForegroundColor Gray
Write-Host "1. Allez dans 'Apps' > Votre app Mailchimp" -ForegroundColor Gray
Write-Host "2. Configurez Redirect URI: https://grutldacuowplosarucp.supabase.co/functions/v1/oauth/mailchimp/callback" -ForegroundColor Gray
Write-Host "3. Configurez Scopes: read_write" -ForegroundColor Gray

Write-Host "`n✅ Tests terminés. Suivez les instructions ci-dessus pour résoudre les problèmes." -ForegroundColor Green
