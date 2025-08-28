# Script PowerShell pour exécuter les migrations de devises
Write-Host "Migration des devises dans Supabase..." -ForegroundColor Yellow

# Vérifier si les fichiers de migration existent
$migrationFile = "supabase/migrations/20241220000001_add_new_currencies.sql"
$testFile = "supabase/migrations/20241220000002_test_new_currencies.sql"

if (-not (Test-Path $migrationFile)) {
    Write-Host "Fichier de migration non trouvé: $migrationFile" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $testFile)) {
    Write-Host "Fichier de test non trouvé: $testFile" -ForegroundColor Red
    exit 1
}

Write-Host "Fichiers de migration trouvés!" -ForegroundColor Green

# Lire le contenu des fichiers
$migrationContent = Get-Content $migrationFile -Raw
$testContent = Get-Content $testFile -Raw

Write-Host ""
Write-Host "INSTRUCTIONS POUR EXÉCUTER LES MIGRATIONS:" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Gray
Write-Host ""
Write-Host "1. Ouvrez votre éditeur SQL Supabase" -ForegroundColor White
Write-Host "2. Exécutez d'abord le fichier: $migrationFile" -ForegroundColor White
Write-Host "3. Puis exécutez le fichier: $testFile" -ForegroundColor White
Write-Host "4. Vérifiez les résultats" -ForegroundColor White
Write-Host ""

Write-Host "CONTENU DE LA MIGRATION PRINCIPALE:" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Gray
Write-Host $migrationContent -ForegroundColor White
Write-Host "===================================" -ForegroundColor Gray

Write-Host ""
Write-Host "CONTENU DU SCRIPT DE TEST:" -ForegroundColor Cyan
Write-Host "==========================" -ForegroundColor Gray
Write-Host $testContent -ForegroundColor White
Write-Host "==========================" -ForegroundColor Gray

Write-Host ""
Write-Host "MIGRATION PRÊTE À ÊTRE EXÉCUTÉE!" -ForegroundColor Green
Write-Host "Après l'exécution, testez le changement de devise dans l'onglet parametres/devises" -ForegroundColor Yellow
