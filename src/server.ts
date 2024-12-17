import app from './app'
import config from './config/config'
import { initRateLimiter } from './config/rateLimiter'
import databaseService from './service/databaseService'
import logger from './util/logger'

const server = app.listen(config.PORT)

// Immediately invoked function
// eslint-disable-next-line @typescript-eslint/no-floating-promises
;(async () => {
    try {
        const connection = await databaseService.connect()
        logger.info(`DATABASE_CONNECTION`, {
            meta: {
                CONNECTION_NAME: connection.name
            }
        })

        initRateLimiter(connection)

        logger.info(`APPLICATION_STARTED`, {
            meta: {
                port: config.PORT,
                SERVER_URL: config.SERVER_URL
            }
        })
    } catch (error) {
        logger.error(`APPLICATION_START_FAILED`, {
            meta: {
                error
            }
        })

        server.close((error) => {
            if (error) {
                logger.error(`APPLICATION_STOP_FAILED`, {
                    meta: {
                        error
                    }
                })
            }

            process.exit(1)
        })
    }
})()
