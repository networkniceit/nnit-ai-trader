let trades = []

function addTrade(trade) {

    trades.push({
        ...trade,
        id: Date.now()
    })

    return true
}

function getTrades() {
    return trades
}

function getTradeCount() {
    return trades.length
}

function clearTrades() {
    trades = []
}

module.exports = {
    addTrade,
    getTrades,
    getTradeCount,
    clearTrades
}