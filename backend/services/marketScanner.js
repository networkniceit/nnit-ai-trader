const exchange = require('../cryptoBroker')

const symbols = [
    'BTC/USDT',
    'ETH/USDT',
    'SOL/USDT',
    'XRP/USDT',
    'ADA/USDT'
]

async function scanMarkets(){

    const results = []

    for(let symbol of symbols){

        try{

            const ticker = await exchange.fetchTicker(symbol)

            results.push({
                symbol,
                price: ticker.last
            })

        }catch(e){
            console.log("Error:", symbol)
        }
    }

    return results
}

module.exports = scanMarkets