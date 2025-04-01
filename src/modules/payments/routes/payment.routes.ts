import { Router } from 'express'
import paymentController from '../controllers/payment.controller'

const router = Router()

// Payment routes
router.post('/', paymentController.createPayment)
router.get('/:id', paymentController.getPaymentById)
router.get('/transaction/:id', paymentController.getPaymentByTransactionId)
router.put('/:id', paymentController.updatePayment)
router.get('/user/:userId', paymentController.getPaymentsByUserId)
router.get('/status/:status', paymentController.getPaymentsByStatus)
router.get('/', paymentController.getPaymentsPaginated)

export default router 