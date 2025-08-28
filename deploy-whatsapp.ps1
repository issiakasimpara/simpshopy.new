# 🚀 Script de Déploiement WhatsApp Gupshup pour SimpShopy
# PowerShell Script

Write-Host "🚀 Déploiement de l'intégration WhatsApp Gupshup..." -ForegroundColor Green

# Vérifier que Supabase CLI est installé
try {
    $supabaseVersion = supabase --version
    Write-Host "✅ Supabase CLI détecté: $supabaseVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI non trouvé. Installez-le d'abord:" -ForegroundColor Red
    Write-Host "npm install -g supabase" -ForegroundColor Yellow
    exit 1
}

# Vérifier la connexion au projet
Write-Host "🔍 Vérification de la connexion au projet Supabase..." -ForegroundColor Blue
try {
    $projectInfo = supabase status
    Write-Host "✅ Connecté au projet Supabase" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur de connexion au projet Supabase" -ForegroundColor Red
    Write-Host "Vérifiez que vous êtes dans le bon répertoire et connecté" -ForegroundColor Yellow
    exit 1
}

# Déployer la fonction Edge WhatsApp
Write-Host "📦 Déploiement de la fonction Edge whatsapp-send..." -ForegroundColor Blue
try {
    supabase functions deploy whatsapp-send --no-verify-jwt
    Write-Host "✅ Fonction Edge whatsapp-send déployée avec succès!" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur lors du déploiement de la fonction Edge" -ForegroundColor Red
    Write-Host "Vérifiez les logs pour plus de détails" -ForegroundColor Yellow
    exit 1
}

# Vérifier le déploiement
Write-Host "🔍 Vérification du déploiement..." -ForegroundColor Blue
try {
    $functions = supabase functions list
    Write-Host "✅ Fonctions Edge disponibles:" -ForegroundColor Green
    Write-Host $functions -ForegroundColor Cyan
} catch {
    Write-Host "⚠️ Impossible de lister les fonctions Edge" -ForegroundColor Yellow
}

# Appliquer la migration de base de données
Write-Host "🗄️ Application de la migration de base de données..." -ForegroundColor Blue
try {
    supabase db push
    Write-Host "✅ Migration de base de données appliquée avec succès!" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur lors de l'application de la migration" -ForegroundColor Red
    Write-Host "Vérifiez les logs pour plus de détails" -ForegroundColor Yellow
    exit 1
}

# Instructions de configuration
Write-Host "`n🎯 PROCHAINES ÉTAPES:" -ForegroundColor Magenta
Write-Host "1. Configurez vos variables d'environnement Gupshup dans Supabase:" -ForegroundColor White
Write-Host "   - GUPSHUP_API_KEY" -ForegroundColor Cyan
Write-Host "   - GUPSHUP_APP_NAME" -ForegroundColor Cyan
Write-Host "   - GUPSHUP_CHANNEL_ID" -ForegroundColor Cyan
Write-Host "   - GUPSHUP_API_URL" -ForegroundColor Cyan

Write-Host "`n2. Testez l'intégration avec le panneau de test WhatsApp" -ForegroundColor White
Write-Host "3. Vérifiez que les notifications fonctionnent" -ForegroundColor White

Write-Host "`n📚 Documentation:" -ForegroundColor Magenta
Write-Host "- Guide complet: WHATSAPP_INTEGRATION_GUIDE.md" -ForegroundColor Cyan
Write-Host "- Configuration: GUPSHUP_CONFIG_EXAMPLE.md" -ForegroundColor Cyan

Write-Host "`n🎉 Déploiement terminé avec succès!" -ForegroundColor Green
Write-Host "Votre intégration WhatsApp Gupshup est maintenant prête!" -ForegroundColor Green
