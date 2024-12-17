import app from './app'
import config from './config/config'

const server = app.listen(config.PORT)

// Immediately invoked function
;(() => {
    try {
        console.info(`APPLICATION_STARTED`, {
            meta: {
                port: config.PORT,
                SERVER_URL: config.SERVER_URL
            }
        })
    } catch (error) {
        console.error(`APPLICATION_START_FAILED`, {
            meta: {
                error
            }
        })

        server.close((error) => {
            if (error) {
                console.error(`APPLICATION_STOP_FAILED`, {
                    meta: {
                        error
                    }
                })
            }

            process.exit(1)
        })
    }
})()
