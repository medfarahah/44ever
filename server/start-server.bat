@echo off
echo Starting Backend Server...
echo.
echo Checking DATABASE_URL...
findstr /C:"YourPassword" .env >nul 2>&1
if %errorlevel% == 0 (
    echo.
    echo ========================================
    echo ERROR: DATABASE_URL contains placeholder!
    echo ========================================
    echo.
    echo Please update server/.env file:
    echo Replace "npg_YourPassword" with your actual Neon database password
    echo.
    echo Get your connection string from: https://console.neon.tech
    echo.
    pause
    exit /b 1
)
echo DATABASE_URL looks good.
echo.
echo Starting server on http://localhost:5000
echo Press Ctrl+C to stop the server
echo.
npm run dev
