import app from './app'
import config from './config/config'
import logger from './util/logger'

const server = app.listen(config.PORT)

// Immediately invoked function
;(() => {
    try {
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
