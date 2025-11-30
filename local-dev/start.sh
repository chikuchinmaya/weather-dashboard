#!/bin/bash

echo "================================================"
echo "Weather Dashboard - Local Development"
echo "================================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo ""
fi

# Check if .env file exists and has API key
if grep -q "YOUR_API_KEY_HERE" .env 2>/dev/null; then
    echo "⚠️  WARNING: Please add your OpenWeatherMap API key to .env file"
    echo "Get a free API key from: https://openweathermap.org/api"
    echo ""
    read -p "Press Enter to continue..."
fi

echo "Starting server..."
echo "Server will run on http://localhost:3000"
echo ""
echo "Open index.html in your browser to use the app"
echo "Press Ctrl+C to stop the server"
echo ""
echo "================================================"
node server.js
