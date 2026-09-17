const { Pool } = require('pg')

let pool = null

function connectDatabase() {

    if (pool) {

        return pool

    }

    pool = new Pool({

        host:
            process.env.DB_HOST
            || 'localhost',

        port:
            process.env.DB_PORT
            || 5432,

        user:
            process.env.DB_USER
            || 'postgres',

        password:
            process.env.DB_PASSWORD
            || '',

        database:
            process.env.DB_NAME
            || 'nnit_ai_trader'

    })

    pool.on(

        'error',

        err => {

            console.error(

                'DATABASE ERROR:',

                err.message

            )

        }

    )

    console.log(

        'DATABASE POOL READY'

    )

    return pool

}

async function query(
    sql,
    params = []
) {

    try {

        const db =
            connectDatabase()

        return await db.query(
            sql,
            params
        )

    }
    catch (err) {

        console.error(

            'QUERY ERROR:',

            err.message

        )

        throw err

    }

}

async function closeDatabase() {

    if (pool) {

        await pool.end()

        pool = null

    }

}

module.exports = {

    connectDatabase,

    query,

    closeDatabase

}