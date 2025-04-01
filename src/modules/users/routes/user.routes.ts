import { Router } from 'express'
import userController from '../controllers/user.controller'

const router = Router()

// User routes
router.post('/', userController.createUser)
router.get('/:id', userController.getUserById)
router.get('/google/:googleId', userController.getUserByGoogleId)
router.get('/email/:email', userController.getUserByEmail)
router.put('/:id', userController.updateUser)
router.get('/', userController.getUsersPaginated)

export default router 