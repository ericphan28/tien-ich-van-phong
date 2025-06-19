@echo off
echo Cleaning Next.js cache...
rmdir /s /q .next 2>nul
rmdir /s /q node_modules\.cache 2>nul

echo Installing dependencies...
call npm install

echo Starting development server...
call npm run dev-clean

pause
