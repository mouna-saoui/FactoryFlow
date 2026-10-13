const express = require('express');
const routes  = require('./Routes/Routes');

const app = express();

app.use(express.json());
app.use('/api', routes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Global error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

module.exports = app;
