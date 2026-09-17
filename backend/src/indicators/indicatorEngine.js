const ti = require("technicalindicators");

function calculateIndicators(candles = []) {
  const close = candles.map(c => c.close);
  const high = candles.map(c => c.high);
  const low = candles.map(c => c.low);
  const volume = candles.map(c => c.volume);

  return {
    rsi: ti.RSI.calculate({ values: close, period: 14 }).at(-1) || null,
    macd: ti.MACD.calculate({
      values: close,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      SimpleMAOscillator: false,
      SimpleMASignal: false
    }).at(-1) || null,
    ema20: ti.EMA.calculate({ values: close, period: 20 }).at(-1) || null,
    sma50: ti.SMA.calculate({ values: close, period: 50 }).at(-1) || null,
    bollinger: ti.BollingerBands.calculate({
      values: close,
      period: 20,
      stdDev: 2
    }).at(-1) || null,
    atr: ti.ATR.calculate({ high, low, close, period: 14 }).at(-1) || null,
    adx: ti.ADX.calculate({ high, low, close, period: 14 }).at(-1) || null,
    obv: ti.OBV.calculate({ close, volume }).at(-1) || null
  };
}

module.exports = { calculateIndicators };