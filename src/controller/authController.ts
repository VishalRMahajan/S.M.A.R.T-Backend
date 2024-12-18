import * as bcrypt from 'bcryptjs'
import * as crypto from 'crypto'

import { NextFunction, Request, Response } from 'express'
import { User } from '../model/userModel'

import httpError from '../util/httpError'
import httpResponse from '../util/httpResponse'
import { GenerateTokenandSetCookie } from '../util/GenerateTokenandSetCookie'
import { body, validationResult } from 'express-validator'
import { SendVerificationEmail } from '../service/Email/SendVerificationEmail'
import { SendFogotPasswordEmail } from '../service/Email/SendForgotPasswordEmail'
import config from '../config/config'
import { SendResetSuccessEmail } from '../service/Email/SendResetSuccessEmail'

interface CustomRequest extends Request {
    userId?: string
}

export default {
    signup: [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),

        async (req: Request, res: Response, next: NextFunction) => {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                const errorMessages = errors
                    .array()
                    .map((error: { msg: string }) => error.msg)
                    .join(', ')
                return httpError(next, new Error(errorMessages), req, 400)
            }

            const { name, email, password }: { name: string; email: string; password: string } = req.body as {
                name: string
                email: string
                password: string
            }

            try {
                const userAlreadyExists = await User.findOne({ email })

                if (userAlreadyExists) {
                    return httpError(next, new Error('User already exists'), req, 409)
                }

                const hashedPassword = await bcrypt.hash(password, 10)

                const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()

                const user = new User({
                    name,
                    email,
                    password: hashedPassword,
                    verificationToken,
                    verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
                })

                await user.save()

                GenerateTokenandSetCookie(res, user._id.toString())
                await SendVerificationEmail(user.name, user.email, user.verificationToken as string)

                const data = {
                    user: {
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        isVerified: user.isVerified
                    }
                }

                httpResponse(req, res, 201, 'User created successfully', data)
            } catch (error) {
                httpError(next, error, req, 500)
            }
        }
    ],
    verifyemail: async (req: Request, res: Response, next: NextFunction) => {
        const { email, verificationToken }: { email: string; verificationToken: string } = req.body as { email: string; verificationToken: string }

        if (!verificationToken) {
            return httpError(next, new Error('Verification token is required'), req, 400)
        }

        try {
            const user = await User.findOne({ email })
            if (!user) {
                return httpError(next, new Error('User not found'), req, 404)
            }

            if (user.isVerified) {
                return httpError(next, new Error('Email already verified'), req, 400)
            }

            if (
                user.verificationToken !== verificationToken ||
                !user.verificationTokenExpiresAt ||
                user.verificationTokenExpiresAt.getTime() < Date.now()
            ) {
                return httpError(next, new Error('Invalid or expired verification token'), req, 400)
            } else {
                user.isVerified = true
                user.verificationToken = undefined
                user.verificationTokenExpiresAt = undefined
                await user.save()
            }

            const data = {
                user: {
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isVerified: user.isVerified
                }
            }

            httpResponse(req, res, 200, 'Email verified successfully', data)
        } catch (error) {
            httpError(next, error, req, 500)
        }
    },
    login: async (req: Request, res: Response, next: NextFunction) => {
        const { email, password }: { email: string; password: string } = req.body as { email: string; password: string }

        if (!email || !password) {
            return httpError(next, new Error('Email and password are required'), req, 400)
        }

        try {
            const user = await User.findOne({ email })
            if (!user) {
                return httpError(next, new Error('User not found'), req, 404)
            }

            const isPasswordValid = await bcrypt.compare(password, user.password)

            if (!isPasswordValid) {
                return httpError(next, new Error('Invalid password'), req, 401)
            }

            if (!user.approve) {
                return httpError(next, new Error('Please Wait for Admin Approval'), req, 401)
            }

            GenerateTokenandSetCookie(res, user._id.toString())

            user.lastLogin = new Date()
            await user.save()

            const data = {
                user: {
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isVerified: user.isVerified
                }
            }
            httpResponse(req, res, 200, 'User logged in successfully', data)
        } catch (error) {
            httpError(next, error, req, 500)
        }
    },
    logout: (req: Request, res: Response, next: NextFunction) => {
        try {
            res.clearCookie('token')
            httpResponse(req, res, 200, 'User logged out successfully', null)
        } catch (error) {
            httpError(next, error, req, 500)
        }
    },
    forgotPassword: async (req: Request, res: Response, next: NextFunction) => {
        const { email }: { email: string } = req.body as { email: string }

        try {
            const user = await User.findOne({ email })
            if (!user) {
                return httpError(next, new Error('User not found'), req, 404)
            }

            const resetToken = crypto.randomBytes(20).toString('hex')
            const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000)

            user.resetPasswordToken = resetToken
            user.resetPasswordExpiresAt = resetTokenExpiresAt

            await user.save()

            await SendFogotPasswordEmail(user.name, user.email, `${config.FRONTEND_URL}/resetpassword/${resetToken}`)

            httpResponse(req, res, 200, 'Password reset email sent successfully', null)
        } catch (error) {
            httpError(next, error, req, 500)
        }
    },
    resetPassword: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { resetToken }: { resetToken: string } = req.params as { resetToken: string }
            const { password }: { password: string } = req.body as { password: string }

            const user = await User.findOne({ resetPasswordToken: resetToken, resetPasswordExpiresAt: { $gt: Date.now() } })

            if (!user) {
                return httpError(next, new Error('Invalid or expired reset token'), req, 400)
            }

            const hashedPassword = await bcrypt.hash(password, 10)
            user.password = hashedPassword
            user.resetPasswordToken = undefined
            user.resetPasswordExpiresAt = undefined

            await user.save()
            await SendResetSuccessEmail(user.name, user.email)
            httpResponse(req, res, 200, 'Password reset successfully', null)
        } catch (error) {
            httpError(next, error, req, 500)
        }
    },

    checkAuth: async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const user = await User.findById(req.userId)
            if (!user) {
                return httpError(next, new Error('User not found'), req, 404)
            }
            const data = {
                user: {
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isVerified: user.isVerified
                }
            }
            httpResponse(req, res, 200, 'User authenticated successfully', data)
        } catch (error) {
            httpError(next, error, req, 500)
        }
    },
    checkRole: async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const user = await User.findById(req.userId)
            if (!user) {
                return httpError(next, new Error('User not found'), req, 404)
            }
            const data = {
                user: {
                    role: user.role
                }
            }
            httpResponse(req, res, 200, 'User role found', data)
        } catch (error) {
            httpError(next, error, req, 500)
        }
    }
}
