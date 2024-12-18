import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import httpError from '../util/httpError'
import config from '../config/config'

interface CustomRequest extends Request {
    userId?: string
}

interface TokenCookies {
    token: string | undefined
}

export const verifyToken = (req: CustomRequest, _: Response, next: NextFunction) => {
    const cookies = req.cookies as TokenCookies

    if (!cookies || !cookies.token) {
        return httpError(next, new Error('Please login to access this resource'), req, 401)
    }

    const token = cookies.token

    if (typeof token !== 'string') {
        return httpError(next, new Error('Login session is invalid'), req, 401)
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET as string) as { userId: string }

        if (!decoded) {
            return httpError(next, new Error('Login session has expired'), req, 401)
        }

        req.userId = decoded.userId
        next()
    } catch (error) {
        return httpError(next, error, req, 401)
    }
}
