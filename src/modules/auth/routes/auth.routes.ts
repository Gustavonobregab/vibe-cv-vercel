import { Router } from 'express'
import authController from '../controllers/auth.controller'
import { verifyToken } from '../middlewares/auth.middleware'

const router = Router()

// Google OAuth routes
router.get('/google', authController.googleAuth)
router.get('/google/callback', authController.googleCallback)

// Protected routes
router.get('/me', verifyToken, authController.getCurrentUser)

export default router 