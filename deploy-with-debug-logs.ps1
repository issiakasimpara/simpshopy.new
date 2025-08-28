# 🔍 Script de Déploiement - Logs de Debug
# Date: 2025-08-28

Write-Host "🔍 Déploiement avec logs de debug..." -ForegroundColor Green

# 1. Build avec les logs
Write-Host "📦 Building le projet avec les logs de debug..." -ForegroundColor Yellow
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

Write-Host "✅ Déploiement terminé avec succès!" -ForegroundColor Green
Write-Host "🌐 Votre site avec logs est maintenant disponible sur: https://simpshopy.com" -ForegroundColor Cyan

Write-Host "📊 Instructions pour voir les logs:" -ForegroundColor Green
Write-Host "   1. Ouvrez https://simpshopy.com" -ForegroundColor White
Write-Host "   2. Appuyez sur F12 pour ouvrir les DevTools" -ForegroundColor White
Write-Host "   3. Allez dans l'onglet 'Console'" -ForegroundColor White
Write-Host "   4. Cherchez les logs commençant par [DEBUG]" -ForegroundColor White
Write-Host "   5. Identifiez où l'erreur unstable_scheduleCallback se produit" -ForegroundColor White

Write-Host "🎯 Les logs vous aideront à identifier le problème!" -ForegroundColor Green
