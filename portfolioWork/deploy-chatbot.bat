@echo off
REM Chatbot Deployment Script for GitHub Pages (Windows)

echo.
echo === Portfolio Chatbot Deployment ===
echo.

REM Step 1: Build
echo Step 1: Building project...
call ng build --configuration production --base-href=/portfolio/

if %ERRORLEVEL% neq 0 (
  echo.
  echo [ERROR] Build failed
  pause
  exit /b 1
)

echo [OK] Build successful
echo.

REM Step 2: Test production build
echo Step 2: Starting local server for testing...
echo Visit http://localhost:8080 to test the chatbot
echo.
echo Press Ctrl+C to stop the server when ready
echo.

call npx http-server dist/portfolioWork -p 8080 -c-1

REM Step 3: Deploy
echo.
echo Step 3: Ready to deploy to GitHub Pages
echo When ready, run: angular-cli-ghpages
echo.

pause
