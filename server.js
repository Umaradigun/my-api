const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

console.log("Starting server...");

app.get('/api/hello', async (req, res) => {
  console.log("Received a request");
  const visitorName = req.query.visitor_name || 'Guest';
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  try {
    console.log("Fetching location for IP:", clientIp);
    const response = await axios.get(`https://ipapi.co/${clientIp}/json/`);
    const location = response.data.city || 'Unknown City';
    console.log("Location found:", location);

    res.json({
      client_ip: clientIp,
      location: location,
      greeting: `Hello, ${visitorName}! The temperature is 11 degrees Celsius in ${location}`
    });
  } catch (error) {
    console.error("Error fetching location:", error);
    res.status(500).json({
      error: 'Could not retrieve location'
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
