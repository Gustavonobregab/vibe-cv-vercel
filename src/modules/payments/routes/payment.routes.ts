import { Router } from 'express'
import paymentController from '../controllers/payment.controller'

const router = Router()

router.post('/', paymentController.createPayment)
router.get('/curriculum/:curriculumId', paymentController.getPaymentsByCurriculumId)
router.get('/:id', paymentController.getPaymentById)
router.put('/:id', paymentController.updatePayment)
router.get('/', paymentController.getPaymentsPaginated)

export default router 