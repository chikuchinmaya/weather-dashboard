// Local Development Server
// Run this instead of AWS Lambda for local testing

const http = require('http');
const axios = require('axios');
require('dotenv').config();

const PORT = 3000;
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || 'YOUR_API_KEY_HERE';
const OPENWEATHER_BASE_URL = 'http://api.openweathermap.org/data/2.5';

// Create HTTP server
const server = http.createServer(async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Parse URL
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const path = url.pathname;
    const city = url.searchParams.get('city');

    console.log(`[${new Date().toISOString()}] ${req.method} ${path}?city=${city}`);

    try {
        // Route handling
        if (path === '/weather') {
            await handleWeather(city, res);
        } else if (path === '/forecast') {
            await handleForecast(city, res);
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'Endpoint not found', code: 'NOT_FOUND' }));
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Internal server error', code: 'INTERNAL_ERROR' }));
    }
});

// Handle current weather request
async function handleWeather(city, res) {
    if (!city || city.trim() === '') {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'City parameter required', code: 'MISSING_PARAMETER' }));
        return;
    }

    try {
        const url = `${OPENWEATHER_BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}`;
        const response = await axios.get(url);
        
        const weatherData = {
            city: response.data.name,
            temperature: response.data.main.temp,
            humidity: response.data.main.humidity,
            windSpeed: response.data.wind.speed,
            description: response.data.weather[0].description,
            timestamp: Date.now()
        };

        res.writeHead(200);
        res.end(JSON.stringify(weatherData));
        console.log(`✓ Weather data sent for ${city}`);
    } catch (error) {
        handleApiError(error, res);
    }
}

// Handle forecast request
async function handleForecast(city, res) {
    if (!city || city.trim() === '') {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'City parameter required', code: 'MISSING_PARAMETER' }));
        return;
    }

    try {
        const url = `${OPENWEATHER_BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}`;
        const response = await axios.get(url);
        
        const forecastData = extractForecastData(response.data);

        res.writeHead(200);
        res.end(JSON.stringify(forecastData));
        console.log(`✓ Forecast data sent for ${city}`);
    } catch (error) {
        handleApiError(error, res);
    }
}

// Extract forecast data
function extractForecastData(apiResponse) {
    const city = apiResponse.city.name;
    const dailyForecasts = {};
    
    apiResponse.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        
        if (!dailyForecasts[date]) {
            dailyForecasts[date] = {
                date: date,
                temperature: item.main.temp,
                description: item.weather[0].description,
                humidity: item.main.humidity,
                windSpeed: item.wind.speed,
                count: 1
            };
        } else {
            dailyForecasts[date].temperature += item.main.temp;
            dailyForecasts[date].humidity += item.main.humidity;
            dailyForecasts[date].windSpeed += item.wind.speed;
            dailyForecasts[date].count++;
        }
    });
    
    const forecast = Object.values(dailyForecasts)
        .slice(0, 5)
        .map(day => ({
            date: day.date,
            temperature: day.temperature / day.count,
            description: day.description,
            humidity: day.humidity / day.count,
            windSpeed: day.windSpeed / day.count
        }));
    
    return { city, forecast };
}

// Handle API errors
function handleApiError(error, res) {
    console.error('API Error:', error.message);
    
    if (error.response) {
        const status = error.response.status;
        
        if (status === 404) {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'City not found', code: 'CITY_NOT_FOUND' }));
        } else if (status === 401) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Invalid API key', code: 'API_KEY_ERROR' }));
        } else if (status === 429) {
            res.writeHead(429);
            res.end(JSON.stringify({ error: 'Rate limit exceeded', code: 'RATE_LIMIT' }));
        } else {
            res.writeHead(503);
            res.end(JSON.stringify({ error: 'Weather service unavailable', code: 'SERVICE_ERROR' }));
        }
    } else {
        res.writeHead(503);
        res.end(JSON.stringify({ error: 'Weather service unavailable', code: 'SERVICE_ERROR' }));
    }
}

// Start server
server.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('🌤️  Weather Dashboard - Local Development Server');
    console.log('='.repeat(50));
    console.log(`✓ Server running at http://localhost:${PORT}`);
    console.log(`✓ API Key: ${OPENWEATHER_API_KEY.substring(0, 8)}...`);
    console.log('');
    console.log('Available endpoints:');
    console.log(`  GET http://localhost:${PORT}/weather?city=London`);
    console.log(`  GET http://localhost:${PORT}/forecast?city=London`);
    console.log('');
    console.log('Press Ctrl+C to stop the server');
    console.log('='.repeat(50));
});
