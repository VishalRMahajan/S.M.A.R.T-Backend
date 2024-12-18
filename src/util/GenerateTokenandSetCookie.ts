import { Response } from 'express'
import * as jwt from 'jsonwebtoken'
import config from '../config/config'

export const GenerateTokenandSetCookie = (res: Response, userId: string) => {
    if (!config.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in the configuration')
    }
    const token = jwt.sign({ userId }, config.JWT_SECRET, { expiresIn: '7d' })

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return token
}
