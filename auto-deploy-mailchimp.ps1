# Script automatique pour déployer l'intégration Mailchimp
Write-Host "🚀 Déploiement automatique de l'intégration Mailchimp" -ForegroundColor Cyan

# Configuration
$SUPABASE_PROJECT_ID = "grutldacuowplosarucp"
$SUPABASE_ACCESS_TOKEN = "" # À remplir avec votre token d'accès

# 1. Vérifier les prérequis
Write-Host "`n🔍 Étape 1: Vérification des prérequis" -ForegroundColor Yellow

# Vérifier Git
try {
    $gitVersion = git --version
    Write-Host "✅ Git: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git non trouvé. Installez-le depuis: https://git-scm.com/download/win" -ForegroundColor Red
    exit 1
}

# Vérifier Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js non trouvé. Installez-le depuis: https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# 2. Installer Supabase CLI automatiquement
Write-Host "`n📦 Étape 2: Installation de Supabase CLI" -ForegroundColor Yellow

# Essayer d'installer via npm (version locale)
Write-Host "Tentative d'installation via npm..." -ForegroundColor Gray
try {
    npm install supabase --save-dev
    $supabasePath = ".\node_modules\.bin\supabase"
    Write-Host "✅ Supabase CLI installé localement" -ForegroundColor Green
} catch {
    Write-Host "❌ Échec de l'installation npm" -ForegroundColor Red
    
    # Essayer de télécharger directement
    Write-Host "Tentative de téléchargement direct..." -ForegroundColor Gray
    try {
        $url = "https://github.com/supabase/cli/releases/download/v1.145.4/supabase_windows_amd64.exe"
        $output = "supabase.exe"
        
        # Utiliser .NET WebClient comme alternative
        $webClient = New-Object System.Net.WebClient
        $webClient.DownloadFile($url, $output)
        $supabasePath = ".\supabase.exe"
        Write-Host "✅ Supabase CLI téléchargé" -ForegroundColor Green
    } catch {
        Write-Host "❌ Échec du téléchargement. Installation manuelle requise." -ForegroundColor Red
        Write-Host "Instructions manuelles:" -ForegroundColor Gray
        Write-Host "1. Allez sur: https://github.com/supabase/cli/releases" -ForegroundColor Gray
        Write-Host "2. Téléchargez: supabase_windows_amd64.exe" -ForegroundColor Gray
        Write-Host "3. Renommez en: supabase.exe et placez dans ce dossier" -ForegroundColor Gray
        exit 1
    }
}

# 3. Vérifier l'installation
Write-Host "`n🔧 Étape 3: Vérification de Supabase CLI" -ForegroundColor Yellow
try {
    $version = & $supabasePath --version
    Write-Host "✅ Supabase CLI: $version" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI non fonctionnel" -ForegroundColor Red
    exit 1
}

# 4. Login à Supabase
Write-Host "`n🔐 Étape 4: Connexion à Supabase" -ForegroundColor Yellow
Write-Host "Vous devez vous connecter à Supabase. Exécutez:" -ForegroundColor Gray
Write-Host "$supabasePath login" -ForegroundColor Gray

# 5. Déployer les Edge Functions
Write-Host "`n🚀 Étape 5: Déploiement des Edge Functions" -ForegroundColor Yellow

# Déployer authorize
Write-Host "Déploiement de oauth/mailchimp/authorize..." -ForegroundColor Gray
try {
    & $supabasePath functions deploy oauth/mailchimp/authorize --project-ref $SUPABASE_PROJECT_ID
    Write-Host "✅ authorize déployé" -ForegroundColor Green
} catch {
    Write-Host "❌ Échec du déploiement authorize" -ForegroundColor Red
}

# Déployer callback
Write-Host "Déploiement de oauth/mailchimp/callback..." -ForegroundColor Gray
try {
    & $supabasePath functions deploy oauth/mailchimp/callback --project-ref $SUPABASE_PROJECT_ID
    Write-Host "✅ callback déployé" -ForegroundColor Green
} catch {
    Write-Host "❌ Échec du déploiement callback" -ForegroundColor Red
}

# 6. Appliquer les migrations
Write-Host "`n📊 Étape 6: Application des migrations" -ForegroundColor Yellow
try {
    & $supabasePath db push --project-ref $SUPABASE_PROJECT_ID
    Write-Host "✅ Migrations appliquées" -ForegroundColor Green
} catch {
    Write-Host "❌ Échec des migrations" -ForegroundColor Red
}

# 7. Nettoyer les intégrations existantes
Write-Host "`n🧹 Étape 7: Nettoyage des intégrations existantes" -ForegroundColor Yellow
Write-Host "Exécutez ce SQL dans Supabase Dashboard > SQL Editor:" -ForegroundColor Gray
Write-Host "DELETE FROM installed_integrations WHERE integration_id = 'mailchimp';" -ForegroundColor Gray
Write-Host "DELETE FROM oauth_integrations WHERE provider = 'mailchimp';" -ForegroundColor Gray

# 8. Vérification finale
Write-Host "`n✅ Étape 8: Vérification finale" -ForegroundColor Yellow
Write-Host "Testez l'URL: https://$SUPABASE_PROJECT_ID.supabase.co/functions/v1/oauth/mailchimp/authorize?user_id=test&store_id=test" -ForegroundColor Gray

Write-Host "`n🎉 Déploiement terminé!" -ForegroundColor Green
Write-Host "Prochaines étapes:" -ForegroundColor Cyan
Write-Host "1. Configurez les variables d'environnement dans Supabase Dashboard" -ForegroundColor Gray
Write-Host "2. Configurez l'app Mailchimp dans https://developer.mailchimp.com/" -ForegroundColor Gray
Write-Host "3. Testez l'intégration sur https://simpshopy.com/integrations/mailchimp" -ForegroundColor Gray
