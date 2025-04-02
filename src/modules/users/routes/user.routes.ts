import { Router } from 'express'
import userController from '../controllers/user.controller'
import { verifyToken } from '../../auth/middlewares/auth.middleware'

const router = Router()

// Rotas públicas
router.get('/:id', userController.getUserById)
router.get('/google/:googleId', userController.getUserByGoogleId)
router.get('/email/:email', userController.getUserByEmail)

// Rotas privadas
router.use(verifyToken)
router.get('/', userController.getUsersPaginated)
router.put('/:id', userController.updateUser)
router.put('/:id/profile', userController.completeProfile)

export default router 