# Script pour corriger les tables OAuth
Write-Host "🔧 Correction des tables OAuth pour Mailchimp" -ForegroundColor Yellow
Write-Host ""

Write-Host "📋 Étapes à suivre :" -ForegroundColor Cyan
Write-Host "1. Ouvrez votre tableau de bord Supabase" -ForegroundColor White
Write-Host "2. Allez dans 'SQL Editor'" -ForegroundColor White
Write-Host "3. Copiez le contenu du fichier 'fix-oauth-tables-complete.sql'" -ForegroundColor White
Write-Host "4. Collez-le dans l'éditeur SQL" -ForegroundColor White
Write-Host "5. Cliquez sur 'Run' pour exécuter" -ForegroundColor White
Write-Host ""

Write-Host "🔗 Lien direct vers Supabase Dashboard :" -ForegroundColor Green
Write-Host "https://supabase.com/dashboard/project/grutldacuowplosarucp/sql" -ForegroundColor Blue
Write-Host ""

Write-Host "📄 Contenu du fichier SQL à copier :" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Gray
Get-Content "fix-oauth-tables-complete.sql" | Write-Host
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

Write-Host "✅ Une fois le SQL exécuté, testez l'installation Mailchimp :" -ForegroundColor Green
Write-Host "https://simpshopy.com/integrations/mailchimp" -ForegroundColor Blue
Write-Host ""

Read-Host "Appuyez sur Entrée quand vous avez terminé..."
