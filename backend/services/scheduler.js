const cron = require('node-cron')
const tradeEngine = require('./tradeEngine')

function startScheduler(){

    cron.schedule('*/15 * * * * *', async ()=>{

        console.log("🔄 SCANNING MARKET...")
        await tradeEngine()

    })

}

module.exports = startScheduler