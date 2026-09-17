let trades = []

function openTrade(symbol, price, amount) {

    const trade = {
        id: Date.now(),
        symbol,
        entry: price,
        amount,
        status: 'OPEN',
        openTime: new Date()
    }

    trades.push(trade)

    return trade
}

function closeTrade(id, price) {

    const trade = trades.find(t => t.id === id)

    if (!trade) return null

    trade.exit = price
    trade.status = 'CLOSED'
    trade.pnl = (price - trade.entry) * trade.amount
    trade.closeTime = new Date()

    return trade
}

function getOpenTrades() {
    return trades.filter(t => t.status === 'OPEN')
}

module.exports = {
    openTrade,
    closeTrade,
    getOpenTrades
}