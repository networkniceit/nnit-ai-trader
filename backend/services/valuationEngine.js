const portfolio = require('./portfolio')

function calculatePortfolioValue(prices = {}) {

    const state = portfolio.getPortfolio()

    let holdingsValue = 0

    for (const symbol in state.holdings) {

        const amount = state.holdings[symbol]
        const price = prices[symbol] || 0

        holdingsValue += amount * price
    }

    return {
        cash: Number(state.cash.toFixed(2)),
        holdingsValue: Number(holdingsValue.toFixed(2)),
        totalValue: Number(
            (state.cash + holdingsValue).toFixed(2)
        ),
        pnl: Number(state.pnl.toFixed(2))
    }
}

module.exports = calculatePortfolioValue