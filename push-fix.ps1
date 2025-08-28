# Script temporaire pour push les modifications
Write-Host "🚀 Début du push..." -ForegroundColor Green

# Vérifier l'état Git
Write-Host "📊 État Git:" -ForegroundColor Yellow
git status

# Ajouter les modifications
Write-Host "➕ Ajout des fichiers..." -ForegroundColor Yellow
git add src/pages/Storefront.tsx

# Commit
Write-Host "💾 Commit des modifications..." -ForegroundColor Yellow
git commit -m "Fix: Accès public aux boutiques - ajout template par défaut quand aucun template publié"

# Push
Write-Host "📤 Push vers GitHub..." -ForegroundColor Yellow
git push

Write-Host "✅ Push terminé!" -ForegroundColor Green 