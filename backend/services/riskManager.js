const portfolio = require('./portfolio')

const config = {
    maxTradeRiskPercent: 2,
    maxDailyLossPercent: 5,
    stopLossPercent: 2,
    takeProfitPercent: 4
}

let dailyLoss = 0
let lastTradeTime = 0

function canTrade(){

    const now = Date.now()

    // cooldown (10 seconds)
    if(now - lastTradeTime < 10000){
        return false
    }

    lastTradeTime = now

    const balance = portfolio.getPortfolio().cash

    if(dailyLoss >= (balance * config.maxDailyLossPercent / 100)){
        console.log("⛔ DAILY LOSS LIMIT HIT")
        return false
    }

    return true
}

function updateLoss(amount){
    dailyLoss += amount
}

function getConfig(){
    return config
}

module.exports = {
    config,
    canTrade,
    updateLoss,
    getConfig
}