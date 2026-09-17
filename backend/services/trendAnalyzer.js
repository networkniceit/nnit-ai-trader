function trendAnalyzer(prices = []) {

    if (!Array.isArray(prices)) {

        return {
            trend: 'SIDEWAYS',
            strength: 0,
            change: 0
        }

    }

    if (prices.length < 3) {

        return {
            trend: 'SIDEWAYS',
            strength: 0,
            change: 0
        }

    }

    const first = Number(prices[0])
    const last = Number(
        prices[prices.length - 1]
    )

    if (
        !Number.isFinite(first) ||
        !Number.isFinite(last) ||
        first === 0
    ) {

        return {
            trend: 'SIDEWAYS',
            strength: 0,
            change: 0
        }

    }

    const change =
        ((last - first) / first) * 100

    const strength =
        Number(
            Math.abs(change).toFixed(4)
        )

    let trend = 'SIDEWAYS'

    if (change <= -0.15) {

        trend = 'DOWN'

    }
    else if (change >= 0.15) {

        trend = 'UP'

    }

    return {

        trend,

        strength,

        change: Number(
            change.toFixed(4)
        )

    }

}

module.exports = trendAnalyzer