import { Router } from 'express'
import userController from '../controllers/user.controller'
import { verifyToken } from '../../auth/middlewares/auth.middleware'
import multer from 'multer'

const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('Only PDF files are allowed'))
    }
  }
})

// Rotas públicas
router.get('/:id', userController.getUserById)
router.get('/google/:googleId', userController.getUserByGoogleId)
router.get('/email/:email', userController.getUserByEmail)

// Rotas protegidas
router.use(verifyToken)
router.get('/', userController.getUsersPaginated)
router.put('/:id', userController.updateUser)
router.patch('/:id/complete-profile', userController.completeProfile)
router.post('/:id/cv', upload.single('cv'), userController.uploadCV)

export default router 