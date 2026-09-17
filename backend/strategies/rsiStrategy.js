function rsiStrategy(rsi) {

    if (rsi < 30)
        return "BUY"

    if (rsi > 70)
        return "SELL"

    return "HOLD"
}

module.exports = rsiStrategy