Write-Host "Checking prerequisites for Supabase CLI" -ForegroundColor Cyan

# Check Git
Write-Host "`nChecking Git..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "Git: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "Git not found. Install from: https://git-scm.com/download/win" -ForegroundColor Red
}

# Check Node.js
Write-Host "`nChecking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js not found. Install from: https://nodejs.org/" -ForegroundColor Red
}

# Check npm
Write-Host "`nChecking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "npm not found" -ForegroundColor Red
}

Write-Host "`nPrerequisites check completed!" -ForegroundColor Green
