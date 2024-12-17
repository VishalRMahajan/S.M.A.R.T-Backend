import { Request, Response } from 'express'
import { THTTPResposne } from '../types/types'

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export default (req: Request, res: Response, responseStatusCode: number, responseMessage: string, data: unknown | null): void => {
    const response: THTTPResposne = {
        success: true,
        statusCode: responseStatusCode,
        timeStamp: new Date().toISOString(),
        request: {
            method: req.method,
            url: req.originalUrl
        },
        message: responseMessage,
        data: data
    }

    res.status(responseStatusCode).json(response)
}
