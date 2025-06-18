@echo off
chcp 65001 >nul
title Module Packager

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    📦 MODULE PACKAGER                        ║
echo ║              Đóng gói modules thành package                  ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

if "%1"=="" goto usage
if "%1"=="help" goto usage

if "%1"=="list" goto list
if "%1"=="folder" goto folder
if "%1"=="standalone" goto standalone
if "%1"=="package-all" goto package-all

echo ❌ Lệnh không hợp lệ: %1
echo.
goto usage

:list
echo 📋 Liệt kê tất cả modules...
npx ts-node scripts/module-packager.ts list
goto end

:folder
if "%2"=="" (
    echo ❌ Vui lòng cung cấp Module ID
    echo Ví dụ: package-modules.bat folder tax-calculator
    goto end
)
echo 📁 Đóng gói module %2 thành folder...
npx ts-node scripts/module-packager.ts folder %2
goto end

:standalone
if "%2"=="" (
    echo ❌ Vui lòng cung cấp Module ID  
    echo Ví dụ: package-modules.bat standalone tax-calculator
    goto end
)
echo 🏗️ Tạo standalone package cho module %2...
npx ts-node scripts/module-packager.ts standalone %2
goto end

:package-all
echo 📦 Đóng gói tất cả modules...
npx ts-node scripts/module-packager.ts package-all
goto end

:usage
echo 📖 Cách sử dụng:
echo.
echo   package-modules.bat list                    # Liệt kê tất cả modules
echo   package-modules.bat folder ^<module-id^>      # Đóng gói thành folder
echo   package-modules.bat standalone ^<module-id^>  # Tạo standalone package
echo   package-modules.bat package-all             # Đóng gói tất cả modules
echo.
echo 📝 Ví dụ:
echo   package-modules.bat list
echo   package-modules.bat folder tax-calculator
echo   package-modules.bat standalone qr-generator-v2
echo   package-modules.bat package-all
echo.
echo 💡 Để tạo file .zip, sử dụng WinRAR/7-Zip hoặc PowerShell script
goto end

:end
echo.
echo 🎉 Hoàn thành!
echo 📁 Kết quả tại: dist\packages\
pause
