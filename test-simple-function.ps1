# Test de la fonction simplifiée
Write-Host "Test de la fonction simplifiee..." -ForegroundColor Green

$SUPABASE_URL = "https://grutldacuowplosarucp.supabase.co"
$SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdydXRsZGFjdW93cGxvc2FydWNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwOTAxNjEsImV4cCI6MjA2NDY2NjE2MX0.cqKxbFdqF589dQBSH3IKNL6kXdRNtS9dpkrYNOHk0Ac"

try {
    $headers = @{
        "Authorization" = "Bearer $SUPABASE_ANON_KEY"
        "Content-Type" = "application/json"
    }
    
    $body = @{} | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$SUPABASE_URL/functions/v1/update-currency-rates-test" -Method POST -Headers $headers -Body $body
    
    Write-Host "Fonction simplifiee executee avec succes!" -ForegroundColor Green
    Write-Host "Resultat: $($response | ConvertTo-Json -Depth 3)" -ForegroundColor White
    
} catch {
    Write-Host "Erreur lors du test de la fonction simplifiee:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
