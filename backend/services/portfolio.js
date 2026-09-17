const MAX_OPEN_POSITIONS = 3
const RISK_PER_TRADE = 0.02

let portfolio = {
    cash: 10000,
    holdings: {},
    entryPrices: {},
    pnl: 0
}

function getPositionSize(price) {

    const riskAmount = portfolio.cash * RISK_PER_TRADE

    return Number(
        (riskAmount / price).toFixed(6)
    )

}

function canOpenNewTrade() {

    return Object.keys(
        portfolio.holdings
    ).length < MAX_OPEN_POSITIONS

}

function buy(symbol, price) {

    if (!canOpenNewTrade()) {

        console.log("MAX POSITIONS REACHED")

        return false

    }

    const amount =
        getPositionSize(price)

    if (amount <= 0) {

        console.log(
            "POSITION SIZE TOO SMALL"
        )

        return false

    }

    const cost = price * amount

    if (portfolio.cash < cost) {

        console.log(
            "NOT ENOUGH CASH"
        )

        return false

    }

    portfolio.cash -= cost

    portfolio.holdings[symbol] =
        (portfolio.holdings[symbol] || 0)
        + amount

    portfolio.entryPrices[symbol] =
        price

    console.log(
        `BUY ${symbol} x${amount} @ ${price}`
    )

    return true

}

function sell(
    symbol,
    price,
    amount = null
) {

    if (!portfolio.holdings[symbol]) {

        console.log("NO HOLDINGS")

        return false

    }

    if (
        amount === null ||
        amount > portfolio.holdings[symbol]
    ) {

        amount =
            portfolio.holdings[symbol]

    }

    const entry =
        portfolio.entryPrices[symbol]
        || price

    const profit =
        (price - entry) * amount

    portfolio.pnl = Number(
        (
            portfolio.pnl + profit
        ).toFixed(2)
    )

    portfolio.cash +=
        price * amount

    portfolio.holdings[symbol] -=
        amount

    if (
        portfolio.holdings[symbol]
        <= 0
    ) {

        delete portfolio.holdings[symbol]

        delete portfolio.entryPrices[symbol]

    }

    console.log(
        `SELL ${symbol} x${amount} @ ${price} | PnL: ${profit.toFixed(2)}`
    )

    return true

}

function getPortfolio() {

    return portfolio

}

module.exports = {
    buy,
    sell,
    getPortfolio,
    getPositionSize,
    canOpenNewTrade
}