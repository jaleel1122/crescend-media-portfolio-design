const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Service pages (clean URLs)
app.get('/e-commerce', (req, res) => {
  res.sendFile(path.join(__dirname, 'e-commerce.html'));
});

app.get('/business-dev', (req, res) => {
  res.sendFile(path.join(__dirname, 'business-dev.html'));
});

app.get('/web-design', (req, res) => {
  res.sendFile(path.join(__dirname, 'web-design.html'));
});

app.get('/campaigns', (req, res) => {
  res.sendFile(path.join(__dirname, 'campaigns.html'));
});

app.get('/rcm', (req, res) => {
  res.sendFile(path.join(__dirname, 'rcm.html'));
});

// Static assets (support.js, uploads, .html files, etc.)
app.use(express.static(__dirname));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
