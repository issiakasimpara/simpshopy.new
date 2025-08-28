# Script PowerShell pour exécuter la migration des devises du monde
Write-Host "Migration des devises du monde dans Supabase..." -ForegroundColor Yellow

# Vérifier si le fichier de migration existe
$migrationFile = "supabase/migrations/20241220000003_add_all_world_currencies.sql"

if (-not (Test-Path $migrationFile)) {
    Write-Host "Fichier de migration non trouvé: $migrationFile" -ForegroundColor Red
    exit 1
}

Write-Host "Fichier de migration trouvé: $migrationFile" -ForegroundColor Green

# Lire le contenu du fichier
$migrationContent = Get-Content $migrationFile -Raw

Write-Host ""
Write-Host "INSTRUCTIONS POUR EXÉCUTER LA MIGRATION:" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Gray
Write-Host ""
Write-Host "1. Ouvrez votre éditeur SQL Supabase" -ForegroundColor White
Write-Host "2. Copiez le contenu du fichier: $migrationFile" -ForegroundColor White
Write-Host "3. Collez-le dans l'éditeur SQL" -ForegroundColor White
Write-Host "4. Exécutez le script" -ForegroundColor White
Write-Host "5. Vérifiez les résultats" -ForegroundColor White
Write-Host ""

Write-Host "STATISTIQUES DES DEVISES:" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Gray
Write-Host "🌍 Total des devises: 180+ devises" -ForegroundColor White
Write-Host "🇦🇫 Afrique: 25 devises" -ForegroundColor White
Write-Host "🇪🇺 Europe: 30 devises" -ForegroundColor White
Write-Host "🇺🇸 Amériques: 35 devises" -ForegroundColor White
Write-Host "🇦🇸 Asie: 40 devises" -ForegroundColor White
Write-Host "🇦🇺 Océanie: 10 devises" -ForegroundColor White
Write-Host "💱 Spéciales/Crypto: 7 devises" -ForegroundColor White
Write-Host ""

Write-Host "CONTENU DE LA MIGRATION:" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Gray
Write-Host $migrationContent -ForegroundColor White
Write-Host "========================" -ForegroundColor Gray

Write-Host ""
Write-Host "MIGRATION PRÊTE À ÊTRE EXÉCUTÉE!" -ForegroundColor Green
Write-Host "Après l'exécution, vous aurez accès à toutes les devises du monde!" -ForegroundColor Yellow
Write-Host "Testez le changement de devise dans l'onglet parametres/devises" -ForegroundColor Yellow
