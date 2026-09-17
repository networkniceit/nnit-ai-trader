let trendMemory = {}

function signalEngine(currentPrice, previousPrice, symbol = 'UNKNOWN', priceHistory = null) {

    if (
        !Number.isFinite(currentPrice) ||
        !Number.isFinite(previousPrice) ||
        previousPrice === 0
    ) {
        return 'HOLD'
    }

    if (!trendMemory[symbol]) {
        trendMemory[symbol] = []
    }

    const change =
        ((currentPrice - previousPrice) / previousPrice) * 100

    trendMemory[symbol].push(change)

    if (trendMemory[symbol].length > 5) {
        trendMemory[symbol].shift()
    }

    let avg

    if (
        Array.isArray(priceHistory) &&
        priceHistory.length >= 2
    ) {

        const first =
            Number(priceHistory[0])

        const last =
            Number(priceHistory[priceHistory.length - 1])

        if (
            Number.isFinite(first) &&
            Number.isFinite(last) &&
            first !== 0
        ) {

            avg =
                ((last - first) / first) * 100

        }
        else {

            avg =
                trendMemory[symbol].reduce(
                    (a, b) => a + b,
                    0
                ) /
                trendMemory[symbol].length

        }

    }
    else {

        avg =
            trendMemory[symbol].reduce(
                (a, b) => a + b,
                0
            ) /
            trendMemory[symbol].length

    }

    if (avg >= 0.03) {
        return 'BUY'
    }

    if (avg <= -0.03) {
        return 'SELL'
    }

    return 'HOLD'
}

function resetSignalMemory(symbol = null) {

    if (symbol) {
        delete trendMemory[symbol]
        return
    }

    trendMemory = {}
}

function getSignalMemory() {
    return trendMemory
}

module.exports = signalEngine
module.exports.resetSignalMemory = resetSignalMemory
module.exports.getSignalMemory = getSignalMemory
