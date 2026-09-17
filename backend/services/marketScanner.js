const axios = require('axios')

const symbols = [
    'BTC/USDT',
    'ETH/USDT',
    'SOL/USDT',
    'XRP/USDT',
    'ADA/USDT'
]

const request = axios.create({
    timeout: 10000,
    headers: {
        'User-Agent': 'NNIT-AI-Trader/1.0'
    }
})

async function fetchPrice(symbol) {
    const marketSymbol = symbol.replace('/', '')

    try {
        const response = await request.get(
            'https://api.binance.com/api/v3/ticker/price',
            { params: { symbol: marketSymbol } }
        )
        const price = Number(response.data.price)
        if (Number.isFinite(price)) return price
    }
    catch (error) {
        console.warn(`Binance price unavailable for ${symbol}: ${error.message}`)
    }

    const response = await request.get(
        `https://api.coinbase.com/v2/prices/${symbol.replace('/', '-')}/spot`
    )
    const price = Number(response.data?.data?.amount)
    if (!Number.isFinite(price)) {
        throw new Error('No valid public price returned')
    }

    return price
}

async function scanMarkets() {
    const results = await Promise.all(
        symbols.map(async (symbol) => {
            try {
                return { symbol, price: await fetchPrice(symbol) }
            }
            catch (error) {
                console.warn(`Market data unavailable for ${symbol}: ${error.message}`)
                return null
            }
        })
    )

    return results.filter(Boolean)
}
module.exports = scanMarkets