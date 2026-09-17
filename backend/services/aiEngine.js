function aiEngine(trend) {

    if (trend.trend === "UP")
        return "BUY"

    if (trend.trend === "DOWN")
        return "SELL"

    return "HOLD"

}

module.exports = aiEngine
