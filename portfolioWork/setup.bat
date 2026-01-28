@echo off
REM Backend + Frontend Setup Script for Windows

echo.
echo Launching Portfolio Backend and Frontend Setup...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is not installed. Please install from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node -v

echo npm version:
npm -v

echo.
echo Setting up Backend...
cd backend

echo   Installing dependencies...
call npm install

if not exist ".env.local" (
    echo.
    echo WARNING: .env.local not found!
    echo Create backend\.env.local with your API keys:
    echo.
    echo PORT=5000
    echo NODE_ENV=development
    echo MISTRAL_API_KEY=your_key_here
    echo OPENROUTER_API_KEY=your_key_here
    echo.
)

cd ..

echo.
echo Setting up Frontend...
call npm install

echo.
echo Setup complete!
echo.
echo To run your application:
echo.
echo   Terminal 1 (Backend):
echo     cd backend
echo     npm run dev
echo.
echo   Terminal 2 (Frontend):
echo     ng serve
echo.
echo   Then open: http://localhost:4200
echo.
echo For more info, see BACKEND_FRONTEND_INTEGRATION.md
echo.
pause
