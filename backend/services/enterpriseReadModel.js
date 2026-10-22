'use strict';
const fs = require('node:fs');
const path = require('node:path');
const recent = require('./tradeHistory');
const legacy = require('../database/tradeHistory');
const filename = path.join(require('./nnitPaperState').directory, 'trades.log');
function getTrades({ disk = fs, file = filename } = {}) {
  const collected = [];
  // Read a bounded tail without changing or truncating the original log.
  try {
    const fd = disk.openSync(file, 'r');
    try {
      const size = disk.fstatSync(fd).size;
      const start = Math.max(0, size - 4 * 1024 * 1024);
      const buffer = Buffer.alloc(size - start);
      const count = disk.readSync(fd, buffer, 0, buffer.length, start);
      let lines = buffer.subarray(0, count).toString('utf8').split(/\r?\n/);
      if (start) lines.shift();
      for (const line of lines) {
        if (!line.trim()) continue;
        try { const trade = JSON.parse(line); if (trade && typeof trade === 'object' && !Array.isArray(trade)) collected.push(trade); } catch {}
      }
    } finally { disk.closeSync(fd); }
  } catch (error) { if (error.code !== 'ENOENT') throw error; }
  collected.push(...legacy.getTrades(), ...recent.getTradeHistory());
  const distinct = new Map();
  for (const trade of collected) {
    const key = trade.id != null ? String(trade.id) : JSON.stringify([trade.timestamp, trade.side, trade.symbol, trade.quantity, trade.entryPrice, trade.exitPrice, trade.profit]);
    distinct.set(key, trade);
  }
  return [...distinct.values()].sort((a, b) => (Date.parse(b.timestamp) || 0) - (Date.parse(a.timestamp) || 0)).slice(0, 500);
}
function getPerformance(trades = getTrades()) {
  const sells = trades.filter(trade => String(trade.side).toUpperCase() === 'SELL' && trade.profit !== null && trade.profit !== '' && Number.isFinite(Number(trade.profit)));
  const wins = sells.filter(t => Number(t.profit) > 0), losses = sells.filter(t => Number(t.profit) < 0);
  const sum = list => list.reduce((total, t) => total + Number(t.profit), 0);
  const totalProfit = sum(wins), totalLoss = -sum(losses);
  return { totalTrades: sells.length, wins: wins.length, losses: losses.length,
    winRate: sells.length ? wins.length / sells.length * 100 : null,
    totalProfit, totalLoss, netProfit: totalProfit - totalLoss,
    averageWin: wins.length ? totalProfit / wins.length : null,
    averageLoss: losses.length ? totalLoss / losses.length : null,
    biggestWin: wins.length ? Math.max(...wins.map(t => Number(t.profit))) : null,
    biggestLoss: losses.length ? Math.max(...losses.map(t => -Number(t.profit))) : null,
    profitFactor: totalLoss > 0 ? totalProfit / totalLoss : null,
    basis: 'Recorded SELL outcomes from the latest 500 retained trade records. Portfolio totals may cover a different period.' };
}
module.exports = { getTrades, getPerformance };
