const signalEngine = require('./signalEngine')
const trendAnalyzer = require('./trendAnalyzer')
const aiEngine = require('./aiEngine')

function runBacktest(prices = []) {

    if (
        !Array.isArray(prices) ||
        prices.length < 20
    ) {

        return {

            trades: [],

            totalTrades: 0,

            wins: 0,

            losses: 0,

            winRate: 0,

            profit: 0

        }

    }

    const trades = []

    let position = null

    let totalProfit = 0
    let wins = 0
    let losses = 0

    const history = []

    for (
        let i = 0;
        i < prices.length;
        i++
    ) {

        const price =
            Number(prices[i])

        history.push(price)

        if (
            history.length > 20
        ) {

            history.shift()

        }

        if (
            history.length < 3
        ) {

            continue

        }

        const trend =
            trendAnalyzer(history)

        const aiSignal =
            aiEngine(trend)

        const signal =
            signalEngine(
                price,
                history[history.length - 2],
                'BACKTEST',
                history
            )

        const finalSignal =
            aiSignal === signal
                ? signal
                : 'HOLD'

        // BUY

        if (
            finalSignal === 'BUY' &&
            !position
        ) {

            position = {

                entryPrice: price,

                entryIndex: i

            }

        }

        // SELL

        if (
            finalSignal === 'SELL' &&
            position
        ) {

            const profit =
                price -
                position.entryPrice

            totalProfit +=
                profit

            if (profit > 0) {

                wins++

            }
            else {

                losses++

            }

            trades.push({

                buy:
                    position.entryPrice,

                sell: price,

                profit,

                buyIndex:
                    position.entryIndex,

                sellIndex: i

            })

            position = null

        }

    }

    const totalTrades =
        trades.length

    const winRate =
        totalTrades > 0
            ? Number(
                (
                    wins /
                    totalTrades *
                    100
                ).toFixed(2)
            )
            : 0

    return {

        trades,

        totalTrades,

        wins,

        losses,

        winRate,

        profit: Number(
            totalProfit.toFixed(2)
        )

    }

}

module.exports = runBacktest


