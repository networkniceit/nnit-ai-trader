const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function saveTrade(trade) {
  await pool.query(
    `INSERT INTO trades(symbol, side, price, amount, pnl, created_at)
     VALUES($1,$2,$3,$4,$5,NOW())`,
    [trade.symbol, trade.side, trade.price, trade.amount, trade.pnl || 0]
  );
}

async function getTrades() {
  const result = await pool.query(
    "SELECT * FROM trades ORDER BY created_at DESC LIMIT 200"
  );
  return result.rows;
}

module.exports = { pool, saveTrade, getTrades };