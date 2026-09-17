const fs = require('fs')
const path = require('path')

const TRADE_LOG_FILE =
    path.join(
        __dirname,
        '..',
        'logs',
        'trades.log'
    )

let tradeCounter = 1

const history = []

function generateTradeId() {

    return `TRADE-${Date.now()}-${tradeCounter++}`

}

function recordTrade({

    side,
    symbol,
    quantity,
    entryPrice,
    exitPrice = null,
    profit = 0,
    reason = 'UNKNOWN'

}) {

    const trade = {

        id:
            generateTradeId(),

        timestamp:
            new Date()
            .toISOString(),

        side,

        symbol,

        quantity:
            Number(quantity),

        entryPrice:
            Number(entryPrice),

        exitPrice,

        profit:
            Number(
                profit.toFixed(2)
            ),

        reason

    }

    history.push(
        trade
    )

    try {

        fs.appendFileSync(

            TRADE_LOG_FILE,

            JSON.stringify(
                trade
            ) + '\n'

        )

    }
    catch (err) {

        console.error(

            'TRADE LOG ERROR:',

            err.message

        )

    }

    return trade

}

function getTradeHistory() {

    return history

}

function getTradeById(id) {

    return history.find(

        trade =>

            trade.id === id

    )

}

function getTradesBySymbol(symbol) {

    return history.filter(

        trade =>

            trade.symbol === symbol

    )

}

function getTradesBySide(side) {

    return history.filter(

        trade =>

            trade.side === side

    )

}

function totalTrades() {

    return history.length

}

function clearHistory() {

    history.length = 0

}

module.exports = {

    recordTrade,

    getTradeHistory,

    getTradeById,

    getTradesBySymbol,

    getTradesBySide,

    totalTrades,

    clearHistory

}