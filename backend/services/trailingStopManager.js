const trailingStops = {}

const DEFAULT_TRAIL_PERCENT = 1.5

function updateTrailingStop(
    symbol,
    currentPrice,
    entryPrice,
    trailPercent = DEFAULT_TRAIL_PERCENT
) {

    if (!trailingStops[symbol]) {

        trailingStops[symbol] = {

            highestPrice: currentPrice,

            stopPrice:
                currentPrice *
                (1 - trailPercent / 100)

        }

    }

    if (
        currentPrice >
        trailingStops[symbol].highestPrice
    ) {

        trailingStops[symbol].highestPrice =
            currentPrice

        trailingStops[symbol].stopPrice =
            currentPrice *
            (1 - trailPercent / 100)

    }

    return trailingStops[symbol]

}

function shouldTriggerTrailingStop(
    symbol,
    currentPrice
) {

    if (!trailingStops[symbol]) {

        return false

    }

    return (
        currentPrice <=
        trailingStops[symbol].stopPrice
    )

}

function clearTrailingStop(symbol) {

    delete trailingStops[symbol]

}

module.exports = {

    updateTrailingStop,

    shouldTriggerTrailingStop,

    clearTrailingStop

}