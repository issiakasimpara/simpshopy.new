# Script d'installation des prérequis pour Supabase CLI
Write-Host "🚀 Installation des prérequis pour Supabase CLI" -ForegroundColor Cyan

# 1. Installer Chocolatey (gestionnaire de packages Windows)
Write-Host "`n📦 Étape 1: Installation de Chocolatey" -ForegroundColor Yellow
Write-Host "Exécution en tant qu'administrateur requise..." -ForegroundColor Gray

$chocoInstall = @"
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
"@

Write-Host "Commande à exécuter en tant qu'administrateur:"
Write-Host $chocoInstall -ForegroundColor Gray

# 2. Installer Git (si pas déjà installé)
Write-Host "`n🔧 Étape 2: Vérification de Git" -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "✅ Git est déjà installé: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git n'est pas installé. Installez-le depuis: https://git-scm.com/download/win" -ForegroundColor Red
}

# 3. Installer Node.js (si pas déjà installé)
Write-Host "`n📦 Étape 3: Vérification de Node.js" -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js est déjà installé: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js n'est pas installé. Installez-le depuis: https://nodejs.org/" -ForegroundColor Red
}

# 4. Installer Supabase CLI via Chocolatey
Write-Host "`n🔧 Étape 4: Installation de Supabase CLI" -ForegroundColor Yellow
Write-Host "Après avoir installé Chocolatey, exécutez:" -ForegroundColor Gray
Write-Host "choco install supabase-cli -y" -ForegroundColor Gray

# 5. Alternative: Installation directe
Write-Host "`n🔄 Étape 5: Alternative - Installation directe" -ForegroundColor Yellow
Write-Host "Si Chocolatey ne fonctionne pas, téléchargez manuellement:" -ForegroundColor Gray
Write-Host "1. Allez sur: https://github.com/supabase/cli/releases" -ForegroundColor Gray
Write-Host "2. Téléchargez: supabase_windows_amd64.exe" -ForegroundColor Gray
Write-Host "3. Renommez en: supabase.exe" -ForegroundColor Gray
Write-Host "4. Placez dans: C:\Windows\System32\" -ForegroundColor Gray

# 6. Vérification finale
Write-Host "`n✅ Étape 6: Vérification finale" -ForegroundColor Yellow
Write-Host "Après installation, exécutez:" -ForegroundColor Gray
Write-Host "supabase --version" -ForegroundColor Gray

Write-Host "`n🎯 Instructions complètes:" -ForegroundColor Cyan
Write-Host "1. Ouvrez PowerShell en tant qu'administrateur" -ForegroundColor Gray
Write-Host "2. Exécutez: Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))" -ForegroundColor Gray
Write-Host "3. Exécutez: choco install supabase-cli -y" -ForegroundColor Gray
Write-Host "4. Redémarrez PowerShell" -ForegroundColor Gray
Write-Host "5. Testez: supabase --version" -ForegroundColor Gray

Write-Host "`n✅ Prêt pour l'installation automatique de Supabase CLI!" -ForegroundColor Green
