const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const marketRoutes = require('./routes/marketRoutes');
const { getProviderHealth } = require('./services/providerHealthService');

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173'
  })
);
app.use(express.json({ limit: '20kb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'tezoro-market-api' });
});

app.get('/health/providers', async (req, res, next) => {
  try {
    const health = await getProviderHealth();
    res.json(health);
  } catch (error) {
    next(error);
  }
});

app.use('/market', marketRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
});

module.exports = app;
