# Script de test pour le systeme de conversion de devises
# A executer apres avoir cree la table currency_rates

Write-Host "Test du systeme de conversion de devises" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Variables Supabase
$SUPABASE_URL = "https://grutldacuowplosarucp.supabase.co"
$SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdydXRsZGFjdW93cGxvc2FydWNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwOTAxNjEsImV4cCI6MjA2NDY2NjE2MX0.cqKxbFdqF589dQBSH3IKNL6kXdRNtS9dpkrYNOHk0Ac"

Write-Host "`nInstructions d'execution:" -ForegroundColor Yellow
Write-Host "1. Executez d'abord le script SQL 'CREATE_CURRENCY_RATES_TABLE.sql' dans l'editeur SQL de Supabase" -ForegroundColor White
Write-Host "2. Testez l'Edge Function manuellement" -ForegroundColor White

Write-Host "`nTest de l'Edge Function:" -ForegroundColor Yellow
Write-Host "URL: $SUPABASE_URL/functions/v1/update-currency-rates" -ForegroundColor White

# Test de l'Edge Function
Write-Host "`nTest de l'Edge Function..." -ForegroundColor Green

try {
    $headers = @{
        "Authorization" = "Bearer $SUPABASE_ANON_KEY"
        "Content-Type" = "application/json"
    }
    
    $body = @{} | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$SUPABASE_URL/functions/v1/update-currency-rates" -Method POST -Headers $headers -Body $body
    
    Write-Host "Edge Function executee avec succes!" -ForegroundColor Green
    Write-Host "Resultat: $($response | ConvertTo-Json -Depth 3)" -ForegroundColor White
    
} catch {
    Write-Host "Erreur lors du test de l'Edge Function:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host "`nVerification de la base de donnees:" -ForegroundColor Yellow
Write-Host "Executez cette requete SQL dans l'editeur Supabase:" -ForegroundColor White
Write-Host "SELECT COUNT(*) as nombre_taux FROM currency_rates;" -ForegroundColor Cyan
Write-Host "SELECT base_currency, target_currency, rate, last_updated FROM currency_rates ORDER BY last_updated DESC LIMIT 10;" -ForegroundColor Cyan

Write-Host "`nTest de conversion:" -ForegroundColor Yellow
Write-Host "Executez cette requete SQL pour tester la conversion:" -ForegroundColor White
Write-Host "SELECT convert_currency(1000, 'XOF', 'EUR') as conversion_xof_eur;" -ForegroundColor Cyan
Write-Host "SELECT convert_currency(100, 'EUR', 'USD') as conversion_eur_usd;" -ForegroundColor Cyan

Write-Host "`nConfiguration du Scheduler:" -ForegroundColor Yellow
Write-Host "Le Scheduler executera automatiquement la mise a jour des taux:" -ForegroundColor White
Write-Host "- Quotidiennement a 6h00 UTC via GitHub Actions" -ForegroundColor Cyan

Write-Host "`nSysteme de conversion de devises configure!" -ForegroundColor Green
Write-Host "L'application utilisera maintenant automatiquement les taux de change mis a jour quotidiennement." -ForegroundColor White
