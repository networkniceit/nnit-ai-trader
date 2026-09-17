const portfolio = require('./portfolio')

const STOP_LOSS = 0.03 // 3%
const TRAILING_STOP = 0.02

let peakPrices = {}

function checkStopLoss(symbol, price) {

    const data = portfolio.getPortfolio()

    const entry = data.entryPrices[symbol]

    if (!entry) return false

    // update peak
    if (!peakPrices[symbol] || price > peakPrices[symbol]) {
        peakPrices[symbol] = price
    }

    const loss = (price - entry) / entry

    // hard stop loss
    if (loss <= -STOP_LOSS) {
        return 'STOP_LOSS'
    }

    // trailing stop
    const trailingDrop =
        (price - peakPrices[symbol]) / peakPrices[symbol]

    if (trailingDrop <= -TRAILING_STOP) {
        return 'TRAILING_STOP'
    }

    return false
}

module.exports = checkStopLoss