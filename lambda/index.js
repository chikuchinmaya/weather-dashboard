const axios = require('axios');

// Environment variables
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const API_RATE_LIMIT = process.env.API_RATE_LIMIT || 60;
const LOG_LEVEL = process.env.LOG_LEVEL || 'INFO';

// OpenWeatherMap API base URL
const OPENWEATHER_BASE_URL = 'http://api.openweathermap.org/data/2.5';

/**
 * Lambda handler function
 */
exports.handler = async (event) => {
    try {
        // Log invocation
        logInfo('Lambda invoked', { path: event.path, queryParams: event.queryStringParameters });

        // Determine endpoint type
        const path = event.path || event.resource;
        
        if (path.includes('/weather')) {
            return await handleWeatherRequest(event);
        } else if (path.includes('/forecast')) {
            return await handleForecastRequest(event);
        } else {
            return createErrorResponse(404, 'Endpoint not found', 'ENDPOINT_NOT_FOUND');
        }
    } catch (error) {
        logError('Unexpected error', error);
        return createErrorResponse(500, 'Internal server error', 'INTERNAL_ERROR');
    }
};

/**
 * Handle current weather request
 */
async function handleWeatherRequest(event) {
    const city = getCityParameter(event);
    
    if (!city) {
        return createErrorResponse(400, 'City parameter required', 'MISSING_PARAMETER');
    }
    
    if (city.trim() === '') {
        return createErrorResponse(400, 'City name cannot be empty', 'INVALID_PARAMETER');
    }
    
    const url = buildWeatherApiUrl(city);
    
    try {
        const response = await callOpenWeatherApi(url);
        const weatherData = extractWeatherData(response.data);
        return createSuccessResponse(weatherData);
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * Get city parameter from API Gateway event
 * @param {Object} event - API Gateway event
 * @returns {string|null} City name or null
 */
function getCityParameter(event) {
    return event.queryStringParameters?.city || null;
}

/**
 * Build OpenWeatherMap API URL for current weather
 * @param {string} city - City name
 * @returns {string} Complete API URL
 */
function buildWeatherApiUrl(city) {
    return `${OPENWEATHER_BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}`;
}

/**
 * Build OpenWeatherMap API URL for forecast
 * @param {string} city - City name
 * @returns {string} Complete API URL
 */
function buildForecastApiUrl(city) {
    return `${OPENWEATHER_BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}`;
}

/**
 * Call OpenWeatherMap API with retry logic
 * @param {string} url - API URL
 * @param {number} retries - Number of retries (default: 1)
 * @returns {Promise<Object>} API response
 */
async function callOpenWeatherApi(url, retries = 1) {
    try {
        const response = await axios.get(url, { timeout: 10000 });
        return response;
    } catch (error) {
        if (retries > 0 && isRetryableError(error)) {
            logWarn('Retrying API call', { url, retriesLeft: retries });
            await sleep(1000);
            return callOpenWeatherApi(url, retries - 1);
        }
        throw error;
    }
}

/**
 * Check if error is retryable
 * @param {Error} error - Error object
 * @returns {boolean} True if retryable
 */
function isRetryableError(error) {
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        return true;
    }
    if (error.response && error.response.status >= 500) {
        return true;
    }
    return false;
}

/**
 * Handle API errors
 * @param {Error} error - Error object
 * @returns {Object} Error response
 */
function handleApiError(error) {
    logError('API error', error);
    
    if (error.response) {
        const status = error.response.status;
        
        if (status === 404) {
            return createErrorResponse(404, 'City not found', 'CITY_NOT_FOUND');
        } else if (status === 401) {
            return createErrorResponse(500, 'Weather service unavailable', 'SERVICE_ERROR');
        } else if (status === 429) {
            return createErrorResponse(429, 'Rate limit exceeded', 'RATE_LIMIT');
        } else if (status >= 500) {
            return createErrorResponse(503, 'Weather service unavailable', 'SERVICE_ERROR');
        }
    }
    
    // Network errors
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        return createErrorResponse(503, 'Weather service unavailable', 'SERVICE_ERROR');
    }
    
    return createErrorResponse(500, 'Internal server error', 'INTERNAL_ERROR');
}

/**
 * Sleep utility
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Export for testing
module.exports.getCityParameter = getCityParameter;
module.exports.buildWeatherApiUrl = buildWeatherApiUrl;
module.exports.buildForecastApiUrl = buildForecastApiUrl;
module.exports.callOpenWeatherApi = callOpenWeatherApi;
module.exports.handleApiError = handleApiError;
module.exports.isRetryableError = isRetryableError;

/**
 * Extract and transform weather data from OpenWeatherMap API response
 * @param {Object} apiResponse - OpenWeatherMap API response
 * @returns {Object} Transformed weather data
 */
function extractWeatherData(apiResponse) {
    return {
        city: apiResponse.name,
        temperature: apiResponse.main.temp,
        humidity: apiResponse.main.humidity,
        windSpeed: apiResponse.wind.speed,
        description: apiResponse.weather[0].description,
        timestamp: Date.now()
    };
}

// Export for testing
module.exports.extractWeatherData = extractWeatherData;

/**
 * Handle forecast request
 */
async function handleForecastRequest(event) {
    const city = getCityParameter(event);
    
    if (!city) {
        return createErrorResponse(400, 'City parameter required', 'MISSING_PARAMETER');
    }
    
    if (city.trim() === '') {
        return createErrorResponse(400, 'City name cannot be empty', 'INVALID_PARAMETER');
    }
    
    const url = buildForecastApiUrl(city);
    
    try {
        const response = await callOpenWeatherApi(url);
        const forecastData = extractForecastData(response.data);
        return createSuccessResponse(forecastData);
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * Extract and transform forecast data from OpenWeatherMap API response
 * @param {Object} apiResponse - OpenWeatherMap forecast API response
 * @returns {Object} Transformed forecast data
 */
function extractForecastData(apiResponse) {
    const city = apiResponse.city.name;
    
    // Group forecast by day (OpenWeatherMap returns 3-hour intervals)
    const dailyForecasts = {};
    
    apiResponse.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0]; // Extract date (YYYY-MM-DD)
        
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
            // Average the values for the day
            dailyForecasts[date].temperature += item.main.temp;
            dailyForecasts[date].humidity += item.main.humidity;
            dailyForecasts[date].windSpeed += item.wind.speed;
            dailyForecasts[date].count++;
        }
    });
    
    // Calculate averages and take first 5 days
    const forecast = Object.values(dailyForecasts)
        .slice(0, 5)
        .map(day => ({
            date: day.date,
            temperature: day.temperature / day.count,
            description: day.description,
            humidity: day.humidity / day.count,
            windSpeed: day.windSpeed / day.count
        }));
    
    return {
        city,
        forecast
    };
}

// Export for testing
module.exports.extractForecastData = extractForecastData;

/**
 * Create error response
 */
function createErrorResponse(statusCode, message, code) {
    return {
        statusCode,
        headers: getCorsHeaders(),
        body: JSON.stringify({
            error: message,
            code: code,
            timestamp: Date.now()
        })
    };
}

/**
 * Create success response
 */
function createSuccessResponse(data) {
    return {
        statusCode: 200,
        headers: getCorsHeaders(),
        body: JSON.stringify(data)
    };
}

/**
 * Get CORS headers
 */
function getCorsHeaders() {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };
}

/**
 * Logging functions
 */
function logInfo(message, data = {}) {
    if (['INFO', 'DEBUG'].includes(LOG_LEVEL)) {
        console.log(JSON.stringify({ level: 'INFO', message, ...data }));
    }
}

function logError(message, error) {
    console.error(JSON.stringify({
        level: 'ERROR',
        message,
        error: error.message,
        stack: error.stack
    }));
}

function logWarn(message, data = {}) {
    if (['WARN', 'INFO', 'DEBUG'].includes(LOG_LEVEL)) {
        console.warn(JSON.stringify({ level: 'WARN', message, ...data }));
    }
}

// Export helper functions for testing
module.exports.createErrorResponse = createErrorResponse;
module.exports.createSuccessResponse = createSuccessResponse;
module.exports.getCorsHeaders = getCorsHeaders;
