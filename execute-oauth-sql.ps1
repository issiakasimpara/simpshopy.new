# Guide pour exécuter le SQL OAuth
Write-Host "🔧 EXÉCUTION DU SQL OAuth - ÉTAPES CRUCIALES" -ForegroundColor Red
Write-Host "================================================" -ForegroundColor Red

Write-Host "`n🚨 ATTENTION : Cette étape est OBLIGATOIRE pour que Mailchimp fonctionne !" -ForegroundColor Yellow

Write-Host "`n📋 ÉTAPES À SUIVRE :" -ForegroundColor Cyan
Write-Host "1️⃣ Ouvrez votre navigateur" -ForegroundColor White
Write-Host "2️⃣ Allez sur : https://supabase.com/dashboard/project/grutldacuowplosarucp/sql" -ForegroundColor Green
Write-Host "3️⃣ Cliquez sur l'éditeur SQL (onglet 'SQL Editor')" -ForegroundColor White
Write-Host "4️⃣ Copiez TOUT le contenu ci-dessous" -ForegroundColor White
Write-Host "5️⃣ Collez-le dans l'éditeur SQL" -ForegroundColor White
Write-Host "6️⃣ Cliquez sur 'Run' (bouton bleu)" -ForegroundColor White

Write-Host "`n📄 CONTENU SQL À COPIER :" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray

# Afficher le contenu du fichier SQL
Get-Content "fix-oauth-tables.sql" | Write-Host

Write-Host "----------------------------------------" -ForegroundColor Gray

Write-Host "`n✅ APRÈS L'EXÉCUTION DU SQL :" -ForegroundColor Green
Write-Host "• Allez sur : https://simpshopy.com/integrations/mailchimp" -ForegroundColor White
Write-Host "• Cliquez 'Installer Mailchimp'" -ForegroundColor White
Write-Host "• Autorisez Simpshopy sur Mailchimp" -ForegroundColor White
Write-Host "• Vous devriez voir 'Mailchimp installé' avec le bouton 'Ouvrir Mailchimp'" -ForegroundColor White

Write-Host "`n🚀 L'erreur 406 disparaîtra une fois le SQL exécuté !" -ForegroundColor Green
