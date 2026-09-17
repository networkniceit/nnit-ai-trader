const express = require('express')

const router = express.Router()

const history =
    require('../database/tradeHistory')

const performance =
    require('../services/performanceEngine')

router.get(
    '/trades',
    (req, res) => {

        res.json(
            history.getTrades()
        )
    }
)

router.get(
    '/performance',
    (req, res) => {

        res.json(
            performance.getPerformance()
        )
    }
)

module.exports = router