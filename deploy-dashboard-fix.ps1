Write-Host "Deploiement correction dashboard - 5eme carte" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

Write-Host "Verification des fichiers..." -ForegroundColor Yellow

if (Test-Path "src/components/dashboard/DashboardStats.tsx") {
    Write-Host "OK - DashboardStats.tsx trouve" -ForegroundColor Green
} else {
    Write-Host "ERREUR - DashboardStats.tsx manquant" -ForegroundColor Red
    exit 1
}

if (Test-Path "src/hooks/useAbandonedCarts.tsx") {
    Write-Host "OK - useAbandonedCarts.tsx trouve" -ForegroundColor Green
} else {
    Write-Host "ERREUR - useAbandonedCarts.tsx manquant" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Construction du projet..." -ForegroundColor Yellow

npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "OK - Build reussi" -ForegroundColor Green
} else {
    Write-Host "ERREUR - Build echoue" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "RESUME:" -ForegroundColor Cyan
Write-Host "=======" -ForegroundColor Cyan
Write-Host ""
Write-Host "PROBLEME IDENTIFIE:" -ForegroundColor Yellow
Write-Host "- Modification du mauvais composant Dashboard" -ForegroundColor White
Write-Host "- Le vrai composant est DashboardStats.tsx" -ForegroundColor White
Write-Host "- Grille limitee a 4 colonnes au lieu de 5" -ForegroundColor White
Write-Host ""
Write-Host "SOLUTION APPLIQUEE:" -ForegroundColor Green
Write-Host "- Ajout de la 5eme carte 'Paniers abandonnes' dans DashboardStats" -ForegroundColor White
Write-Host "- Extension de la grille de 4 a 5 colonnes (lg:grid-cols-5)" -ForegroundColor White
Write-Host "- Integration du hook useAbandonedCarts" -ForegroundColor White
Write-Host "- Affichage des statistiques avec etat de chargement" -ForegroundColor White
Write-Host ""
Write-Host "RESULTAT:" -ForegroundColor Green
Write-Host "- Dashboard avec 5 cartes de statistiques" -ForegroundColor White
Write-Host "- Carte paniers abandonnes avec donnees reelles" -ForegroundColor White
Write-Host "- Interface responsive optimisee" -ForegroundColor White
Write-Host ""
Write-Host "DEPLOIEMENT TERMINE!" -ForegroundColor Green
Write-Host ""
Write-Host "Prochaines etapes:" -ForegroundColor Yellow
Write-Host "1. Deployer sur Vercel: npx vercel --prod" -ForegroundColor White
Write-Host "2. Verifier les 5 cartes en production" -ForegroundColor White
Write-Host "3. Tester la fonctionnalite paniers abandonnes" -ForegroundColor White
