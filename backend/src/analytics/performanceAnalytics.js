function calculateAnalytics(trades = []) {
  const wins = trades.filter(t => Number(t.pnl) > 0);
  const losses = trades.filter(t => Number(t.pnl) < 0);

  const totalProfit = wins.reduce((s, t) => s + Number(t.pnl), 0);
  const totalLoss = Math.abs(losses.reduce((s, t) => s + Number(t.pnl), 0));

  return {
    totalTrades: trades.length,
    wins: wins.length,
    losses: losses.length,
    winRate: trades.length ? (wins.length / trades.length) * 100 : 0,
    profitFactor: totalLoss ? totalProfit / totalLoss : totalProfit,
    netPnl: trades.reduce((s, t) => s + Number(t.pnl || 0), 0),
    averagePnl: trades.length
      ? trades.reduce((s, t) => s + Number(t.pnl || 0), 0) / trades.length
      : 0
  };
}

module.exports = { calculateAnalytics };