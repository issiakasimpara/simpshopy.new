# Test de l'Edge Function mailchimp-callback
Write-Host "🧪 Test de l'Edge Function mailchimp-callback..." -ForegroundColor Cyan

$callbackUrl = "https://grutldacuowplosarucp.supabase.co/functions/v1/mailchimp-callback"

Write-Host "`n1️⃣ Test OPTIONS (preflight CORS)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $callbackUrl -Method OPTIONS -Headers @{
        "Origin" = "https://simpshopy.com"
        "Access-Control-Request-Method" = "GET"
        "Access-Control-Request-Headers" = "authorization, x-client-info, apikey, content-type"
    }
    Write-Host "✅ OPTIONS OK - Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Headers CORS:" -ForegroundColor Gray
    $response.Headers | Where-Object { $_.Key -like "*Access-Control*" } | ForEach-Object {
        Write-Host "  $($_.Key): $($_.Value)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Erreur OPTIONS: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n2️⃣ Test GET avec paramètres..." -ForegroundColor Yellow
try {
    $testUrl = "$callbackUrl?code=test&state=test"
    $response = Invoke-WebRequest -Uri $testUrl -Method GET -Headers @{
        "Authorization" = "Bearer test"
        "Origin" = "https://simpshopy.com"
    }
    Write-Host "✅ GET OK - Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Réponse: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Erreur GET: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n✅ Test terminé!" -ForegroundColor Green
