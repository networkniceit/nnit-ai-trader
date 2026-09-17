const MAX_POSITIONS = 3
const portfolio = require('./portfolio')

function canOpenPosition() {

    const data = portfolio.getPortfolio()

    return Object.keys(data.holdings).length < MAX_POSITIONS
}

function positionSize(cash, riskPercent = 0.02) {
    return cash * riskPercent
}

module.exports = {
    canOpenPosition,
    positionSize
}