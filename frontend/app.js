// Weather Dashboard Frontend Application

// Configuration - Update this URL after deploying API Gateway
const API_GATEWAY_URL = 'https://your-api-gateway-url.amazonaws.com/prod';

// DOM Elements
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const validationError = document.getElementById('validation-error');
const loadingIndicator = document.getElementById('loading-indicator');
const errorMessage = document.getElementById('error-message');
const currentWeather = document.getElementById('current-weather');
const forecastSection = document.getElementById('forecast-section');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    searchForm.addEventListener('submit', handleSearchSubmit);
});

/**
 * Handle search form submission
 */
async function handleSearchSubmit(event) {
    event.preventDefault();
    
    const city = cityInput.value.trim();
    
    // Validate input
    if (!validateCityInput(city)) {
        return;
    }
    
    // Clear previous errors
    hideElement(validationError);
    hideElement(errorMessage);
    
    // Show loading indicator
    showElement(loadingIndicator);
    hideElement(currentWeather);
    hideElement(forecastSection);
    
    try {
        // Fetch weather and forecast data
        const [weatherData, forecastData] = await Promise.all([
            fetchWeather(city),
            fetchForecast(city)
        ]);
        
        // Display data
        displayWeather(weatherData);
        displayForecast(forecastData);
        
        // Hide loading indicator
        hideElement(loadingIndicator);
    } catch (error) {
        hideElement(loadingIndicator);
        displayError(error.message);
    }
}

/**
 * Fetch current weather data
 */
async function fetchWeather(city) {
    const url = `${API_GATEWAY_URL}/weather?city=${encodeURIComponent(city)}`;
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(getErrorMessage(response.status, data));
        }
        
        return data;
    } catch (error) {
        if (error.message.includes('Failed to fetch')) {
            throw new Error('Unable to connect to weather service. Please check your internet connection.');
        }
        throw error;
    }
}

/**
 * Fetch forecast data
 */
async function fetchForecast(city) {
    const url = `${API_GATEWAY_URL}/forecast?city=${encodeURIComponent(city)}`;
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(getErrorMessage(response.status, data));
        }
        
        return data;
    } catch (error) {
        if (error.message.includes('Failed to fetch')) {
            throw new Error('Unable to connect to weather service. Please check your internet connection.');
        }
        throw error;
    }
}

/**
 * Get error message based on status code
 */
function getErrorMessage(status, data) {
    if (status === 404) {
        return 'City not found. Please check the spelling and try again.';
    } else if (status === 429) {
        return 'Too many requests. Please wait a moment and try again.';
    } else if (status >= 500) {
        return 'Weather service unavailable. Please try again later.';
    } else if (data && data.error) {
        return data.error;
    }
    return 'An error occurred. Please try again.';
}

/**
 * Display current weather data
 */
function displayWeather(data) {
    document.getElementById('weather-city').textContent = data.city;
    document.getElementById('weather-temperature').textContent = formatTemperature(data.temperature);
    document.getElementById('weather-humidity').textContent = formatHumidity(data.humidity);
    document.getElementById('weather-wind-speed').textContent = formatWindSpeed(data.windSpeed);
    document.getElementById('weather-description').textContent = capitalizeFirstLetter(data.description);
    
    showElement(currentWeather);
}

/**
 * Format temperature value
 */
function formatTemperature(temp) {
    return `${temp.toFixed(2)} K`;
}

/**
 * Format humidity value
 */
function formatHumidity(humidity) {
    return `${humidity.toFixed(2)}%`;
}

/**
 * Format wind speed value
 */
function formatWindSpeed(speed) {
    return `${speed.toFixed(2)} m/s`;
}

/**
 * Capitalize first letter of string
 */
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Display forecast data
 */
function displayForecast(data) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = '';
    
    // Sort forecast by date (chronological order)
    const sortedForecast = data.forecast.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
    });
    
    // Create forecast cards
    sortedForecast.forEach(day => {
        const card = createForecastCard(day);
        forecastContainer.appendChild(card);
    });
    
    showElement(forecastSection);
}

/**
 * Create forecast card element
 */
function createForecastCard(day) {
    const card = document.createElement('div');
    card.className = 'forecast-card';
    
    const date = document.createElement('div');
    date.className = 'date';
    date.textContent = formatDate(day.date);
    
    const temperature = document.createElement('div');
    temperature.className = 'temperature';
    temperature.textContent = formatTemperature(day.temperature);
    
    const description = document.createElement('div');
    description.className = 'description';
    description.textContent = capitalizeFirstLetter(day.description);
    
    card.appendChild(date);
    card.appendChild(temperature);
    card.appendChild(description);
    
    return card;
}

/**
 * Format date string
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Display error message
 */
function displayError(message) {
    errorMessage.textContent = message;
    showElement(errorMessage);
    hideElement(currentWeather);
    hideElement(forecastSection);
}

/**
 * Validate city input
 * Accepts alphanumeric characters and spaces only
 */
function validateCityInput(city) {
    if (!city || city.trim() === '') {
        showValidationError('Please enter a city name.');
        return false;
    }
    
    // Check for alphanumeric characters and spaces only
    const validPattern = /^[a-zA-Z0-9\s]+$/;
    if (!validPattern.test(city)) {
        showValidationError('Please enter a valid city name (letters, numbers, and spaces only).');
        return false;
    }
    
    return true;
}

/**
 * Show validation error
 */
function showValidationError(message) {
    validationError.textContent = message;
    showElement(validationError);
    cityInput.focus();
}

/**
 * Show element
 */
function showElement(element) {
    element.classList.remove('hidden');
}

/**
 * Hide element
 */
function hideElement(element) {
    element.classList.add('hidden');
}

// Export functions for testing (if in Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateCityInput,
        formatTemperature,
        formatHumidity,
        formatWindSpeed,
        displayWeather,
        displayForecast,
        getErrorMessage
    };
}
