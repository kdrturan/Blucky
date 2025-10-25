# Sui Move Test Script for Windows
# Usage: .\test.ps1

Write-Host "🧪 Sui Move Test Script" -ForegroundColor Cyan
Write-Host "========================`n" -ForegroundColor Cyan

# Check if sui is installed
Write-Host "Checking Sui CLI installation..." -ForegroundColor Yellow
$suiInstalled = Get-Command sui -ErrorAction SilentlyContinue

if (-not $suiInstalled) {
    Write-Host "❌ Sui CLI not found!" -ForegroundColor Red
    Write-Host "`nPlease install Sui CLI first:" -ForegroundColor Yellow
    Write-Host "1. Install Rust from https://rustup.rs/" -ForegroundColor White
    Write-Host "2. Run: cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui" -ForegroundColor White
    Write-Host "`nOr see TEST_GUIDE_TR.md for detailed instructions." -ForegroundColor Cyan
    exit 1
}

# Show Sui version
Write-Host "✅ Sui CLI found: " -ForegroundColor Green -NoNewline
sui --version

# Navigate to contracts directory
Set-Location contracts

Write-Host "`n📦 Building the Move package..." -ForegroundColor Yellow
sui move build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!`n" -ForegroundColor Green
    
    Write-Host "🧪 Running tests..." -ForegroundColor Yellow
    sui move test --verbose
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ All tests passed! 🎉" -ForegroundColor Green
    } else {
        Write-Host "`n❌ Some tests failed. Check the output above." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ Build failed. Check the errors above." -ForegroundColor Red
    exit 1
}

# Return to root directory
Set-Location ..

Write-Host "`n✨ Test script completed successfully!" -ForegroundColor Cyan


