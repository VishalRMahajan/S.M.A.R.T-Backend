import { Router } from 'express'
import authController from '../controller/authController'
import rateLimitter from '../middleware/rateLimitter'
import { verifyToken } from '../middleware/verifyToken'

const authRouter = Router()

authRouter.use(rateLimitter)
authRouter.route('/login').post(authController.login)
authRouter.route('/signup').post(authController.signup)
authRouter.route('/verifyemail').post(authController.verifyemail)
authRouter.route('/logout').post(authController.logout)
authRouter.route('/forgotpassword').post(authController.forgotPassword)
authRouter.route('/resetpassword/:resetToken').post(authController.resetPassword)
authRouter.route('/check-auth').post(verifyToken, authController.checkAuth)
authRouter.route('/check-role').post(verifyToken, authController.checkRole)

export default authRouter
