@echo off
setlocal
cd /d "%~dp0"

echo ============================================
echo   CyberGuard Chronicles - Local Launcher
echo ============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Node.js not found. Please install Node.js 18+ first.
    echo Download: https://nodejs.org/
    pause
    exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
    echo [ERROR] npm not found. Please check your Node.js installation.
    pause
    exit /b 1
)

if not exist "node_modules\" (
    echo [Step 1/2] First run detected. Installing dependencies...
    echo This may take a few minutes, please wait.
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo [ERROR] npm install failed. Check network or npm config.
        pause
        exit /b 1
    )
    echo.
    echo [Done] Dependencies installed.
    echo.
) else (
    echo [Step 1/2] node_modules found, skipping install.
    echo.
)

echo [Step 2/2] Starting dev server (npm run dev)...
echo Open the http://localhost:xxxx URL shown below in your browser.
echo Press Ctrl+C or close this window to stop the server.
echo.

call npm run dev

echo.
echo Dev server stopped.
pause
endlocal
