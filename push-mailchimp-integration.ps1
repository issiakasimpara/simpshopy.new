# Script pour faire le push GitHub de l'integration Mailchimp
# Date: 2025-01-20

Write-Host "PUSH GITHUB - INTEGRATION MAILCHIMP OAUTH" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

# Verifier le status
Write-Host "1. Verification du status Git..." -ForegroundColor Yellow
git status

# Ajouter tous les fichiers
Write-Host "2. Ajout des fichiers..." -ForegroundColor Yellow
git add .

# Verifier ce qui a ete ajoute
Write-Host "3. Verification des fichiers ajoutes..." -ForegroundColor Yellow
git status

# Faire le commit
Write-Host "4. Creation du commit..." -ForegroundColor Yellow
git commit -m "feat: Add Mailchimp OAuth integration

- Complete OAuth flow implementation
- Add MailchimpInstallButton component  
- Add MailchimpIntegration page
- Add Edge Functions for OAuth authorize and callback
- Add database migration for OAuth tables
- Add deployment guides and documentation"

# Faire le push
Write-Host "5. Push vers GitHub..." -ForegroundColor Yellow
git push

Write-Host "PUSH TERMINE !" -ForegroundColor Green
Write-Host "L'integration Mailchimp OAuth est maintenant sur GitHub !" -ForegroundColor Green
