const nnitPaperState = require('./nnitPaperState')
const MAX_OPEN_POSITIONS = 3
const RISK_PER_TRADE = 0.02

let portfolio = nnitPaperState.load({
    cash: 10000,
    holdings: {},
    entryPrices: {},
    pnl: 0
})

function validMarket(symbol, price) {
    return typeof symbol === 'string' && /^[A-Z0-9]{2,12}\/[A-Z0-9]{2,12}$/.test(symbol) && Number.isFinite(price) && price > 0
}

function getPositionSize(price) {
    if (!Number.isFinite(price) || price <= 0) return 0

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
    if (!validMarket(symbol, price) || Object.hasOwn(portfolio.holdings, symbol)) return false

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

    if (!validMarket(symbol, price) || (amount !== null && (!Number.isFinite(amount) || amount <= 0))) return false

    if (!portfolio.holdings[symbol]) {

        console.log("NO HOLDINGS")

        return false

    }

    if (
        amount === null
    ) {

        amount =
            portfolio.holdings[symbol]

    }

    if (amount > portfolio.holdings[symbol]) return false

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

// Save every successful paper mutation; restore memory if the write fails.
function nnitPersisted(operation) {
    return (...args) => {
        const previous = structuredClone(portfolio)
        try {
            const result = operation(...args)
            if (result) nnitPaperState.save(portfolio)
            return result
        } catch (error) {
            portfolio = previous
            throw error
        }
    }
}
module.exports = {
    buy: nnitPersisted(buy),
    sell: nnitPersisted(sell),
    getPortfolio,
    getPositionSize,
    canOpenNewTrade
}