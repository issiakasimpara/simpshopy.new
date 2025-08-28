# ========================================
# SCRIPT: CORRECTION CONTRASTE LIVRAISONS + PUSH
# ========================================

Write-Host "🎨 Correction contraste des méthodes de livraison..." -ForegroundColor Green

# 1. Ajouter les fichiers de correction
Write-Host "📁 Ajout des fichiers de correction..." -ForegroundColor Yellow
git add src/components/site-builder/blocks/CheckoutBlock.tsx
git add src/pages/Checkout.tsx

# 2. Commit des corrections
Write-Host "💾 Commit des corrections..." -ForegroundColor Yellow
git commit -m "Fix: Contraste des méthodes de livraison sur mobile

- Changement text-gray-600 -> text-gray-700 pour meilleur contraste
- Changement text-gray-500 -> text-gray-700 pour meilleur contraste  
- Ajout text-gray-900 pour les titres des méthodes
- Correction visibilité sur mobile et tablette
- Texte maintenant lisible sur tous les appareils"

# 3. Push
Write-Host "📤 Push vers GitHub..." -ForegroundColor Yellow
git push

Write-Host "✅ Corrections contraste terminées et pushé!" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 RÉSULTAT ATTENDU:" -ForegroundColor Cyan
Write-Host "✅ Texte des méthodes de livraison maintenant lisible sur mobile" -ForegroundColor White
Write-Host "✅ Contraste amélioré pour tous les appareils" -ForegroundColor White
Write-Host "✅ Interface utilisateur optimisée" -ForegroundColor White
Write-Host ""
Write-Host "📱 TEST:" -ForegroundColor Yellow
Write-Host "1. Aller sur simpshopy.com/store/maman" -ForegroundColor Gray
Write-Host "2. Ajouter un produit au panier" -ForegroundColor Gray
Write-Host "3. Aller au checkout" -ForegroundColor Gray
Write-Host "4. Vérifier que le texte des livraisons est lisible sur mobile" -ForegroundColor Gray 