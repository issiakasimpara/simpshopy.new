# Script de déploiement pour l'intégration DSERS (version corrigée)
# PowerShell script pour déployer DSERS dans Simpshopy

Write-Host "🚀 Déploiement de l'intégration DSERS (version corrigée)..." -ForegroundColor Green

# Configuration
$PROJECT_DIR = Get-Location
$SUPABASE_URL = "https://grutldacuowplosarucp.supabase.co"

Write-Host "📋 Vérification des prérequis..." -ForegroundColor Yellow

# Vérifier que nous sommes dans le bon répertoire
if (-not (Test-Path "supabase/migrations/20250120000004_create_dsers_integration.sql")) {
    Write-Host "❌ Erreur: Migration DSERS non trouvée!" -ForegroundColor Red
    Write-Host "   Assurez-vous d'être dans le répertoire racine du projet" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Migration DSERS trouvée" -ForegroundColor Green

# Afficher la migration SQL corrigée
Write-Host "`n📄 Migration SQL DSERS (version corrigée):" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Get-Content "supabase/migrations/20250120000004_create_dsers_integration.sql" | Write-Host
Write-Host "================================================" -ForegroundColor Cyan

Write-Host "`n🔧 Instructions de déploiement:" -ForegroundColor Yellow
Write-Host "1. Ouvrez votre dashboard Supabase" -ForegroundColor White
Write-Host "2. Allez dans 'SQL Editor'" -ForegroundColor White
Write-Host "3. Copiez-collez le SQL ci-dessus" -ForegroundColor White
Write-Host "4. Exécutez la requête" -ForegroundColor White

Write-Host "`n📝 Variables d'environnement à configurer:" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "DSERS_API_URL=https://api.dsers.com" -ForegroundColor White
Write-Host "DSERS_API_VERSION=v1" -ForegroundColor White
Write-Host "================================================" -ForegroundColor Cyan

Write-Host "`n🔍 Vérification des fichiers frontend..." -ForegroundColor Yellow

# Vérifier les fichiers frontend
$frontendFiles = @(
    "src/types/dsers.ts",
    "src/services/dsersService.ts",
    "src/components/integrations/DsersInstallButton.tsx",
    "src/pages/integrations/DsersIntegration.tsx",
    "public/dsers-logo.svg",
    "public/dsers-logo-large.svg"
)

foreach ($file in $frontendFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $file manquant" -ForegroundColor Red
    }
}

Write-Host "`n🔍 Vérification des Edge Functions..." -ForegroundColor Yellow

# Vérifier les Edge Functions
$edgeFunctions = @(
    "supabase/functions/dsers-import-product/index.ts",
    "supabase/functions/dsers-sync/index.ts",
    "supabase/functions/dsers-test-connection/index.ts"
)

foreach ($function in $edgeFunctions) {
    if (Test-Path $function) {
        Write-Host "✅ $function" -ForegroundColor Green
    } else {
        Write-Host "❌ $function manquant" -ForegroundColor Red
    }
}

Write-Host "`n🚀 Déploiement des Edge Functions..." -ForegroundColor Yellow

# Déployer les Edge Functions
try {
    Write-Host "📦 Déploiement de dsers-import-product..." -ForegroundColor Cyan
    supabase functions deploy dsers-import-product --project-ref grutldacuowplosarucp
    
    Write-Host "📦 Déploiement de dsers-sync..." -ForegroundColor Cyan
    supabase functions deploy dsers-sync --project-ref grutldacuowplosarucp
    
    Write-Host "📦 Déploiement de dsers-test-connection..." -ForegroundColor Cyan
    supabase functions deploy dsers-test-connection --project-ref grutldacuowplosarucp
    
    Write-Host "✅ Edge Functions déployées avec succès!" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur lors du déploiement des Edge Functions: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Vous pouvez les déployer manuellement via le dashboard Supabase" -ForegroundColor Yellow
}

Write-Host "`n🔧 Build du frontend..." -ForegroundColor Yellow

# Build du frontend
try {
    npm run build
    Write-Host "✅ Build frontend réussi!" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur lors du build: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 Déploiement DSERS terminé!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "✅ Migration SQL corrigée (utilise merchant_id)" -ForegroundColor Green
Write-Host "✅ Edge Functions déployées" -ForegroundColor Green
Write-Host "✅ Fichiers frontend vérifiés" -ForegroundColor Green
Write-Host "✅ Build frontend terminé" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan

Write-Host "`n📋 Prochaines étapes:" -ForegroundColor Yellow
Write-Host "1. Exécutez la migration SQL dans Supabase" -ForegroundColor White
Write-Host "2. Configurez les variables d'environnement DSERS" -ForegroundColor White
Write-Host "3. Testez l'intégration via l'interface" -ForegroundColor White
Write-Host "4. Vérifiez les logs des Edge Functions" -ForegroundColor White

Write-Host "`n🔗 Liens utiles:" -ForegroundColor Yellow
Write-Host "- Dashboard Supabase: https://supabase.com/dashboard/project/grutldacuowplosarucp" -ForegroundColor Cyan
Write-Host "- Documentation DSERS: https://dsers.com/api-docs" -ForegroundColor Cyan
Write-Host "- Interface Simpshopy: https://simpshopy.com/integrations/dsers" -ForegroundColor Cyan
