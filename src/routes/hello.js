const express = require('express');
const axios = require('axios');
const router = express.Router();

// Replace with your actual OpenWeatherMap API key
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

router.get('/', async (req, res) => {
  const visitorName = req.query.visitor_name || 'Guest';
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  try {
    // Fetch location data
    const locationResponse = await axios.get(`https://ipapi.co/${clientIp}/json/`);
    const location = locationResponse.data.city || 'Unknown City';
    const lat = locationResponse.data.latitude;
    const lon = locationResponse.data.longitude;

    // Fetch weather data
    const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`);
    const temperature = weatherResponse.data.main.temp;

    res.json({
      client_ip: clientIp,
      location: location,
      greeting: `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${location}`
    });
  } catch (error) {
    res.status(500).json({
      error: 'Could not retrieve location or weather data'
    });
  }
});

module.exports = router;
