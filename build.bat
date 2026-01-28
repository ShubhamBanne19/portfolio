@echo off
REM Portfolio Build Script for Windows
REM This script builds the Angular portfolio application

echo.
echo ========================================
echo   Portfolio Build Script
echo ========================================
echo.

cd portfolioWork

REM Check if node_modules exists
if not exist "node_modules" (
    echo [1/3] Installing dependencies...
    call npm ci
    if errorlevel 1 (
        echo Error: npm install failed
        exit /b 1
    )
) else (
    echo [1/3] Dependencies already installed (skipping npm ci)
)

echo.
echo [2/3] Building application...
call npm run build
if errorlevel 1 (
    echo Error: Build failed
    exit /b 1
)

echo.
echo [3/3] Verifying build output...
if exist "dist\portfolio-work\browser" (
    echo.
    echo ========================================
    echo ✓ BUILD SUCCESSFUL!
    echo ========================================
    echo.
    echo Build artifacts location:
    dir /s dist\portfolio-work\browser | find "File(s)" /c
    echo.
    echo Next steps:
    echo   1. Review your changes locally
    echo   2. git add .
    echo   3. git commit -m "Your message"
    echo   4. git push origin feature
    echo   5. Create PR on GitHub (feature ^-> main)
    echo.
) else (
    echo Error: Build output directory not found
    exit /b 1
)

cd ..
