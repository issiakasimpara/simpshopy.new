# Vérifier les logs de l'Edge Function mailchimp-callback
Write-Host "🔍 Vérification des logs Edge Function..." -ForegroundColor Cyan

Write-Host "`n📋 Instructions pour vérifier les logs :" -ForegroundColor Yellow
Write-Host "1. Allez sur : https://supabase.com/dashboard/project/grutldacuowplosarucp/functions" -ForegroundColor White
Write-Host "2. Cliquez sur 'mailchimp-callback'" -ForegroundColor White
Write-Host "3. Cliquez sur l'onglet 'Logs'" -ForegroundColor White
Write-Host "4. Regardez les erreurs récentes" -ForegroundColor White

Write-Host "`n🔧 Problème identifié :" -ForegroundColor Red
Write-Host "• L'Edge Function redirige vers error=oauth_failed" -ForegroundColor White
Write-Host "• Cela indique une erreur dans le traitement OAuth" -ForegroundColor White
Write-Host "• Probablement un problème avec les variables d'environnement" -ForegroundColor White

Write-Host "`n📋 Variables d'environnement à vérifier :" -ForegroundColor Yellow
Write-Host "• MAILCHIMP_CLIENT_ID" -ForegroundColor White
Write-Host "• MAILCHIMP_CLIENT_SECRET" -ForegroundColor White
Write-Host "• SITE_URL" -ForegroundColor White

Write-Host "`n🔧 Pour vérifier les variables d'environnement :" -ForegroundColor Yellow
Write-Host "1. Allez sur : https://supabase.com/dashboard/project/grutldacuowplosarucp/settings/api" -ForegroundColor White
Write-Host "2. Cliquez sur 'Environment Variables'" -ForegroundColor White
Write-Host "3. Vérifiez que ces variables existent :" -ForegroundColor White
Write-Host "   - MAILCHIMP_CLIENT_ID=477462211553" -ForegroundColor Gray
Write-Host "   - MAILCHIMP_CLIENT_SECRET=***HIDDEN***" -ForegroundColor Gray
Write-Host "   - SITE_URL=https://simpshopy.com" -ForegroundColor Gray

Write-Host "`n🚀 Une fois les variables vérifiées, redéployez l'Edge Function :" -ForegroundColor Green
Write-Host "npx supabase functions deploy mailchimp-callback" -ForegroundColor White
