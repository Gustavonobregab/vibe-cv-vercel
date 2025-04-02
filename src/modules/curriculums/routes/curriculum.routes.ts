import { Router } from 'express'
import curriculumController from '../controllers/curriculum.controller'
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

// Apply authentication middleware to all routes
router.use(verifyToken)

// Curriculum routes - all protected
router.get('/:id', curriculumController.getCurriculumById)
router.put('/:id', curriculumController.updateCurriculum)
router.get('/user/:userId', curriculumController.getCurriculumsByUserId)
router.get('/', curriculumController.getCurriculumsPaginated)
router.post('/upload', upload.single('cv'), curriculumController.uploadCV)

export default router 