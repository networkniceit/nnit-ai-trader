const portfolio = require('./portfolio')
const tradeHistory = require('./tradeHistory')
const logger = require('./logger')

async function paperBuy(
    symbol,
    price,
    amount = 1
) {

    const success =
        portfolio.buy(
            symbol,
            price
        )

    if (!success) {

        return false

    }

    const trade =
        tradeHistory.recordTrade({

            side: 'BUY',

            symbol,

            quantity: amount,

            entryPrice: price,

            reason: 'PAPER_TRADE'

        })

    logger.trade(

        `PAPER BUY ${symbol} x${amount} @ ${price}`

    )

    return trade

}

module.exports = {

    paperBuy

}