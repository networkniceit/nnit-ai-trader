const ccxt = require('ccxt')

const exchange = new ccxt.binance({
    apiKey: process.env.BINANCE_API_KEY,
    secret: process.env.BINANCE_SECRET
})

module.exports = exchange