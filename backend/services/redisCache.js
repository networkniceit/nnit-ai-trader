const redis = require('redis')

let client = null
let connected = false

async function connectRedis() {

    try {

        if (client && connected) {

            return client

        }

        client = redis.createClient({

            url:
                process.env.REDIS_URL ||
                'redis://127.0.0.1:6379'

        })

        client.on(
            'error',
            err => {

                console.error(
                    'REDIS ERROR:',
                    err.message
                )

                connected = false

            }
        )

        client.on(
            'connect',
            () => {

                console.log(
                    'REDIS CONNECTED'
                )

                connected = true

            }
        )

        await client.connect()

        return client

    }
    catch (err) {

        console.error(
            'REDIS CONNECTION FAILED:',
            err.message
        )

        connected = false

        return null

    }

}

async function setCache(
    key,
    value,
    ttl = 60
) {

    try {

        if (!client || !connected) {

            await connectRedis()

        }

        if (!client) {

            return false

        }

        await client.set(

            key,

            JSON.stringify(value),

            {

                EX: ttl

            }

        )

        return true

    }
    catch (err) {

        console.error(
            'SET CACHE ERROR:',
            err.message
        )

        return false

    }

}

async function getCache(
    key
) {

    try {

        if (!client || !connected) {

            await connectRedis()

        }

        if (!client) {

            return null

        }

        const value =
            await client.get(
                key
            )

        return value
            ? JSON.parse(value)
            : null

    }
    catch (err) {

        console.error(
            'GET CACHE ERROR:',
            err.message
        )

        return null

    }

}

async function deleteCache(
    key
) {

    try {

        if (!client || !connected) {

            await connectRedis()

        }

        if (!client) {

            return false

        }

        await client.del(
            key
        )

        return true

    }
    catch (err) {

        console.error(
            'DELETE CACHE ERROR:',
            err.message
        )

        return false

    }

}

function isConnected() {

    return connected

}

module.exports = {

    connectRedis,

    setCache,

    getCache,

    deleteCache,

    isConnected

}