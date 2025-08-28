# Script de test pour le système de conversion de devises
# À exécuter après avoir créé la table currency_rates

Write-Host "🧪 Test du système de conversion de devises" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Variables Supabase
$SUPABASE_URL = "https://grutldacuowplosarucp.supabase.co"
$SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdydXRsZGFjdW93cGxvc2FydWNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwOTAxNjEsImV4cCI6MjA2NDY2NjE2MX0.cqKxbFdqF589dQBSH3IKNL6kXdRNtS9dpkrYNOHk0Ac"

Write-Host "`n📋 Instructions d'exécution:" -ForegroundColor Yellow
Write-Host "1. Exécutez d'abord le script SQL 'CREATE_CURRENCY_RATES_TABLE.sql' dans l'éditeur SQL de Supabase" -ForegroundColor White
Write-Host "2. Exécutez ensuite le script SQL 'CREATE_CURRENCY_SCHEDULER.sql' pour configurer le Scheduler" -ForegroundColor White
Write-Host "3. Testez l'Edge Function manuellement" -ForegroundColor White

Write-Host "`n🔧 Test de l'Edge Function:" -ForegroundColor Yellow
Write-Host "URL: $SUPABASE_URL/functions/v1/update-currency-rates" -ForegroundColor White

# Test de l'Edge Function
Write-Host "`n🚀 Test de l'Edge Function..." -ForegroundColor Green

try {
    $headers = @{
        "Authorization" = "Bearer $SUPABASE_ANON_KEY"
        "Content-Type" = "application/json"
    }
    
    $body = @{} | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$SUPABASE_URL/functions/v1/update-currency-rates" -Method POST -Headers $headers -Body $body
    
    Write-Host "✅ Edge Function exécutée avec succès!" -ForegroundColor Green
    Write-Host "Résultat: $($response | ConvertTo-Json -Depth 3)" -ForegroundColor White
    
} catch {
    Write-Host "❌ Erreur lors du test de l'Edge Function:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host "`n📊 Vérification de la base de données:" -ForegroundColor Yellow
Write-Host "Exécutez cette requête SQL dans l'éditeur Supabase:" -ForegroundColor White
Write-Host "SELECT COUNT(*) as nombre_taux FROM currency_rates;" -ForegroundColor Cyan
Write-Host "SELECT base_currency, target_currency, rate, last_updated FROM currency_rates ORDER BY last_updated DESC LIMIT 10;" -ForegroundColor Cyan

Write-Host "`n🔄 Test de conversion:" -ForegroundColor Yellow
Write-Host "Exécutez cette requête SQL pour tester la conversion:" -ForegroundColor White
Write-Host "SELECT convert_currency(1000, 'XOF', 'EUR') as conversion_xof_eur;" -ForegroundColor Cyan
Write-Host "SELECT convert_currency(100, 'EUR', 'USD') as conversion_eur_usd;" -ForegroundColor Cyan

Write-Host "`n⏰ Configuration du Scheduler:" -ForegroundColor Yellow
Write-Host "Le Scheduler exécutera automatiquement la mise à jour des taux:" -ForegroundColor White
Write-Host "- Quotidiennement à 6h00 UTC (job: update-currency-rates-daily)" -ForegroundColor Cyan
Write-Host "- Toutes les heures pour les tests (job: update-currency-rates-test)" -ForegroundColor Cyan

Write-Host "`n✅ Systeme de conversion de devises configure!" -ForegroundColor Green
Write-Host "L'application utilisera maintenant automatiquement les taux de change mis a jour quotidiennement." -ForegroundColor White
