const predictions = {}

function calculateMomentum(prices = []) {

    if (!Array.isArray(prices) || prices.length < 2) {

        return 0

    }

    const first = prices[0]

    const last = prices[prices.length - 1]

    return Number(
        (
            (
                (last - first)
                / first
            ) * 100
        ).toFixed(4)
    )

}

function calculateVolatility(prices = []) {

    if (!Array.isArray(prices) || prices.length < 2) {

        return 0

    }

    let changes = []

    for (let i = 1; i < prices.length; i++) {

        changes.push(

            Math.abs(

                (
                    prices[i]
                    - prices[i - 1]
                )
                /
                prices[i - 1]

            )

        )

    }

    const avg =

        changes.reduce(

            (a, b) => a + b,
            0

        )

        / changes.length

    return Number(
        (
            avg * 100
        ).toFixed(4)
    )

}

function predictTrend(
    symbol,
    prices = []
) {

    const momentum =
        calculateMomentum(
            prices
        )

    const volatility =
        calculateVolatility(
            prices
        )

    let direction =
        'SIDEWAYS'

    let confidence = 50

    if (momentum > 0.15) {

        direction = 'UP'

        confidence =
            50 +
            Math.min(
                momentum * 10,
                49
            )

    }

    else if (momentum < -0.15) {

        direction = 'DOWN'

        confidence =
            50 +
            Math.min(
                Math.abs(momentum) * 10,
                49
            )

    }

    predictions[symbol] = {

        symbol,

        direction,

        confidence:
            Number(
                confidence.toFixed(2)
            ),

        momentum,

        volatility,

        timestamp:
            new Date()
            .toISOString()

    }

    return predictions[symbol]

}

function getPrediction(
    symbol
) {

    return (
        predictions[symbol]
        || null
    )

}

function getAllPredictions() {

    return predictions

}

module.exports = {

    predictTrend,

    getPrediction,

    getAllPredictions,

    calculateMomentum,

    calculateVolatility

}