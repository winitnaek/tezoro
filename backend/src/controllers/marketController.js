const { buildMarketOutlook } = require('../engine/outlookEngine');

const SUPPORTED_SYMBOLS = ['BTC', 'ETH', 'AVAX', 'DOGE', 'XRP', 'LTC'];

async function getMarketOutlook(req, res, next) {
  try {
    const symbol = String(req.params.symbol || '').trim().toUpperCase();

    if (!SUPPORTED_SYMBOLS.includes(symbol)) {
      return res.status(400).json({ message: 'Unsupported crypto symbol' });
    }

    const outlook = await buildMarketOutlook(symbol);
    res.json(outlook);
  } catch (error) {
    next(error);
  }
}

module.exports = { getMarketOutlook };

