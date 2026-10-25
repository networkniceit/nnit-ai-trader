const portfolio = require('./portfolio')

const STOP_LOSS = 0.03 // 3%
const TRAILING_STOP = 0.02

const peakPrices = Object.create(null)

function checkStopLoss(symbol, price) {

    const data = portfolio.getPortfolio()

    const entry = data.entryPrices[symbol]

    if (!entry || !data.holdings[symbol]) {
        delete peakPrices[symbol]
        return false
    }

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

// Called only after a successful persisted buy or sale.
function resetPosition(symbol, entryPrice = null) {
    delete peakPrices[symbol]
    if (Number.isFinite(entryPrice) && entryPrice > 0) peakPrices[symbol] = entryPrice
}
checkStopLoss.resetPosition = resetPosition
module.exports = checkStopLoss