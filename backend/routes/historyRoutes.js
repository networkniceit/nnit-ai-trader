const express = require('express')

const router = express.Router()

const history = require('../database/tradeHistory')

router.get('/',(req,res)=>{

    res.json(history.getTrades())

})

module.exports = router