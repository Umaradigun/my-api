const express = require('express');
const axios = require('axios');
const router = express.Router();

// Replace with your actual OpenWeatherMap API key if available
const WEATHER_API_KEY = process.env.WEATHER_API_KEY || ac589e1027154a81d2aa1f6c69d2718f;

router.get('/', async (req, res) => {
  const visitorName = req.query.visitor_name || 'Guest';
  const forwardedIpsStr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const clientIp = forwardedIpsStr.split(',')[0].trim();

  console.log(`Client IP: ${clientIp}`);
  console.log(`Weather API Key: ${WEATHER_API_KEY ? WEATHER_API_KEY.slice(0, 5) + '...' : 'Not Set'}`);

  try {
    // Fetch location data
    const locationResponse = await axios.get(`https://ipapi.co/${clientIp}/json/`);
    console.log('Location Response:', locationResponse.data);
    const location = locationResponse.data.city || 'Unknown City';
    const lat = locationResponse.data.latitude;
    const lon = locationResponse.data.longitude;

    console.log(`Location: ${location}, Latitude: ${lat}, Longitude: ${lon}`);

    let temperature = 'unknown';

    if (WEATHER_API_KEY) {
      // Fetch weather data only if the API key is set
      try {
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`);
        console.log('Weather Response:', weatherResponse.data);
        temperature = weatherResponse.data.main.temp;
      } catch (weatherError) {
        console.error('Weather API Error:', weatherError);
        // Continue even if the weather API fails
      }
    }

    res.json({
      client_ip: clientIp,
      location: location,
      greeting: `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${location}`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Could not retrieve location data'
    });
  }
});

module.exports = router;
