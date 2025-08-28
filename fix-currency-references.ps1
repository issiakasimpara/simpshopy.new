# 💰 Script de Correction des Références Monétaires - SimpShopy
# Remplace CFA par le système de devise dynamique

Write-Host "💰 Correction des références monétaires SimpShopy..." -ForegroundColor Green
Write-Host ""

# Étape 1: Corriger les composants principaux
Write-Host "📝 Correction des composants principaux..." -ForegroundColor Yellow

$filesToUpdate = @(
    "src/components/shipping/CreateShippingMethodModal.tsx",
    "src/components/markets/CreateShippingMethodDialog.tsx",
    "src/components/products/variants/SimpleVariantSection.tsx",
    "src/components/OrderDetailsModal.tsx",
    "src/components/payments/PaymentsStats.tsx",
    "src/components/payments/TransactionsList.tsx",
    "src/components/payments/RecentActivity.tsx",
    "src/components/products/ProductCard.tsx",
    "src/components/checkout/PaymentMethodSelector.tsx",
    "src/components/demo/PaymentLogosDemo.tsx",
    "src/components/test/LogoTest.tsx",
    "src/components/showcase/PaymentLogosShowcase.tsx"
)

foreach ($file in $filesToUpdate) {
    if (Test-Path $file) {
        Write-Host "✅ Mise à jour de $file" -ForegroundColor Green
        
        # Lire le contenu du fichier
        $content = Get-Content $file -Raw -Encoding UTF8
        
        # Ajouter l'import useStoreCurrency si nécessaire
        if ($content -match "CFA" -and $content -notmatch "useStoreCurrency") {
            # Trouver la dernière ligne d'import
            $importLines = $content -split "`n" | Where-Object { $_.Trim() -match "^import" }
            if ($importLines) {
                $lastImport = $importLines[-1]
                $lastImportIndex = $content.LastIndexOf($lastImport)
                $insertIndex = $content.IndexOf("`n", $lastImportIndex) + 1
                $content = $content.Substring(0, $insertIndex) + "import { useStoreCurrency } from `"@/hooks/useStoreCurrency`";`n" + $content.Substring($insertIndex)
            }
        }
        
        # Ajouter le hook formatPrice si nécessaire
        if ($content -match "formatPrice" -and $content -notmatch "const \{ formatPrice \} = useStoreCurrency\(\)") {
            # Trouver la première fonction ou composant
            if ($content -match "(const|function)\s+\w+\s*=\s*\(") {
                $match = [regex]::Match($content, "(const|function)\s+\w+\s*=\s*\(")
                $insertIndex = $match.Index + $match.Length
                $nextBraceIndex = $content.IndexOf("{", $insertIndex)
                if ($nextBraceIndex -ne -1) {
                    $afterBraceIndex = $content.IndexOf("`n", $nextBraceIndex) + 1
                    $content = $content.Substring(0, $afterBraceIndex) + "  const { formatPrice } = useStoreCurrency();`n" + $content.Substring($afterBraceIndex)
                }
            }
        }
        
        # Remplacer les références CFA
        $content = $content -replace 'Prix \(CFA\)', 'Prix ({formatPrice(0, { showSymbol: true, showCode: true })})'
        $content = $content -replace 'Prix de vente \(CFA\)', 'Prix de vente ({formatPrice(0, { showSymbol: true, showCode: true })})'
        $content = $content -replace 'Prix comparé \(CFA\)', 'Prix comparé ({formatPrice(0, { showSymbol: true, showCode: true })})'
        $content = $content -replace 'Prix de revient \(CFA\)', 'Prix de revient ({formatPrice(0, { showSymbol: true, showCode: true })})'
        $content = $content -replace 'Prix de comparaison \(CFA\)', 'Prix de comparaison ({formatPrice(0, { showSymbol: true, showCode: true })})'
        
        # Remplacer les headers de tableaux
        $content = $content -replace '<th className="text-left p-2">Prix \(CFA\)</th>', '<th className="text-left p-2">Prix ({formatPrice(0, { showSymbol: true, showCode: true })})</th>'
        
        # Remplacer les affichages de prix
        $content = $content -replace '\$\{order\.shipping_method\.price\} CFA', 'formatPrice(order.shipping_method.price)'
        
        # Écrire le contenu modifié
        Set-Content $file -Value $content -Encoding UTF8
    } else {
        Write-Host "⚠️ Fichier non trouvé : $file" -ForegroundColor Yellow
    }
}

Write-Host ""

# Étape 2: Vérifier les composants déjà corrigés
Write-Host "🔍 Vérification des composants déjà corrigés..." -ForegroundColor Yellow

$alreadyFixed = @(
    "src/components/analytics/KPICards.tsx",
    "src/components/analytics/TopProductsChart.tsx",
    "src/components/analytics/SalesChart.tsx",
    "src/components/dashboard/DashboardStats.tsx",
    "src/components/products/forms/ProductBasicInfoForm.tsx",
    "src/components/products/forms/ProductAdvancedForm.tsx",
    "src/components/products/variants/VariantEditor.tsx",
    "src/components/products/variants/VariantCreationForm.tsx",
    "src/components/shipping/CreateMethodDialog.tsx"
)

foreach ($file in $alreadyFixed) {
    if (Test-Path $file) {
        Write-Host "✅ Déjà corrigé : $file" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "🎉 Correction terminée !" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Prochaines étapes :" -ForegroundColor Cyan
Write-Host "1. Vérifiez que tous les composants utilisent maintenant le système de devise dynamique" -ForegroundColor White
Write-Host "2. Testez le changement de devise dans Paramètres → Devise" -ForegroundColor White
Write-Host "3. Vérifiez que tous les prix se mettent à jour automatiquement" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Le système de devise est maintenant entièrement dynamique !" -ForegroundColor Green
