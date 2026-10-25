const scanner = require('./marketScanner')
const signalEngine = require('./signalEngine')
const portfolio = require('./portfolio')
const risk = require('./riskManager')

const trendAnalyzer = require('./trendAnalyzer')
const aiEngine = require('./aiEngine')
const stopLossManager = require('./stopLossManager')
const takeProfitManager = require('./takeProfitManager')
const telegramNotifier = require('./telegramNotifier')
const socket = require('./socketServer')
const tradeHistory = require('./tradeHistory')

let priceHistory = {}
let lastTrade = {}

const TRADE_COOLDOWN_MS = 30000

function canTradeSymbol(symbol) {

    const now = Date.now()

    if (!lastTrade[symbol]) {
        return true
    }

    return (
        now - lastTrade[symbol]
    ) >= TRADE_COOLDOWN_MS

}

function recordTrade(symbol) {

    lastTrade[symbol] = Date.now()

}

async function runTradeEngine() {

    try {

        console.log('🔄 SCANNING MARKET...')

        const markets = await scanner()

        if (
            !Array.isArray(markets) ||
            markets.length === 0
        ) {

            console.log(
                'No market data received'
            )

            return

        }

        for (const market of markets) {

            try {

                if (
                    !market ||
                    !market.symbol ||
                    !market.price
                ) {

                    continue

                }

                const symbol =
                    market.symbol

                const price =
                    Number(market.price)

                if (
                    !Number.isFinite(price) || price <= 0
                ) {

                    continue

                }

                // PRICE HISTORY

                if (!priceHistory[symbol]) {

                    priceHistory[symbol] = []

                }

                priceHistory[symbol].push(
                    price
                )

                if (
                    priceHistory[symbol]
                        .length > 20
                ) {

                    priceHistory[symbol]
                        .shift()

                }

                const prices =
                    priceHistory[symbol]

                const previousPrice =
                    prices.length > 1
                        ? prices[prices.length - 2]
                        : price

                const trend =
                    trendAnalyzer(
                        prices
                    )

                const aiSignal =
                    aiEngine(
                        trend
                    )

                const signal =
                    signalEngine(
                        price,
                        previousPrice,
                        symbol,
                        prices
                    )

                const finalSignal =
                    aiSignal === signal
                        ? signal
                        : 'HOLD'

                console.log(
                    `${symbol} ${price} ${finalSignal} ${trend.trend}`
                )

                socket.emitSignal({

                    symbol,

                    signal:
                        finalSignal,

                    aiSignal,

                    trend:
                        trend.trend,

                    strength:
                        trend.strength,

                    price,

                    timestamp:
                        Date.now()

                })

                if (
                    !canTradeSymbol(
                        symbol
                    )
                ) {

                    continue

                }

                const state =
                    structuredClone(portfolio.getPortfolio())

                const entryPrice =
                    state.entryPrices[
                        symbol
                    ]

                // STOP LOSS

                const stopReason = state.holdings[symbol]
                    ? stopLossManager(symbol, price) : false
                if (stopReason) {

                    const sold =
                        portfolio.sell(
                            symbol,
                            price
                        )

                    if (sold) {

                        stopLossManager.resetPosition(symbol)

                        recordTrade(
                            symbol
                        )

                        telegramNotifier(
                            `${stopReason} ${symbol}`
                        )

                        tradeHistory.recordTrade({

                            side: 'SELL',

                            symbol,

                            quantity:
                                state.holdings[
                                    symbol
                                ],

                            entryPrice,

                            exitPrice:
                                price,

                            profit:
                                (
                                    price -
                                    entryPrice
                                ) *
                                state.holdings[
                                    symbol
                                ],

                            reason:
                                stopReason

                        })

                        socket.emitTrade({

                            symbol,

                            type:
                                stopReason,

                            price,

                            timestamp:
                                Date.now()

                        })

                    }

                    continue

                }

                // TAKE PROFIT

                if (
                    state.holdings[
                        symbol
                    ] &&
                    entryPrice &&
                    takeProfitManager(
                        entryPrice,
                        price
                    )
                ) {

                    const sold =
                        portfolio.sell(
                            symbol,
                            price
                        )

                    if (sold) {

                        stopLossManager.resetPosition(symbol)

                        recordTrade(
                            symbol
                        )

                        telegramNotifier(
                            `TAKE PROFIT ${symbol}`
                        )

                        tradeHistory.recordTrade({

                            side: 'SELL',

                            symbol,

                            quantity:
                                state.holdings[
                                    symbol
                                ],

                            entryPrice,

                            exitPrice:
                                price,

                            profit:
                                (
                                    price -
                                    entryPrice
                                ) *
                                state.holdings[
                                    symbol
                                ],

                            reason:
                                'TAKE_PROFIT'

                        })

                        socket.emitTrade({

                            symbol,

                            type:
                                'TAKE_PROFIT',

                            price,

                            timestamp:
                                Date.now()

                        })

                    }

                    continue

                }

                // BUY

                if (
                    finalSignal ===
                        'BUY' &&
                    risk.canTrade() &&
                    portfolio.canOpenNewTrade() &&
                    !state.holdings[
                        symbol
                    ]
                ) {

                    const bought =
                        portfolio.buy(
                            symbol,
                            price
                        )

                    if (bought) {

                        stopLossManager.resetPosition(symbol, price)

                        recordTrade(
                            symbol
                        )

                        telegramNotifier(
                            `BUY ${symbol}`
                        )

                        tradeHistory.recordTrade({

                            side: 'BUY',

                            symbol,

                            quantity: portfolio.getPortfolio().holdings[symbol] - (state.holdings[symbol] || 0),

                            entryPrice:
                                price,

                            reason:
                                'AI_SIGNAL'

                        })

                        socket.emitTrade({

                            symbol,

                            type: 'BUY',

                            price,

                            timestamp:
                                Date.now()

                        })

                        console.log(
                            `BUY EXECUTED ${symbol}`
                        )

                    }

                }

                // SELL

                if (
                    finalSignal ===
                        'SELL' &&
                    state.holdings[
                        symbol
                    ]
                ) {

                    const sold =
                        portfolio.sell(
                            symbol,
                            price
                        )

                    if (sold) {

                        stopLossManager.resetPosition(symbol)

                        recordTrade(
                            symbol
                        )

                        telegramNotifier(
                            `SELL ${symbol}`
                        )

                        tradeHistory.recordTrade({

                            side: 'SELL',

                            symbol,

                            quantity:
                                state.holdings[
                                    symbol
                                ],

                            entryPrice,

                            exitPrice:
                                price,

                            profit:
                                (
                                    price -
                                    entryPrice
                                ) *
                                state.holdings[
                                    symbol
                                ],

                            reason:
                                'AI_SIGNAL'

                        })

                        socket.emitTrade({

                            symbol,

                            type: 'SELL',

                            price,

                            timestamp:
                                Date.now()

                        })

                        console.log(
                            `SELL EXECUTED ${symbol}`
                        )

                    }

                }

                socket.emitMarket({

                    symbol,

                    price,

                    signal:
                        finalSignal,

                    trend:
                        trend.trend,

                    timestamp:
                        Date.now()

                })

            }
            catch (marketError) {

                console.error(

                    `MARKET ERROR ${market?.symbol}:`,

                    marketError.message

                )

            }

        }

        const updatedPortfolio =
            portfolio.getPortfolio()

        socket.emitPortfolio(
            updatedPortfolio
        )

        console.log(
            'PORTFOLIO:',
            updatedPortfolio
        )

    }
    catch (err) {

        console.error(
            'Trade Engine Error:',
            err.message
        )

    }

}

let scanInProgress = false
async function tradeEngine() {
    if (scanInProgress) return
    scanInProgress = true
    try { return await runTradeEngine() }
    finally { scanInProgress = false }
}
module.exports = tradeEngine




