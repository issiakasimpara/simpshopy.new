# Script PowerShell pour mettre à jour les devises dans la base de données

Write-Host "Mise à jour des devises dans la base de données..." -ForegroundColor Yellow

# Vérifier si le fichier SQL existe
$sqlFile = "add_new_currencies_to_database.sql"
if (-not (Test-Path $sqlFile)) {
    Write-Host "Fichier $sqlFile non trouvé!" -ForegroundColor Red
    exit 1
}

Write-Host "Fichier SQL trouvé: $sqlFile" -ForegroundColor Green

# Lire le contenu du fichier SQL
$sqlContent = Get-Content $sqlFile -Raw

Write-Host "Exécution du script SQL..." -ForegroundColor Yellow

# Afficher les instructions pour l'utilisateur
Write-Host ""
Write-Host "INSTRUCTIONS:" -ForegroundColor Cyan
Write-Host "1. Ouvrez votre éditeur SQL Supabase" -ForegroundColor White
Write-Host "2. Copiez le contenu du fichier: $sqlFile" -ForegroundColor White
Write-Host "3. Collez-le dans l'éditeur SQL" -ForegroundColor White
Write-Host "4. Exécutez le script" -ForegroundColor White
Write-Host "5. Vérifiez les résultats" -ForegroundColor White
Write-Host ""

Write-Host "Contenu du script SQL:" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Gray
Write-Host $sqlContent -ForegroundColor White
Write-Host "================================" -ForegroundColor Gray

Write-Host ""
Write-Host "Script prêt à être exécuté!" -ForegroundColor Green
Write-Host "Après l'exécution, testez le changement de devise dans l'onglet parametres/devises" -ForegroundColor Yellow
