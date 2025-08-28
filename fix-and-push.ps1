# ========================================
# SCRIPT: CORRECTION ACCÈS PUBLIC + PUSH
# ========================================

Write-Host "🔧 Début des corrections..." -ForegroundColor Green

# 1. Ajouter les fichiers de correction
Write-Host "📁 Ajout des fichiers de correction..." -ForegroundColor Yellow
git add fix_public_store_access.sql
git add fix_public_products_access.sql
git add fix_public_templates_access.sql
git add fix_all_public_access.sql
git add src/pages/Storefront.tsx

# 2. Commit des corrections
Write-Host "💾 Commit des corrections..." -ForegroundColor Yellow
git commit -m "Fix: Accès public aux boutiques - RLS policies + template par défaut

- Ajout politiques RLS pour accès public aux boutiques actives
- Ajout politiques RLS pour accès public aux produits
- Ajout politiques RLS pour accès public aux templates publiés
- Template par défaut quand aucun template publié
- Boutiques maintenant accessibles au grand public comme Shopify"

# 3. Push
Write-Host "📤 Push vers GitHub..." -ForegroundColor Yellow
git push

Write-Host "✅ Corrections terminées et pushé!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 PROCHAINES ÉTAPES:" -ForegroundColor Cyan
Write-Host "1. Exécuter le script SQL dans Supabase Dashboard:" -ForegroundColor White
Write-Host "   - Ouvrir Supabase Dashboard" -ForegroundColor Gray
Write-Host "   - Aller dans SQL Editor" -ForegroundColor Gray
Write-Host "   - Copier-coller le contenu de fix_all_public_access.sql" -ForegroundColor Gray
Write-Host "   - Exécuter le script" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Tester l'accès public:" -ForegroundColor White
Write-Host "   - Aller sur simpshopy.com/store/maman" -ForegroundColor Gray
Write-Host "   - Vérifier que la boutique s'affiche sans connexion" -ForegroundColor Gray
Write-Host ""
Write-Host "🎯 RÉSULTAT ATTENDU:" -ForegroundColor Green
Write-Host "✅ Boutiques accessibles au grand public" -ForegroundColor White
Write-Host "✅ Produits visibles sans authentification" -ForegroundColor White
Write-Host "✅ Templates publiés accessibles" -ForegroundColor White
Write-Host "✅ Interface admin protégée" -ForegroundColor White 