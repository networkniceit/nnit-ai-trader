'use strict';
const fs = require('node:fs');
const path = require('node:path');
const directory = path.resolve(process.env.NNIT_TRADER_DATA_DIR || path.join(__dirname, '..', 'logs'));
const filename = path.join(directory, 'portfolio.json');
function validate(state) {
  if (!state || typeof state !== 'object' || !Number.isFinite(state.cash) || state.cash < 0 || !Number.isFinite(state.pnl)) throw new Error('Invalid saved NNIT paper portfolio');
  for (const name of ['holdings', 'entryPrices']) {
    if (!state[name] || typeof state[name] !== 'object' || Array.isArray(state[name])) throw new Error('Invalid saved NNIT paper positions');
    for (const [symbol, value] of Object.entries(state[name])) {
      if (['__proto__', 'constructor', 'prototype'].includes(symbol) || !Number.isFinite(value) || value <= 0) throw new Error('Invalid saved NNIT paper position');
    }
  }
  for (const symbol of Object.keys(state.holdings)) if (!Object.hasOwn(state.entryPrices, symbol)) throw new Error('Saved NNIT entry price missing');
  return { cash: state.cash, holdings: { ...state.holdings }, entryPrices: { ...state.entryPrices }, pnl: state.pnl };
}
function save(state) {
  const checked = validate(state);
  fs.mkdirSync(directory, { recursive: true });
  const temporary = filename + '.tmp-' + process.pid;
  let fd;
  try {
    fd = fs.openSync(temporary, 'w', 0o600);
    fs.writeFileSync(fd, JSON.stringify(checked) + '\n');
    fs.fsyncSync(fd); fs.closeSync(fd); fd = undefined;
    fs.renameSync(temporary, filename);
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
    try { fs.unlinkSync(temporary); } catch (e) { if (e.code !== 'ENOENT') throw e; }
  }
  return checked;
}
function load(fallback) {
  try { return validate(JSON.parse(fs.readFileSync(filename, 'utf8').replace(/^\uFEFF/, ''))); }
  catch (e) { if (e.code !== 'ENOENT') throw e; }
  const seed = process.env.NNIT_TRADER_PORTFOLIO_SEED_B64;
  return save(seed ? JSON.parse(Buffer.from(seed, 'base64').toString('utf8')) : fallback);
}
module.exports = { directory, load, save };
