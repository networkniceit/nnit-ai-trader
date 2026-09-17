const winston = require('winston')
const fs = require('fs')
const path = require('path')

const logDir = path.join(__dirname, '..', 'logs')

if (!fs.existsSync(logDir)) {

    fs.mkdirSync(logDir, { recursive: true })

}

const logger = winston.createLogger({

    level: 'info',

    format: winston.format.combine(

        winston.format.timestamp(),

        winston.format.printf(({ timestamp, level, message }) => {

            return `${timestamp} [${level.toUpperCase()}] ${message}`

        })

    ),

    transports: [

        new winston.transports.File({

            filename: path.join(logDir, 'errors.log'),

            level: 'error'

        }),

        new winston.transports.File({

            filename: path.join(logDir, 'trades.log')

        }),

        new winston.transports.Console()

    ]

})

function info(message) {

    logger.info(message)

}

function error(message) {

    logger.error(message)

}

function warn(message) {

    logger.warn(message)

}

function trade(message) {

    logger.info(`TRADE: ${message}`)

}

module.exports = {

    info,

    error,

    warn,

    trade,

    logger

}