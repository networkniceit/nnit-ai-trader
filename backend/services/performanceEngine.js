let stats = {

    totalTrades: 0,

    wins: 0,

    losses: 0,

    totalProfit: 0,

    totalLoss: 0,

    biggestWin: 0,

    biggestLoss: 0
}

function recordTrade(profit) {

    stats.totalTrades++

    if (profit > 0) {

        stats.wins++

        stats.totalProfit += profit

        if (profit > stats.biggestWin) {

            stats.biggestWin = profit

        }

    }
    else if (profit < 0) {

        stats.losses++

        stats.totalLoss += Math.abs(profit)

        if (
            Math.abs(profit) >
            stats.biggestLoss
        ) {

            stats.biggestLoss =
                Math.abs(profit)

        }

    }

}

function getPerformance() {

    const totalTrades =
        stats.totalTrades

    const winRate =
        totalTrades > 0
            ? Number(
                (
                    stats.wins /
                    totalTrades *
                    100
                ).toFixed(2)
            )
            : 0

    const averageWin =
        stats.wins > 0
            ? Number(
                (
                    stats.totalProfit /
                    stats.wins
                ).toFixed(2)
            )
            : 0

    const averageLoss =
        stats.losses > 0
            ? Number(
                (
                    stats.totalLoss /
                    stats.losses
                ).toFixed(2)
            )
            : 0

    const profitFactor =
        stats.totalLoss > 0
            ? Number(
                (
                    stats.totalProfit /
                    stats.totalLoss
                ).toFixed(2)
            )
            : 0

    return {

        totalTrades,

        wins: stats.wins,

        losses: stats.losses,

        winRate,

        totalProfit:
            Number(
                stats.totalProfit.toFixed(2)
            ),

        totalLoss:
            Number(
                stats.totalLoss.toFixed(2)
            ),

        averageWin,

        averageLoss,

        biggestWin:
            Number(
                stats.biggestWin.toFixed(2)
            ),

        biggestLoss:
            Number(
                stats.biggestLoss.toFixed(2)
            ),

        profitFactor

    }

}

function resetPerformance() {

    stats = {

        totalTrades: 0,

        wins: 0,

        losses: 0,

        totalProfit: 0,

        totalLoss: 0,

        biggestWin: 0,

        biggestLoss: 0
    }

}

module.exports = {

    recordTrade,

    getPerformance,

    resetPerformance

}