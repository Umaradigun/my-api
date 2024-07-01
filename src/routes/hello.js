const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
  const visitorName = req.query.visitor_name || 'Guest';
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  try {
    const response = await axios.get(`https://ipapi.co/${clientIp}/json/`);
    const location = response.data.city || 'Unknown City';

    res.json({
      client_ip: clientIp,
      location: location,
      greeting: `Hello, ${visitorName}! The temperature is 11 degrees Celsius in ${location}`
    });
  } catch (error) {
    res.status(500).json({
      error: 'Could not retrieve location'
    });
  }
});

module.exports = router;
