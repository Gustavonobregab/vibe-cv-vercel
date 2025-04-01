import { Router } from 'express'
import authController from '../controllers/auth.controller'

const router = Router()

// Google OAuth routes
router.get('/google', authController.googleAuth)
router.get('/google/callback', authController.googleCallback)

// Token verification middleware
router.use('/verify', authController.verifyToken)

export default router 