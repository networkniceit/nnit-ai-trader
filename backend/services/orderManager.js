const portfolio = require('./portfolio')
const tradeHistory = require('./tradeHistory')
const performanceEngine = require('./performanceEngine')
const logger = require('./logger')

async function buy(
    symbol,
    price,
    amount,
    reason = 'SIGNAL'
) {

    try {

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

                reason

            })

        logger.trade(

            `BUY ${symbol} x${amount} @ ${price}`

        )

        return trade

    }
    catch (err) {

        logger.error(

            `BUY ERROR: ${err.message}`

        )

        return false

    }

}

async function sell(
    symbol,
    price,
    amount,
    reason = 'SIGNAL'
) {

    try {

        const entryPrice =

            portfolio
            .getPortfolio()
            .entryPrices[symbol]
            || price

        const profit =

            (price - entryPrice)
            * amount

        const success =
            portfolio.sell(
                symbol,
                price,
                amount
            )

        if (!success) {

            return false

        }

        performanceEngine
            .recordTrade(
                profit
            )

        const trade =

            tradeHistory.recordTrade({

                side: 'SELL',

                symbol,

                quantity: amount,

                entryPrice,

                exitPrice: price,

                profit,

                reason

            })

        logger.trade(

            `SELL ${symbol} x${amount} @ ${price} PNL=${profit.toFixed(2)}`

        )

        return trade

    }
    catch (err) {

        logger.error(

            `SELL ERROR: ${err.message}`

        )

        return false

    }

}

module.exports = {

    buy,

    sell

}