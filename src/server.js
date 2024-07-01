const express = require('express');
const http = require('http');
const app = express();
const port = process.env.PORT || 3000;

// Import routes
const helloRoute = require('./routes/hello');

// Use routes
app.use('/api/hello', helloRoute);

// Create HTTP server
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
