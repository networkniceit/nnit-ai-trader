const express = require('express')

const router = express.Router()

const tradeController = require('../controllers/tradeController')

router.get('/status',tradeController.status)

module.exports = router