# Weather Dashboard - Local Development

Run the Weather Dashboard locally without AWS! This version uses a Node.js server instead of AWS Lambda.

## 🚀 Quick Start (3 Steps)

### 1. Install Dependencies

```bash
cd local-dev
npm install
```

### 2. Add Your API Key

Edit `.env` file and add your OpenWeatherMap API key:

```
OPENWEATHER_API_KEY=your_actual_api_key_here
```

Get a free API key from: https://openweathermap.org/api

### 3. Start the Server

```bash
npm start
```

The server will start on http://localhost:3000

### 4. Open the App

Open `index.html` in your browser, or use a simple HTTP server:

```bash
# Option 1: Open directly
# Just double-click index.html

# Option 2: Use Python HTTP server
python -m http.server 8080

# Option 3: Use Node.js http-server
npx http-server -p 8080
```

Then visit: http://localhost:8080

## 📁 Files in This Directory

```
local-dev/
├── server.js       # Node.js backend server (replaces AWS Lambda)
├── package.json    # Node.js dependencies
├── .env            # Environment variables (API key)
├── index.html      # Frontend HTML
├── styles.css      # Frontend CSS
├── app.js          # Frontend JavaScript
└── README.md       # This file
```

## 🔧 How It Works

1. **Backend Server** (`server.js`):
   - Runs on http://localhost:3000
   - Handles `/weather` and `/forecast` endpoints
   - Calls OpenWeatherMap API
   - Returns formatted data to frontend

2. **Frontend** (`index.html`, `app.js`, `styles.css`):
   - User interface for searching cities
   - Makes requests to local server
   - Displays weather and forecast data

## 📝 API Endpoints

### GET /weather?city={cityName}
Returns current weather data

**Example:**
```bash
curl "http://localhost:3000/weather?city=London"
```

**Response:**
```json
{
  "city": "London",
  "temperature": 285.15,
  "humidity": 75,
  "windSpeed": 5.5,
  "description": "clear sky",
  "timestamp": 1234567890
}
```

### GET /forecast?city={cityName}
Returns 5-day forecast

**Example:**
```bash
curl "http://localhost:3000/forecast?city=London"
```

## 🛠️ Development Mode

For auto-restart on file changes:

```bash
npm run dev
```

This uses `nodemon` to automatically restart the server when you edit `server.js`.

## 🧪 Testing

### Test the Backend

```bash
# Test weather endpoint
curl "http://localhost:3000/weather?city=London"

# Test forecast endpoint
curl "http://localhost:3000/forecast?city=Paris"

# Test error handling
curl "http://localhost:3000/weather?city=InvalidCityName123"
```

### Test the Frontend

1. Open `index.html` in your browser
2. Enter a city name (e.g., "London")
3. Click "Get Weather"
4. Verify weather and forecast display

## 🐛 Troubleshooting

### Server won't start

**Error:** `Cannot find module 'axios'`

**Solution:**
```bash
npm install
```

### API returns "Invalid API key"

**Error:** `401 Unauthorized`

**Solution:**
1. Check your `.env` file
2. Verify API key is correct
3. Make sure there are no extra spaces
4. Restart the server after changing `.env`

### Frontend can't connect to server

**Error:** "Unable to connect to local server"

**Solution:**
1. Make sure server is running (`npm start`)
2. Check server is on http://localhost:3000
3. Check browser console for CORS errors

### City not found

**Error:** "City not found"

**Solution:**
1. Check city name spelling
2. Try variations (e.g., "New York" vs "New York City")
3. Use English city names

## 🔑 Environment Variables

Edit `.env` file:

```bash
# Required: Your OpenWeatherMap API key
OPENWEATHER_API_KEY=your_api_key_here
```

## 📊 Server Logs

The server logs all requests:

```
[2024-01-15T10:30:00.000Z] GET /weather?city=London
✓ Weather data sent for London

[2024-01-15T10:30:05.000Z] GET /forecast?city=London
✓ Forecast data sent for London
```

## 🌐 Port Configuration

Default port is 3000. To change it, edit `server.js`:

```javascript
const PORT = 3000; // Change this to your preferred port
```

## 🔒 Security Notes

- This is for **local development only**
- Don't expose this server to the internet
- Keep your API key private
- Don't commit `.env` file to git

## 📦 Dependencies

- **axios**: HTTP client for API requests
- **dotenv**: Load environment variables from .env file
- **nodemon** (dev): Auto-restart server on changes

## 🚀 Moving to Production

When ready to deploy to AWS:

1. Use the files in the parent directory
2. Follow the deployment guide in `../DEPLOYMENT.md`
3. The AWS version uses Lambda instead of this Node.js server

## 💡 Tips

1. **Use nodemon for development:**
   ```bash
   npm run dev
   ```

2. **Test API endpoints with curl:**
   ```bash
   curl "http://localhost:3000/weather?city=Tokyo"
   ```

3. **Check server logs for debugging:**
   - Server logs appear in the terminal
   - Look for error messages and API responses

4. **Keep the server running:**
   - Don't close the terminal window
   - Press Ctrl+C to stop the server

## 🎯 Next Steps

1. ✅ Install dependencies
2. ✅ Add API key to `.env`
3. ✅ Start the server
4. ✅ Open `index.html` in browser
5. ✅ Search for a city
6. ✅ View weather and forecast

## 📞 Support

If you encounter issues:

1. Check server is running
2. Verify API key is valid
3. Check browser console for errors
4. Review server logs in terminal
5. Test API endpoints with curl

---

**Enjoy your local Weather Dashboard! 🌤️**
