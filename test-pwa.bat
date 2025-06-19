@echo off
echo.
echo ========================================
echo        PWA Quick Test Script
echo ========================================
echo.

echo 1. Checking PWA files...
if exist "public\manifest.json" (
    echo    ✓ manifest.json found
) else (
    echo    ✗ manifest.json missing
)

if exist "public\sw.js" (
    echo    ✓ service worker found
) else (
    echo    ✗ service worker missing
)

if exist "public\icons\icon-192x192.png" (
    echo    ✓ PWA icons found
) else (
    echo    ✗ PWA icons missing
)

echo.
echo 2. Testing server connection...
curl -s -o nul --max-time 3 http://localhost:3002 && (
    echo    ✓ Server running at http://localhost:3002
) || (
    echo    ✗ Server not running - start with: npm run dev
)

echo.
echo ========================================
echo           Test Instructions
echo ========================================
echo.
echo Desktop Test:
echo   1. Open http://localhost:3002
echo   2. Look for install icon in address bar
echo   3. Test offline: DevTools ^> Network ^> Offline
echo.
echo Mobile Test:
echo   1. Find your IP: ipconfig
echo   2. Access http://[YOUR-IP]:3002 on phone
echo   3. Add to Home Screen
echo.
echo PWA Features:
echo   • Offline POS: /dashboard/pos
echo   • Status page: /dashboard/offline-status
echo   • Install prompt and standalone mode
echo.
pause
