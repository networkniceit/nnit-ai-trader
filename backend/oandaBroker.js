const axios = require('axios')

class OandaBroker {

    constructor() {
        this.token = process.env.OANDA_API_KEY
        this.account = process.env.OANDA_ACCOUNT_ID
    }

    async getPrice(pair){

        const response = await axios.get(
        `https://api-fxpractice.oanda.com/v3/accounts/${this.account}/pricing`,
        {
            headers:{
                Authorization:`Bearer ${this.token}`
            },
            params:{
                instruments:pair
            }
        })

        return response.data
    }
}

module.exports = new OandaBroker()