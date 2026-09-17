function stopLoss(entryPrice, currentPrice) {

    const stopLossPercent = 2

    const loss =
        ((entryPrice - currentPrice) / entryPrice) * 100

    return loss >= stopLossPercent

}

module.exports = stopLoss