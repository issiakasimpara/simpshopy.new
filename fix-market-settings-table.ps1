# 🔧 Script de Correction de la Table market_settings - SimpShopy
# Crée la table manquante qui cause l'erreur 406

Write-Host "🔧 Correction de la table market_settings manquante..." -ForegroundColor Green
Write-Host ""

# Étape 1: Vérifier si Supabase CLI est installé
Write-Host "📋 Vérification de Supabase CLI..." -ForegroundColor Yellow

try {
    $supabaseVersion = supabase --version
    Write-Host "✅ Supabase CLI trouvé: $supabaseVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI non trouvé. Installation nécessaire..." -ForegroundColor Red
    Write-Host "💡 Installez Supabase CLI: https://supabase.com/docs/guides/cli" -ForegroundColor Cyan
    exit 1
}

# Étape 2: Vérifier la connexion à Supabase
Write-Host ""
Write-Host "🔗 Vérification de la connexion Supabase..." -ForegroundColor Yellow

try {
    $status = supabase status
    Write-Host "✅ Connexion Supabase OK" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur de connexion Supabase" -ForegroundColor Red
    Write-Host "💡 Vérifiez votre configuration Supabase" -ForegroundColor Cyan
    exit 1
}

# Étape 3: Appliquer la migration
Write-Host ""
Write-Host "🚀 Application de la migration market_settings..." -ForegroundColor Yellow

try {
    # Appliquer la migration
    supabase db push
    
    Write-Host "✅ Migration appliquée avec succès !" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur lors de l'application de la migration" -ForegroundColor Red
    Write-Host "💡 Vérifiez les logs ci-dessus" -ForegroundColor Cyan
    exit 1
}

# Étape 4: Vérifier que la table a été créée
Write-Host ""
Write-Host "🔍 Vérification de la création de la table..." -ForegroundColor Yellow

try {
    # Vérifier la structure de la table
    $tableCheck = supabase db diff --schema public
    
    if ($tableCheck -match "market_settings") {
        Write-Host "✅ Table market_settings créée avec succès !" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Table market_settings non trouvée dans le schéma" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ Impossible de vérifier la table (normal si pas de diff)" -ForegroundColor Yellow
}

# Étape 5: Instructions pour tester
Write-Host ""
Write-Host "🎉 Correction terminée !" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Prochaines étapes pour tester :" -ForegroundColor Cyan
Write-Host "1. Rafraîchissez votre application" -ForegroundColor White
Write-Host "2. Allez dans Paramètres → Devise" -ForegroundColor White
Write-Host "3. Testez le changement de devise" -ForegroundColor White
Write-Host "4. Vérifiez que les prix se mettent à jour dans toute l'application" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Si le problème persiste, vérifiez :" -ForegroundColor Yellow
Write-Host "   • Les logs de la console pour les erreurs 406" -ForegroundColor Gray
Write-Host "   • La connexion à Supabase" -ForegroundColor Gray
Write-Host "   • Les politiques RLS de la table market_settings" -ForegroundColor Gray
Write-Host ""
Write-Host "🚀 Le système de devise devrait maintenant fonctionner correctement !" -ForegroundColor Green
