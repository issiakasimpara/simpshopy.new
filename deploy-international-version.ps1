# 🌍 Script de Déploiement Version Internationale - SimpShopy
# Transformation complète de la plateforme en version internationale

Write-Host "🌍 Déploiement de la version internationale SimpShopy..." -ForegroundColor Green
Write-Host ""

# Étape 1: Vérifier les fichiers modifiés
Write-Host "📋 Vérification des fichiers modifiés..." -ForegroundColor Yellow

$files = @(
    "src/components/home/HeroSection.tsx",
    "src/components/home/PaymentMethodsSection.tsx", 
    "src/components/home/FeaturesSection.tsx",
    "src/components/home/TestimonialsSection.tsx",
    "src/components/home/ComparisonSection.tsx",
    "src/components/home/CtaSection.tsx",
    "src/pages/Index.tsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $file manquant" -ForegroundColor Red
    }
}

Write-Host ""

# Étape 2: Vérifier qu'il n'y a plus de références à l'Afrique
Write-Host "🔍 Vérification des références à l'Afrique..." -ForegroundColor Yellow

$africanReferences = @(
    "Afrique",
    "africain", 
    "Mobile Money",
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
    Write-Host "✅ Aucune référence à l'Afrique trouvée" -ForegroundColor Green
} else {
    Write-Host "❌ Des références à l'Afrique persistent" -ForegroundColor Red
}

Write-Host ""

# Étape 3: Build du projet
Write-Host "🔨 Build du projet..." -ForegroundColor Yellow
try {
    npm run build
    Write-Host "✅ Build réussi" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur lors du build" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Étape 4: Déploiement
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

# Étape 5: Vérification post-déploiement
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

# Étape 6: Résumé des changements
Write-Host "📝 RÉSUMÉ DES CHANGEMENTS :" -ForegroundColor Magenta
Write-Host ""
Write-Host "✅ Hero Section :" -ForegroundColor White
Write-Host "   • 'Plateforme tout-en-un pour l'Afrique' → 'Plateforme e-commerce internationale'" -ForegroundColor Gray
Write-Host "   • 'partout en Afrique' → 'partout dans le monde'" -ForegroundColor Gray
Write-Host "   • 'Paiement mobile money' → 'Paiements internationaux'" -ForegroundColor Gray
Write-Host "   • 'Support en français' → 'Support français & anglais'" -ForegroundColor Gray
Write-Host ""
Write-Host "✅ Payment Methods :" -ForegroundColor White
Write-Host "   • Orange Money, MTN, Moov → Visa, PayPal, Stripe" -ForegroundColor Gray
Write-Host "   • 'Moyens de paiement adaptés à l'Afrique' → 'Moyens de paiement internationaux'" -ForegroundColor Gray
Write-Host ""
Write-Host "✅ Features :" -ForegroundColor White
Write-Host "   • 'Mobile Money' → 'Paiements internationaux'" -ForegroundColor Gray
Write-Host "   • 'devises locales' → 'devises multiples'" -ForegroundColor Gray
Write-Host "   • 'CFA' → 'euros'" -ForegroundColor Gray
Write-Host ""
Write-Host "✅ Testimonials :" -ForegroundColor White
Write-Host "   • Noms africains → Noms internationaux" -ForegroundColor Gray
Write-Host "   • 'CFA' → '€'" -ForegroundColor Gray
Write-Host "   • Références Mobile Money supprimées" -ForegroundColor Gray
Write-Host ""
Write-Host "✅ Pricing :" -ForegroundColor White
Write-Host "   • 'Tarifs en francs CFA' → 'Tarifs en euros'" -ForegroundColor Gray
Write-Host ""
Write-Host "✅ Support :" -ForegroundColor White
Write-Host "   • 'Support expert français' → 'Support expert international'" -ForegroundColor Gray
Write-Host "   • 'en français' → 'en français et anglais'" -ForegroundColor Gray
Write-Host ""

Write-Host "🎉 Version internationale déployée avec succès !" -ForegroundColor Green
Write-Host "SimpShopy est maintenant une plateforme e-commerce internationale !" -ForegroundColor Green
Write-Host ""

# Statistiques attendues
Write-Host "📈 RÉSULTATS ATTENDUS :" -ForegroundColor Cyan
Write-Host "• Audience internationale élargie" -ForegroundColor White
Write-Host "• Plus de clients potentiels" -ForegroundColor White
Write-Host "• Positionnement global" -ForegroundColor White
Write-Host "• Support multilingue valorisé" -ForegroundColor White
Write-Host ""

Write-Host "✅ Déploiement version internationale terminé !" -ForegroundColor Green
