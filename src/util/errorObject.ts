import { Request } from 'express'
import { THTTPError } from '../types/types'
import responseMessage from '../constant/responseMessage'
import config from '../config/config'
import { EApplicationEnviornment } from '../constant/application'
import logger from './logger'

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export default (err: Error | unknown, req: Request, errorStatusCode: number = 500): THTTPError => {
    const errorObject: THTTPError = {
        success: false,
        statusCode: errorStatusCode,
        timeStamp: new Date().toISOString(),
        request: {
            method: req.method,
            url: req.originalUrl
        },
        message: err instanceof Error ? err.message || responseMessage.SOMETHING_WENT_WRONG : responseMessage.SOMETHING_WENT_WRONG,
        trace: err instanceof Error ? { error: err.stack } : null
    }

    logger.error(`CONTROLLER_ERROR`, {
        meta: {
            error: errorObject
        }
    })

    if (config.ENV === EApplicationEnviornment.PRODUCTION) {
        delete errorObject.trace
    }

    return errorObject
}
