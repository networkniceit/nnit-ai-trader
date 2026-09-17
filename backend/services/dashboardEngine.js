const portfolio = require('./portfolio')
const { calculatePortfolioValue } = require('./valuationEngine')
const { getPerformance } = require('./performanceEngine')
const { getIO } = require('./socketServer')
const scanner = require('./marketScanner')

let lastSnapshot = null

async function getMarketPrices() {

    try {

        const markets = await scanner()

        const prices = {}

        for (const m of markets) {

            if (m && m.symbol && m.price) {

                prices[m.symbol] = m.price

            }

        }

        return prices

    }
    catch (err) {

        return {}

    }

}

async function buildDashboard() {

    const currentPortfolio =
        portfolio.getPortfolio()

    const prices =
        await getMarketPrices()

    const valuation =
        calculatePortfolioValue(
            currentPortfolio,
            prices
        )

    const performance =
        getPerformance()

    const snapshot = {

        timestamp:
            new Date().toISOString(),

        portfolio: valuation,

        performance,

        prices

    }

    lastSnapshot = snapshot

    return snapshot

}

async function broadcastDashboard() {

    try {

        const io =
            getIO()

        if (!io) {

            return

        }

        const snapshot =
            await buildDashboard()

        io.emit(
            'dashboard',
            snapshot
        )

    }
    catch (err) {

        console.error(
            'DASHBOARD ERROR:',
            err.message
        )

    }

}

function getLastSnapshot() {

    return lastSnapshot

}

module.exports = {

    buildDashboard,

    broadcastDashboard,

    getLastSnapshot

}