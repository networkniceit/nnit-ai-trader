let stats = {
    totalTrades: 0,
    wins: 0,
    losses: 0,
    totalProfit: 0,
    totalLoss: 0
}

function recordTrade(profit) {

    stats.totalTrades++

    if (profit > 0) {
        stats.wins++
        stats.totalProfit += profit
    }

    if (profit < 0) {
        stats.losses++
        stats.totalLoss += Math.abs(profit)
    }
}

function getPerformance() {

    const winRate =
        stats.totalTrades > 0
            ? (
                stats.wins /
                stats.totalTrades
              ) * 100
            : 0

    return {
        ...stats,
        winRate:
            Number(winRate.toFixed(2))
    }
}

function resetPerformance() {

    stats = {
        totalTrades: 0,
        wins: 0,
        losses: 0,
        totalProfit: 0,
        totalLoss: 0
    }
}

module.exports = {
    recordTrade,
    getPerformance,
    resetPerformance
}