const { Server } = require('socket.io')

let io = null

const lastEmitCache = {
    portfolio: 0,
    trade: 0,
    signal: 0,
    prediction: 0,
    market: 0
}

const EMIT_THROTTLE_MS = 300

function initializeSocket(server) {

    if (io) return io

    io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    })

    io.on('connection', socket => {

        console.log(`SOCKET CONNECTED: ${socket.id}`)

        socket.join('main')

        socket.on('ping', () => {
            socket.emit('pong', Date.now())
        })

        socket.on('disconnect', () => {
            console.log(`SOCKET DISCONNECTED: ${socket.id}`)
        })
    })

    console.log('SOCKET SERVER READY')

    return io
}

function safeEmit(event, data) {

    if (!io) return

    const now = Date.now()

    if (now - (lastEmitCache[event] || 0) < EMIT_THROTTLE_MS) {
        return
    }

    lastEmitCache[event] = now

    io.to('main').emit(event, {
        event,
        timestamp: now,
        data
    })
}

function emitPortfolio(portfolio) {
    safeEmit('portfolio', portfolio)
}

function emitTrade(trade) {
    safeEmit('trade', trade)
}

function emitSignal(signal) {
    safeEmit('signal', signal)
}

function emitPrediction(prediction) {
    safeEmit('prediction', prediction)
}

function emitMarket(market) {
    safeEmit('market', market)
}

function getIO() {
    return io
}

module.exports = {
    initializeSocket,
    emitPortfolio,
    emitTrade,
    emitSignal,
    emitPrediction,
    emitMarket,
    getIO
}