# Script pour corriger les tables OAuth
Write-Host "🔧 Correction des tables OAuth..." -ForegroundColor Cyan

Write-Host "`n📋 Instructions:" -ForegroundColor Yellow
Write-Host "1. Allez sur https://supabase.com/dashboard/project/grutldacuowplosarucp/sql" -ForegroundColor White
Write-Host "2. Copiez le contenu du fichier fix-oauth-tables.sql" -ForegroundColor White
Write-Host "3. Collez-le dans l'éditeur SQL" -ForegroundColor White
Write-Host "4. Cliquez sur 'Run' pour exécuter le script" -ForegroundColor White

Write-Host "`n📄 Contenu du fichier fix-oauth-tables.sql:" -ForegroundColor Yellow
Get-Content "fix-oauth-tables.sql" | Write-Host

Write-Host "`n✅ Une fois le SQL exécuté, testez l'installation Mailchimp!" -ForegroundColor Green
