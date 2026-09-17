function strategyEngine(price, previousPrice, context = {}) {

    const change = ((price - previousPrice) / previousPrice) * 100

    const volatility = Math.abs(change)

    // 🔴 NOISE FILTER
    if (volatility < 0.08) {
        return 'HOLD'
    }

    // 🔵 STRONG BUY
    if (
        change > 0.12 &&
        context.trendConfirmed
    ) {
        return 'BUY'
    }

    // 🔻 STRONG SELL
    if (
        change < -0.12 &&
        context.trendConfirmed
    ) {
        return 'SELL'
    }

    return 'HOLD'
}

module.exports = strategyEngine