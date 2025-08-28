# Redéploiement WhatsApp avec API Simple Gupshup
# Ce script vous guide pour redéployer la fonction WhatsApp avec l'API simple

Write-Host "Redéploiement WhatsApp avec API Simple Gupshup" -ForegroundColor Green
Write-Host ""

Write-Host "Probleme identifie : Erreur 415 - WABA API non compatible" -ForegroundColor Yellow
Write-Host "Solution : Utilisation de l'API Simple de Gupshup" -ForegroundColor Green
Write-Host ""

Write-Host "Etapes a suivre :" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Allez sur : https://supabase.com/dashboard/project/grutldacuowplosarucp" -ForegroundColor White
Write-Host ""

Write-Host "2. Dans le menu de gauche, cliquez sur 'Edge Functions'" -ForegroundColor White
Write-Host ""

Write-Host "3. Cherchez 'whatsapp-send' et cliquez dessus" -ForegroundColor White
Write-Host ""

Write-Host "4. Remplacez TOUT le code par la nouvelle version (API Simple)" -ForegroundColor White
Write-Host "   (Le fichier a ete corrige pour utiliser l'API Simple)" -ForegroundColor Gray
Write-Host ""

Write-Host "5. Cliquez sur 'Deploy'" -ForegroundColor White
Write-Host ""

Write-Host "6. Attendez que le deploiement soit termine" -ForegroundColor White
Write-Host ""

Write-Host "Test apres deploiement :" -ForegroundColor Yellow
Write-Host ""

Write-Host "7. Retournez dans ce terminal et tapez :" -ForegroundColor White
Write-Host "   .\test-whatsapp-config.ps1" -ForegroundColor Cyan
Write-Host ""

Write-Host "Resultat attendu :" -ForegroundColor Cyan
Write-Host "   Status: ok" -ForegroundColor Green
Write-Host "   Config: true" -ForegroundColor Green
Write-Host "   Gupshup: true" -ForegroundColor Green
Write-Host ""

Write-Host "Appuyez sur une touche pour ouvrir le dashboard Supabase..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Ouvrir le dashboard Supabase
Start-Process "https://supabase.com/dashboard/project/grutldacuowplosarucp"

Write-Host ""
Write-Host "Dashboard Supabase ouvert ! Redéployez la fonction avec l'API Simple." -ForegroundColor Green
Write-Host ""
