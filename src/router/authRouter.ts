import { Router } from 'express'
import authController from '../controller/authController'
import rateLimitter from '../middleware/rateLimitter'
import { verifyToken } from '../middleware/verifyToken'
import authvalidation from '../middleware/authvalidation'

const authRouter = Router()

authRouter.use(rateLimitter)
authRouter.route('/login').post(authvalidation.validateLogin, authController.login)
authRouter.route('/signup').post(authvalidation.validateSignUp, authController.signup)
authRouter.route('/verifyemail').post(authvalidation.validateVerifyEmail, authController.verifyemail)
authRouter.route('/logout').post(authController.logout)
authRouter.route('/forgotpassword').post(authvalidation.validateForgotPassword, authController.forgotPassword)
authRouter.route('/resetpassword/:resetToken').post(authvalidation.validateResetPassword, authController.resetPassword)
authRouter.route('/check-auth').post(verifyToken, authController.checkAuth)
authRouter.route('/check-role').post(verifyToken, authController.checkRole)

export default authRouter
