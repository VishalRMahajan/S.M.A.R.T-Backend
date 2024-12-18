import { body, validationResult } from 'express-validator'
import { Response, Request, NextFunction } from 'express'
import httpError from '../util/httpError'

export default {
    validateLogin: [
        body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),

        body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),

        (req: Request, _: Response, next: NextFunction) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return httpError(next, new Error('Enter Valid Email or Password'), req, 400)
            }
            next()
        }
    ],
    validateSignUp: [
        body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),

        body('password')
            .isLength({ min: 8 })
            .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/)
            .withMessage('Password must contain uppercase, lowercase, numbers, and special characters'),

        body('name')
            .trim()
            .isLength({ min: 2 })
            .matches(/^[a-zA-Z\s]+$/)
            .withMessage('Name must be at least 2 characters and contain only letters'),

        (req: Request, _: Response, next: NextFunction) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return httpError(next, new Error('Enter Valid Name, Email, Password'), req, 400)
            }
            next()
        }
    ],
    validateVerifyEmail: [
        body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
        body('verificationToken')
            .matches(/^\d{6}$/)
            .withMessage('Verification token must be 6 digits'),

        (req: Request, _: Response, next: NextFunction) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return httpError(next, new Error('Enter Valid Email or Verification Token'), req, 400)
            }
            next()
        }
    ],
    validateForgotPassword: [
        body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),

        (req: Request, _: Response, next: NextFunction) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return httpError(next, new Error('Enter Valid Email'), req, 400)
            }
            next()
        }
    ],
    validateResetPassword: [
        body('password')
            .isLength({ min: 8 })
            .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/)
            .withMessage('Password must contain uppercase, lowercase, numbers, and special characters'),

        (req: Request, _: Response, next: NextFunction) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return httpError(next, new Error('Password must contain uppercase, lowercase, numbers, and special characters'), req, 400)
            }
            next()
        }
    ]
}
