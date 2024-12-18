import nodemailer from 'nodemailer'
import config from './config'

const email: string = config.EMAIL || ''
const appPassword: string = config.APP_PASSWORD || ''

export const transporter: nodemailer.Transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: email,
        pass: appPassword
    }
})
