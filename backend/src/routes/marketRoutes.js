const express = require('express');
const { getMarketOutlook } = require('../controllers/marketController');

const router = express.Router();

router.get('/outlook/:symbol', getMarketOutlook);

module.exports = router;
