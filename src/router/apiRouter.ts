import { Router } from 'express'
import apiController from '../controller/apiController'
import rateLimitter from '../middleware/rateLimitter'

const router = Router()

router.use(rateLimitter)
router.route('/self').get(apiController.self)
router.route('/health').get(apiController.health)

export default router
