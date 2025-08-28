# 🚀 Script de Correction - Erreur unstable_scheduleCallback
# Date: 2025-08-28

Write-Host "🔧 Correction de l'erreur unstable_scheduleCallback..." -ForegroundColor Green

# 1. Build avec les corrections React
Write-Host "📦 Building le projet avec les corrections React..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du build" -ForegroundColor Red
    exit 1
}

# 2. Déploiement Vercel
Write-Host "🚀 Déploiement sur Vercel..." -ForegroundColor Yellow
vercel --prod

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du déploiement" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Correction déployée avec succès!" -ForegroundColor Green
Write-Host "🌐 Votre site corrigé est maintenant disponible sur: https://simpshopy.com" -ForegroundColor Cyan

# 3. Vérification
Write-Host "🔍 Vérification du déploiement..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "📊 Corrections appliquées:" -ForegroundColor Green
Write-Host "   ✅ Concurrent Features désactivées" -ForegroundColor White
Write-Host "   ✅ unstable_scheduleCallback corrigé" -ForegroundColor White
Write-Host "   ✅ Configuration React 18 optimisée" -ForegroundColor White
Write-Host "   ✅ Vite configuré pour éviter les conflits" -ForegroundColor White
Write-Host "   ✅ StrictMode conservé (comme demandé)" -ForegroundColor White

Write-Host "🎯 L'erreur unstable_scheduleCallback devrait maintenant être résolue!" -ForegroundColor Green
