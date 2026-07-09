const express = require('express');
const path = require('path');

const app = express();
const ROOT = __dirname;

// Homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(ROOT, 'index.html'));
});

// Service pages (clean URLs)
app.get('/e-commerce', (req, res) => {
  res.sendFile(path.join(ROOT, 'e-commerce.html'));
});

app.get('/business-dev', (req, res) => {
  res.sendFile(path.join(ROOT, 'business-dev.html'));
});

app.get('/web-design', (req, res) => {
  res.sendFile(path.join(ROOT, 'web-design.html'));
});

app.get('/campaigns', (req, res) => {
  res.sendFile(path.join(ROOT, 'campaigns.html'));
});

app.get('/rcm', (req, res) => {
  res.sendFile(path.join(ROOT, 'rcm.html'));
});

// Static assets (support.js, uploads, .html files, etc.)
app.use(express.static(ROOT, {
  setHeaders(res, filePath) {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    }
  },
}));

// Local development only — Vercel serverless imports this module without listening.
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
