# Test de l'intégration Mailchimp
Write-Host "🔍 Test de l'intégration Mailchimp..." -ForegroundColor Cyan

# 1. Test de l'Edge Function authorize
Write-Host "`n1️⃣ Test de l'Edge Function authorize..." -ForegroundColor Yellow
$authorizeUrl = "https://grutldacuowplosarucp.supabase.co/functions/v1/mailchimp-authorize?user_id=test&store_id=test"
Write-Host "URL: $authorizeUrl"

try {
    $response = Invoke-WebRequest -Uri $authorizeUrl -Method GET -Headers @{
        "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdydXRsZGFjdXfwbG9zYXJ1Y3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNTQ5MzI0OCwiZXhwIjoyMDUxMDU5MjQ4fQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8"
    }
    Write-Host "✅ Authorize fonctionne" -ForegroundColor Green
    Write-Host "Réponse: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Erreur authorize: $($_.Exception.Message)" -ForegroundColor Red
}

# 2. Test de l'Edge Function callback
Write-Host "`n2️⃣ Test de l'Edge Function callback..." -ForegroundColor Yellow
$callbackUrl = "https://grutldacuowplosarucp.supabase.co/functions/v1/mailchimp-callback?code=test&state=test"
Write-Host "URL: $callbackUrl"

try {
    $response = Invoke-WebRequest -Uri $callbackUrl -Method GET -Headers @{
        "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdydXRsZGFjdXfwbG9zYXJ1Y3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNTQ5MzI0OCwiZXhwIjoyMDUxMDU5MjQ4fQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8"
    }
    Write-Host "✅ Callback fonctionne" -ForegroundColor Green
    Write-Host "Réponse: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Erreur callback: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Test de la table oauth_integrations
Write-Host "`n3️⃣ Test de la table oauth_integrations..." -ForegroundColor Yellow
$dbUrl = "https://grutldacuowplosarucp.supabase.co/rest/v1/oauth_integrations?select=*&limit=5"
Write-Host "URL: $dbUrl"

try {
    $response = Invoke-WebRequest -Uri $dbUrl -Method GET -Headers @{
        "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdydXRsZGFjdXfwbG9zYXJ1Y3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNTQ5MzI0OCwiZXhwIjoyMDUxMDU5MjQ4fQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8"
        "apikey" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdydXRsZGFjdXfwbG9zYXJ1Y3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNTQ5MzI0OCwiZXhwIjoyMDUxMDU5MjQ4fQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8"
    }
    Write-Host "✅ Table accessible" -ForegroundColor Green
    Write-Host "Données: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Erreur table: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n✅ Test terminé!" -ForegroundColor Green
