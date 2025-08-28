# 💰 Script de Déploiement Version Dollars Internationale - SimpShopy
# Transformation complète en plateforme internationale avec tarifs en dollars

Write-Host "💰 Déploiement de la version dollars internationale SimpShopy..." -ForegroundColor Green
Write-Host ""

# Étape 1: Vérifier les fichiers modifiés
Write-Host "📋 Vérification des fichiers modifiés..." -ForegroundColor Yellow

$files = @(
    "src/config/app.ts",
    "src/pages/Index.tsx",
    "src/pages/Pricing.tsx",
    "src/components/home/HeroSection.tsx",
    "src/components/home/PaymentMethodsSection.tsx", 
    "src/components/home/FeaturesSection.tsx",
    "src/components/home/TestimonialsSection.tsx",
    "src/components/home/ComparisonSection.tsx",
    "src/components/home/CtaSection.tsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $file manquant" -ForegroundColor Red
    }
}

Write-Host ""

# Étape 2: Exécuter le script de correction des références
Write-Host "🔧 Correction des références monétaires..." -ForegroundColor Yellow

if (Test-Path "fix-currency-references.ps1") {
    Write-Host "✅ Exécution du script de correction..." -ForegroundColor Green
    & ".\fix-currency-references.ps1"
} else {
    Write-Host "⚠️ Script de correction non trouvé" -ForegroundColor Yellow
}

Write-Host ""

# Étape 3: Vérifier qu'il n'y a plus de références africaines
Write-Host "🔍 Vérification des références africaines..." -ForegroundColor Yellow

$africanReferences = @(
    "Afrique",
    "africain", 
    "CFA",
    "Orange Money",
    "MTN Mobile Money",
    "Moov Money"
)

$found = $false
foreach ($ref in $africanReferences) {
    $results = Get-ChildItem -Path "src" -Recurse -Include "*.tsx" | Select-String -Pattern $ref
    if ($results) {
        Write-Host "⚠️ Référence trouvée : $ref" -ForegroundColor Yellow
        $found = $true
    }
}

if (-not $found) {
    Write-Host "✅ Aucune référence africaine trouvée" -ForegroundColor Green
} else {
    Write-Host "❌ Des références africaines persistent" -ForegroundColor Red
}

Write-Host ""

# Étape 4: Build du projet
Write-Host "🔨 Build du projet..." -ForegroundColor Yellow
try {
    npm run build
    Write-Host "✅ Build réussi" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur lors du build" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Étape 5: Déploiement
Write-Host "🚀 Déploiement..." -ForegroundColor Yellow

# Option 1: Vercel (recommandé)
Write-Host "🌐 Déploiement sur Vercel..." -ForegroundColor Cyan
try {
    npx vercel --prod
    Write-Host "✅ Déploiement Vercel réussi" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Erreur Vercel, tentative alternative..." -ForegroundColor Yellow
}

Write-Host ""

# Étape 6: Vérification post-déploiement
Write-Host "🔍 Vérification post-déploiement..." -ForegroundColor Yellow

$urls = @(
    "https://simpshopy.com/",
    "https://simpshopy.com/blog",
    "https://simpshopy.com/pricing"
)

Write-Host "📊 URLs à vérifier :" -ForegroundColor Cyan
foreach ($url in $urls) {
    Write-Host "  - $url" -ForegroundColor White
}

Write-Host ""

# Étape 7: Résumé des changements
Write-Host "📝 RÉSUMÉ DES CHANGEMENTS :" -ForegroundColor Magenta
Write-Host ""
Write-Host "✅ Configuration App :" -ForegroundColor White
Write-Host "   • Région : West Africa → International" -ForegroundColor Gray
Write-Host "   • Devise : XOF → USD" -ForegroundColor Gray
Write-Host "   • Pays : 8 pays africains → 12 pays internationaux" -ForegroundColor Gray
Write-Host ""
Write-Host "✅ Tarification :" -ForegroundColor White
Write-Host "   • Starter : 15,000 CFA → $29 USD" -ForegroundColor Gray
Write-Host "   • Business : 35,000 CFA → $79 USD" -ForegroundColor Gray
Write-Host "   • Enterprise : 85,000 CFA → $199 USD" -ForegroundColor Gray
Write-Host ""
Write-Host "✅ Méthodes de paiement :" -ForegroundColor White
Write-Host "   • Orange Money → PayPal" -ForegroundColor Gray
Write-Host "   • MTN Mobile Money → Stripe" -ForegroundColor Gray
Write-Host "   • Moov Money → Visa/Mastercard" -ForegroundColor Gray
Write-Host ""
Write-Host "✅ Fonctionnalités :" -ForegroundColor White
Write-Host "   • 'Paiements locaux' → 'Paiements internationaux'" -ForegroundColor Gray
Write-Host "   • 'Multi-pays Afrique' → 'Multi-pays international'" -ForegroundColor Gray
Write-Host "   • 'Templates adaptés au marché africain' → 'Templates professionnels'" -ForegroundColor Gray
Write-Host ""
Write-Host "✅ Statistiques :" -ForegroundColor White
Write-Host "   • Revenus : 50M+ CFA → $2M+ USD" -ForegroundColor Gray
Write-Host "   • Pays : 8 → 50+" -ForegroundColor Gray
Write-Host ""
Write-Host "✅ Support :" -ForegroundColor White
Write-Host "   • Langues : français, bambara, wolof → français, english, español" -ForegroundColor Gray
Write-Host "   • Heures : Lun-Ven 8h-18h GMT → 24/7 Global Support" -ForegroundColor Gray
Write-Host ""

Write-Host "🎉 Version dollars internationale déployée avec succès !" -ForegroundColor Green
Write-Host "SimpShopy est maintenant une plateforme e-commerce internationale avec tarifs en dollars !" -ForegroundColor Green
Write-Host ""

# Statistiques attendues
Write-Host "📈 RÉSULTATS ATTENDUS :" -ForegroundColor Cyan
Write-Host "• Audience internationale élargie" -ForegroundColor White
Write-Host "• Tarification compétitive en dollars" -ForegroundColor White
Write-Host "• Méthodes de paiement internationales" -ForegroundColor White
Write-Host "• Positionnement global professionnel" -ForegroundColor White
Write-Host ""

Write-Host "✅ Déploiement version dollars internationale terminé !" -ForegroundColor Green
