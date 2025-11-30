@echo off
echo ================================================
echo Weather Dashboard - Local Development
echo ================================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    echo.
)

REM Check if .env file exists and has API key
findstr /C:"YOUR_API_KEY_HERE" .env >nul 2>&1
if %errorlevel% equ 0 (
    echo WARNING: Please add your OpenWeatherMap API key to .env file
    echo Get a free API key from: https://openweathermap.org/api
    echo.
    pause
)

echo Starting server...
echo Server will run on http://localhost:3000
echo.
echo Open index.html in your browser to use the app
echo Press Ctrl+C to stop the server
echo.
echo ================================================
node server.js
