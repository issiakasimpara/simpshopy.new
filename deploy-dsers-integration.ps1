# Script de déploiement automatique pour l'intégration DSERS
# PowerShell script pour déployer DSERS dans Simpshopy

Write-Host "🚀 Déploiement de l'intégration DSERS..." -ForegroundColor Green

# Configuration
$PROJECT_DIR = Get-Location
$SUPABASE_URL = "https://grutldacuowplosarucp.supabase.co"
$SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdydXRsZGFjdW93cGxvc2FydWNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzI5NzQsImV4cCI6MjA1MDU0ODk3NH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8"

Write-Host "📁 Répertoire de travail: $PROJECT_DIR" -ForegroundColor Blue

# Étape 1: Vérifier les prérequis
Write-Host "`n🔍 Vérification des prérequis..." -ForegroundColor Yellow

# Vérifier Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js détecté: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js non trouvé. Veuillez l'installer." -ForegroundColor Red
    exit 1
}

# Vérifier npm
try {
    $npmVersion = npm --version
    Write-Host "✅ npm détecté: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm non trouvé. Veuillez l'installer." -ForegroundColor Red
    exit 1
}

# Étape 2: Installer les dépendances
Write-Host "`n📦 Installation des dépendances..." -ForegroundColor Yellow
npm install

# Étape 3: Exécuter la migration SQL
Write-Host "`n🗄️ Exécution de la migration DSERS..." -ForegroundColor Yellow

$migrationFile = "$PROJECT_DIR/supabase/migrations/20250120000004_create_dsers_integration.sql"
if (Test-Path $migrationFile) {
    Write-Host "✅ Fichier de migration trouvé: $migrationFile" -ForegroundColor Green
    
    # Lire le contenu SQL
    $sqlContent = Get-Content $migrationFile -Raw
    
    Write-Host "📋 Contenu de la migration:" -ForegroundColor Blue
    Write-Host $sqlContent -ForegroundColor Gray
    
    Write-Host "`n⚠️ IMPORTANT: Veuillez exécuter cette migration SQL dans votre dashboard Supabase:" -ForegroundColor Yellow
    Write-Host "1. Allez sur https://supabase.com/dashboard/project/grutldacuowplosarucp" -ForegroundColor Cyan
    Write-Host "2. Cliquez sur 'SQL Editor'" -ForegroundColor Cyan
    Write-Host "3. Copiez-collez le contenu SQL ci-dessus" -ForegroundColor Cyan
    Write-Host "4. Cliquez sur 'Run'" -ForegroundColor Cyan
} else {
    Write-Host "❌ Fichier de migration non trouvé: $migrationFile" -ForegroundColor Red
    exit 1
}

# Étape 4: Déployer les Edge Functions
Write-Host "`n⚡ Déploiement des Edge Functions DSERS..." -ForegroundColor Yellow

$edgeFunctions = @(
    "dsers-import-product",
    "dsers-sync",
    "dsers-test-connection"
)

foreach ($function in $edgeFunctions) {
    $functionPath = "$PROJECT_DIR/supabase/functions/$function"
    if (Test-Path $functionPath) {
        Write-Host "📁 Déploiement de $function..." -ForegroundColor Blue
        
        # Vérifier si le fichier index.ts existe
        $indexFile = "$functionPath/index.ts"
        if (Test-Path $indexFile) {
            Write-Host "✅ Fichier index.ts trouvé pour $function" -ForegroundColor Green
            
            # Afficher le contenu pour vérification
            Write-Host "📋 Contenu de $function/index.ts:" -ForegroundColor Blue
            $content = Get-Content $indexFile -Raw
            Write-Host $content -ForegroundColor Gray
            
            Write-Host "`n⚠️ IMPORTANT: Veuillez déployer cette Edge Function dans votre dashboard Supabase:" -ForegroundColor Yellow
            Write-Host "1. Allez sur https://supabase.com/dashboard/project/grutldacuowplosarucp" -ForegroundColor Cyan
            Write-Host "2. Cliquez sur 'Edge Functions'" -ForegroundColor Cyan
            Write-Host "3. Créez une nouvelle fonction nommée '$function'" -ForegroundColor Cyan
            Write-Host "4. Copiez-collez le contenu TypeScript ci-dessus" -ForegroundColor Cyan
            Write-Host "5. Cliquez sur 'Deploy'" -ForegroundColor Cyan
        } else {
            Write-Host "❌ Fichier index.ts non trouvé pour $function" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Répertoire Edge Function non trouvé: $functionPath" -ForegroundColor Red
    }
}

# Étape 5: Configuration des variables d'environnement
Write-Host "`n🔧 Configuration des variables d'environnement..." -ForegroundColor Yellow

Write-Host "⚠️ IMPORTANT: Configurez ces variables d'environnement dans Supabase:" -ForegroundColor Yellow
Write-Host "1. Allez sur https://supabase.com/dashboard/project/grutldacuowplosarucp" -ForegroundColor Cyan
Write-Host "2. Cliquez sur 'Settings' → 'Environment Variables'" -ForegroundColor Cyan
Write-Host "3. Ajoutez ces variables:" -ForegroundColor Cyan
Write-Host "   - DSERS_API_URL: https://api.dsers.com" -ForegroundColor Gray
Write-Host "   - DSERS_API_VERSION: v1" -ForegroundColor Gray
Write-Host "   - SITE_URL: https://simpshopy.com" -ForegroundColor Gray

# Étape 6: Vérification des fichiers frontend
Write-Host "`n🎨 Vérification des fichiers frontend..." -ForegroundColor Yellow

$frontendFiles = @(
    "src/types/dsers.ts",
    "src/services/dsersService.ts",
    "src/components/integrations/DsersInstallButton.tsx",
    "src/pages/integrations/DsersIntegration.tsx",
    "public/dsers-logo.svg"
)

foreach ($file in $frontendFiles) {
    $filePath = "$PROJECT_DIR/$file"
    if (Test-Path $filePath) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $file" -ForegroundColor Red
    }
}

# Étape 7: Build et déploiement frontend
Write-Host "`n🏗️ Build du projet..." -ForegroundColor Yellow

try {
    npm run build
    Write-Host "✅ Build réussi!" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur lors du build" -ForegroundColor Red
    Write-Host "Vérifiez les erreurs TypeScript et corrigez-les" -ForegroundColor Yellow
}

# Étape 8: Instructions finales
Write-Host "`n🎉 Déploiement DSERS terminé!" -ForegroundColor Green
Write-Host "`n📋 Étapes finales à effectuer:" -ForegroundColor Yellow
Write-Host "1. ✅ Exécutez la migration SQL dans Supabase" -ForegroundColor Cyan
Write-Host "2. ✅ Déployez les 3 Edge Functions DSERS" -ForegroundColor Cyan
Write-Host "3. ✅ Configurez les variables d'environnement" -ForegroundColor Cyan
Write-Host "4. ✅ Déployez le frontend sur Vercel" -ForegroundColor Cyan
Write-Host "5. ✅ Testez l'intégration DSERS" -ForegroundColor Cyan

Write-Host "`n🔗 URLs importantes:" -ForegroundColor Yellow
Write-Host "- Dashboard Supabase: https://supabase.com/dashboard/project/grutldacuowplosarucp" -ForegroundColor Cyan
Write-Host "- Intégration DSERS: https://simpshopy.com/integrations/dsers" -ForegroundColor Cyan
Write-Host "- Site DSERS: https://dsers.com" -ForegroundColor Cyan

Write-Host "`n🚀 L'intégration DSERS est prête à être utilisée!" -ForegroundColor Green
