const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
require('dotenv').config()

const startScheduler = require('./services/scheduler')
const tradeRoutes = require('./routes/tradeRoutes')
const historyRoutes = require('./routes/historyRoutes')

const app = express()

const PORT = process.env.PORT || 5000

const systemRoutes =
    require('./routes/systemRoutes')

app.use(
    '/system',
    systemRoutes
)

app.use(cors())
app.use(express.json())

const frontendCandidates = [
    path.join(__dirname, 'dashboard', 'dist'),
    path.join(__dirname, '..', 'dashboard', 'dist')
]
const frontendPath = frontendCandidates.find(candidate => fs.existsSync(candidate))
const frontendIndex = frontendPath
    ? path.join(frontendPath, 'index.html')
    : null
if (frontendPath) {
    app.use(express.static(frontendPath))
}

// Routes
app.use('/trade', tradeRoutes)
app.use('/history', historyRoutes)

// Root
app.get('/', (req, res) => {

    if (frontendIndex && fs.existsSync(frontendIndex)) {
        return res.sendFile(frontendIndex)
    }

    res.json({

        app: 'NNIT AI TRADER',

        status: 'RUNNING',

        version: '1.0.0',

        environment:
            process.env.NODE_ENV
            || 'development',

        timestamp:
            new Date().toISOString()

    })

})

// Health Check
app.get('/status', (req, res) => {

    res.json({

        status: 'ONLINE',

        uptime:
            process.uptime(),

        memory:
            process.memoryUsage(),

        node:
            process.version,

        timestamp:
            new Date().toISOString()

    })

})

// Portfolio API
app.get('/api/portfolio', (req, res) => {

    try {

        const portfolio =
            require('./services/portfolio')

        res.json(

            portfolio.getPortfolio()

        )

    }
    catch (err) {

        res.status(500).json({

            error:
                err.message

        })

    }

})

// API Info
app.get('/api', (req, res) => {

    res.json({

        name:
            'NNIT AI TRADER API',

        version:
            '1.0.0',

        endpoints: [

            '/',

            '/status',

            '/api',

            '/api/portfolio',

            '/trade',

            '/history'

        ]

    })

})

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    })
})

// 404 Handler
app.use((req, res) => {

    res.status(404).json({

        error: 'Route Not Found',

        path: req.originalUrl

    })

})

// Start Server
app.listen(PORT, () => {

    console.log(
        `Server Running On ${PORT}`
    )

    startScheduler()

})