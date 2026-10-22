const express = require('express');
const router = express.Router();
const history = require('../services/enterpriseReadModel');
router.get('/trades', (req, res) => {
  res.set('Cache-Control', 'no-store');
  try { res.json(history.getTrades()); }
  catch { res.status(503).json({ error: 'Recorded trade history is unavailable.' }); }
});
router.get('/performance', (req, res) => {
  res.set('Cache-Control', 'no-store');
  try { res.json(history.getPerformance()); }
  catch { res.status(503).json({ error: 'Recorded performance is unavailable.' }); }
});
module.exports = router;
