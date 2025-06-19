# PWA Test Script for Windows PowerShell
Write-Host "🚀 PWA Testing Script" -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan

# Check if server is running
Write-Host "`n1. Checking if Next.js server is running..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3002" -Method Head -TimeoutSec 5
    Write-Host "✅ Server is running at http://localhost:3002" -ForegroundColor Green
} catch {
    Write-Host "❌ Server is not running. Please start with: npm run dev" -ForegroundColor Red
    Write-Host "   Command: cd d:\Thang\quan-ly-ban-hang && npm run dev" -ForegroundColor Gray
    exit 1
}

# Check manifest.json
Write-Host "`n2. Checking manifest.json..." -ForegroundColor Yellow
if (Test-Path ".\public\manifest.json") {
    Write-Host "✅ manifest.json exists" -ForegroundColor Green
    try {
        $manifest = Get-Content ".\public\manifest.json" | ConvertFrom-Json
        Write-Host "   Name: $($manifest.name)" -ForegroundColor Gray
        Write-Host "   Theme: $($manifest.theme_color)" -ForegroundColor Gray
    } catch {
        Write-Host "❌ manifest.json has invalid JSON" -ForegroundColor Red
    }
} else {
    Write-Host "❌ manifest.json not found" -ForegroundColor Red
}

# Check service worker
Write-Host "`n3. Checking service worker..." -ForegroundColor Yellow
if (Test-Path ".\public\sw.js") {
    Write-Host "✅ sw.js exists" -ForegroundColor Green
    $swSize = (Get-Item ".\public\sw.js").Length
    Write-Host "   Size: $swSize bytes" -ForegroundColor Gray
} else {
    Write-Host "❌ sw.js not found" -ForegroundColor Red
}

# Check icons
Write-Host "`n4. Checking PWA icons..." -ForegroundColor Yellow
$icons = @(
    ".\public\icons\icon-192x192.png",
    ".\public\icons\icon-512x512.png", 
    ".\public\icons\apple-icon-180x180.png",
    ".\public\favicon.ico"
)

foreach ($icon in $icons) {
    if (Test-Path $icon) {
        $iconSize = (Get-Item $icon).Length
        Write-Host "✅ $(Split-Path $icon -Leaf) ($iconSize bytes)" -ForegroundColor Green
    } else {
        Write-Host "❌ $(Split-Path $icon -Leaf) not found" -ForegroundColor Red
    }
}

# Check key PWA files
Write-Host "`n5. Checking PWA implementation files..." -ForegroundColor Yellow
$pwaFiles = @(
    ".\components\pwa-manager.tsx",
    ".\lib\offline-db.ts",
    ".\hooks\use-offline.ts"
)

foreach ($file in $pwaFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $(Split-Path $file -Leaf)" -ForegroundColor Green
    } else {
        Write-Host "❌ $(Split-Path $file -Leaf) not found" -ForegroundColor Red
    }
}

Write-Host "`n🎯 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Open http://localhost:3002 in Chrome/Edge" -ForegroundColor White
Write-Host "2. Check for install prompt in address bar" -ForegroundColor White
Write-Host "3. Test offline mode: DevTools > Network > Offline" -ForegroundColor White
Write-Host "4. Test POS offline: http://localhost:3002/dashboard/pos" -ForegroundColor White
Write-Host "5. Check offline status: http://localhost:3002/dashboard/offline-status" -ForegroundColor White

Write-Host "`n📱 Mobile Test:" -ForegroundColor Cyan
Write-Host "1. Connect phone to same network" -ForegroundColor White
Write-Host "2. Get local IP: ipconfig" -ForegroundColor White
Write-Host "3. Access: http://[YOUR-IP]:3002" -ForegroundColor White
Write-Host "4. Add to Home Screen from browser menu" -ForegroundColor White

Write-Host "`n✨ PWA Test Complete!" -ForegroundColor Green
