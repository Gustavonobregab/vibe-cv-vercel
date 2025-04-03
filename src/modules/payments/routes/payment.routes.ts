import { Router } from 'express'
import paymentController from '../controllers/payment.controller'
import { verifyToken } from '../../auth/middlewares/auth.middleware'

const router = Router()

// Apply authentication middleware to all routes
router.use(verifyToken)

// Payments routes - all protected
// List all payments (paginated)
router.get('/', paymentController.getPaymentsPaginated)

// Payments for specific curriculum
router.get('/curriculum/:curriculumId', paymentController.getPaymentsByCurriculumId)

// Individual payment operations
router.post('/', paymentController.createPayment)
router.get('/:id', paymentController.getPaymentById)
router.put('/:id', paymentController.updatePayment)

export default router 