const portfolioManager = require('../services/portfolioManager')

exports.status = async (req,res)=>{

    res.json({

        bot:"running",

        balance: portfolioManager.getBalance()

    })

}