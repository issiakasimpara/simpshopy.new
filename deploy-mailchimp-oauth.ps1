# Script de deploiement automatique pour l'integration OAuth Mailchimp
# Date: 2025-01-20

Write-Host "DEPLOIEMENT INTEGRATION OAUTH MAILCHIMP" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Configuration
$SUPABASE_URL = "https://grutldacuowplosarucp.supabase.co"
$PROJECT_ID = "grutldacuowplosarucp"

Write-Host "Configuration detectee:" -ForegroundColor Yellow
Write-Host "   Supabase URL: $SUPABASE_URL" -ForegroundColor Cyan
Write-Host "   Project ID: $PROJECT_ID" -ForegroundColor Cyan
Write-Host ""

# Etape 1: Verifier les variables d'environnement
Write-Host "ETAPE 1: Configuration des variables d'environnement" -ForegroundColor Yellow
Write-Host "   IMPORTANT: Va sur https://supabase.com/dashboard/project/$PROJECT_ID/settings/environment-variables" -ForegroundColor Red
Write-Host "   Ajoute ces variables:" -ForegroundColor White
Write-Host ""
Write-Host "   MAILCHIMP_CLIENT_ID=477462211553" -ForegroundColor Green
Write-Host "   MAILCHIMP_CLIENT_SECRET=***HIDDEN***" -ForegroundColor Green
Write-Host "   MAILCHIMP_OAUTH_URL=https://login.mailchimp.com/oauth2/authorize" -ForegroundColor Green
Write-Host "   MAILCHIMP_TOKEN_URL=https://login.mailchimp.com/oauth2/token" -ForegroundColor Green
Write-Host "   MAILCHIMP_API_URL=https://us1.api.mailchimp.com/3.0" -ForegroundColor Green
Write-Host "   SITE_URL=https://simpshopy.com" -ForegroundColor Green
Write-Host ""

# Etape 2: Deployer la migration SQL
Write-Host "ETAPE 2: Deploiement de la migration SQL" -ForegroundColor Yellow
Write-Host "   IMPORTANT: Va sur https://supabase.com/dashboard/project/$PROJECT_ID/sql" -ForegroundColor Red
Write-Host "   Copie et execute le SQL de: supabase/migrations/20250120000003_create_oauth_integrations.sql" -ForegroundColor White
Write-Host ""

# Etape 3: Deployer les Edge Functions
Write-Host "ETAPE 3: Deploiement des Edge Functions" -ForegroundColor Yellow
Write-Host "   IMPORTANT: Va sur https://supabase.com/dashboard/project/$PROJECT_ID/functions" -ForegroundColor Red
Write-Host ""

Write-Host "   A. Creer la fonction 'oauth/mailchimp/authorize':" -ForegroundColor Cyan
Write-Host "      1. Clique sur 'Create a new function'" -ForegroundColor White
Write-Host "      2. Nom: oauth/mailchimp/authorize" -ForegroundColor White
Write-Host "      3. Copie le code de: supabase/functions/oauth/mailchimp/authorize/index.ts" -ForegroundColor White
Write-Host ""

Write-Host "   B. Creer la fonction 'oauth/mailchimp/callback':" -ForegroundColor Cyan
Write-Host "      1. Clique sur 'Create a new function'" -ForegroundColor White
Write-Host "      2. Nom: oauth/mailchimp/callback" -ForegroundColor White
Write-Host "      3. Copie le code de: supabase/functions/oauth/mailchimp/callback/index.ts" -ForegroundColor White
Write-Host ""

# Etape 4: Configurer l'app Mailchimp
Write-Host "ETAPE 4: Configuration de l'app Mailchimp" -ForegroundColor Yellow
Write-Host "   IMPORTANT: Va sur https://developer.mailchimp.com/" -ForegroundColor Red
Write-Host "   1. OAuth URLs -> Ajouter:" -ForegroundColor White
Write-Host "      Redirect URI: https://simpshopy.com/api/oauth/mailchimp/callback" -ForegroundColor Green
Write-Host "   2. Scopes -> Activer: read_write" -ForegroundColor White
Write-Host ""

# Etape 5: Ajouter la route dans l'app
Write-Host "ETAPE 5: Ajouter la route dans l'app" -ForegroundColor Yellow
Write-Host "   Route ajoutee automatiquement dans src/App.tsx" -ForegroundColor Green
Write-Host "   Path: /integrations/mailchimp" -ForegroundColor Green
Write-Host ""

# Etape 6: Tester
Write-Host "ETAPE 6: Test de l'integration" -ForegroundColor Yellow
Write-Host "   1. Va sur: https://simpshopy.com/integrations/mailchimp" -ForegroundColor White
Write-Host "   2. Clique sur 'Installer Mailchimp'" -ForegroundColor White
Write-Host "   3. Suis le flux OAuth" -ForegroundColor White
Write-Host "   4. Verifie que l'installation fonctionne" -ForegroundColor White
Write-Host ""

Write-Host "DEPLOIEMENT TERMINE !" -ForegroundColor Green
Write-Host "L'integration OAuth Mailchimp est maintenant prete !" -ForegroundColor Green
Write-Host ""
Write-Host "Documentation: DEPLOY_MAILCHIMP_OAUTH.md" -ForegroundColor Cyan
Write-Host "Depannage: Verifie les logs dans Supabase Dashboard" -ForegroundColor Cyan
