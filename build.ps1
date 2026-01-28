# Portfolio Build Script
# Usage: powershell -ExecutionPolicy Bypass -File build.ps1

Write-Host "`n========================================"
Write-Host "  Portfolio Build Script"
Write-Host "========================================`n" -ForegroundColor Cyan

$portfolioWorkPath = Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) "portfolioWork"
Push-Location $portfolioWorkPath

try {
    Write-Host "[1/3] Checking dependencies..." -ForegroundColor Yellow
    if (-not (Test-Path "node_modules")) {
        Write-Host "Installing dependencies..."
        npm ci
        if ($LASTEXITCODE -ne 0) { throw "npm install failed" }
    } else {
        Write-Host "Dependencies already installed" -ForegroundColor Green
    }

    Write-Host "`n[2/3] Building application..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Build failed" }

    Write-Host "`n[3/3] Verifying build output..." -ForegroundColor Yellow
    $buildPath = "dist/portfolio-work"
    
    if (Test-Path $buildPath) {
        $buildSize = (Get-ChildItem $buildPath -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
        
        Write-Host "`n========================================" -ForegroundColor Green
        Write-Host "SUCCESS - Build completed!" -ForegroundColor Green
        Write-Host "========================================`n" -ForegroundColor Green
        Write-Host "Build output: $buildPath" -ForegroundColor Cyan
        Write-Host "Build size: $([Math]::Round($buildSize, 2)) MB" -ForegroundColor Cyan
        Write-Host "`nNext steps:" -ForegroundColor Yellow
        Write-Host "  1. git add ." 
        Write-Host "  2. git commit -m 'Your message'"
        Write-Host "  3. git push origin feature"
        Write-Host "  4. Create PR on GitHub (feature -> main)"
        Write-Host "  5. Merge PR to deploy automatically"
        Write-Host "`n"
    } else {
        throw "Build output not found at $buildPath"
    }
}
catch {
    Write-Host "`nERROR: $PSItem" -ForegroundColor Red
    exit 1
}
finally {
    Pop-Location
}
