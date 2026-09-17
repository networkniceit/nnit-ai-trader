function strategyEngine({ trend, indicators, price }) {
  let score = 0;
  const reasons = [];

  if (trend === "UP") {
    score += 2;
    reasons.push("Trend bullish");
  }

  if (trend === "DOWN") {
    score -= 2;
    reasons.push("Trend bearish");
  }

  if (indicators.rsi && indicators.rsi < 30) {
    score += 2;
    reasons.push("RSI oversold");
  }

  if (indicators.rsi && indicators.rsi > 70) {
    score -= 2;
    reasons.push("RSI overbought");
  }

  if (indicators.macd?.MACD > indicators.macd?.signal) {
    score += 2;
    reasons.push("MACD bullish");
  }

  if (indicators.macd?.MACD < indicators.macd?.signal) {
    score -= 2;
    reasons.push("MACD bearish");
  }

  if (indicators.ema20 && indicators.sma50 && indicators.ema20 > indicators.sma50) {
    score += 1;
    reasons.push("EMA above SMA");
  }

  if (indicators.ema20 && indicators.sma50 && indicators.ema20 < indicators.sma50) {
    score -= 1;
    reasons.push("EMA below SMA");
  }

  let signal = "HOLD";
  if (score >= 4) signal = "BUY";
  if (score <= -4) signal = "SELL";

  return {
    signal,
    score,
    confidence: Math.min(Math.abs(score) * 15, 95),
    reasons,
    price
  };
}

module.exports = { strategyEngine };