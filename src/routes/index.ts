import { Router } from 'express'
import userRoutes from '../modules/users/routes/user.routes'
import paymentRoutes from '../modules/payments/routes/payment.routes'
import curriculumRoutes from '../modules/curriculums/routes/curriculum.routes'
import authRoutes from '../modules/auth/routes/auth.routes'

const router = Router()

// API version prefix
const API_VERSION = '/api/v1'

// Mount routes
router.use(`${API_VERSION}/auth`, authRoutes)
router.use(`${API_VERSION}/users`, userRoutes)
router.use(`${API_VERSION}/payments`, paymentRoutes)
router.use(`${API_VERSION}/curriculums`, curriculumRoutes)

// Health check route
router.get('/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default router 