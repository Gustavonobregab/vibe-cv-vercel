import { Router } from 'express'
import curriculumController from '../controllers/curriculum.controller'

const router = Router()

// Curriculum routes
router.post('/', curriculumController.createCurriculum)
router.get('/:id', curriculumController.getCurriculumById)
router.put('/:id', curriculumController.updateCurriculum)
router.get('/user/:userId', curriculumController.getCurriculumsByUserId)
router.get('/', curriculumController.getCurriculumsPaginated)

export default router 