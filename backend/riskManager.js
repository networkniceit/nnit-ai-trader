const portfolio = require('./portfolio')

const MAX_DAILY_LOSS = -50
const MAX_RISK_EXPOSURE = 0.2

function canTrade() {

    const data = portfolio.getPortfolio()

    // daily loss protection
    if (data.pnl < MAX_DAILY_LOSS) {
        return false
    }

    const totalExposure =
        Object.values(data.holdings)
            .reduce((a, b) => a + b, 0)

    if (totalExposure > MAX_RISK_EXPOSURE * data.cash) {
        return false
    }

    return true
}

module.exports = {
    canTrade
}