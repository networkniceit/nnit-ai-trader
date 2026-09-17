function takeProfit(entryPrice, currentPrice) {

    const takeProfitPercent = 3

    const gain =
        ((currentPrice - entryPrice) / entryPrice) * 100

    return gain >= takeProfitPercent

}

module.exports = takeProfit