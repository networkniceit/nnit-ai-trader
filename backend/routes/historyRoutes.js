const express = require('express');
const router = express.Router();
const history = require('../services/enterpriseReadModel');
router.get('/', (req, res) => {
  res.set('Cache-Control', 'no-store');
  try { res.json(history.getTrades()); }
  catch { res.status(503).json({ error: 'Recorded trade history is unavailable.' }); }
});
module.exports = router;
