import { Router } from 'express'
import { getRecentJobs, getAllJobsController, updateJob, deleteJob, createJob } from '../controller/jobsController'
import { authenticate } from '../middleware/authMiddleware'

const router = Router()

router.get('/recent', authenticate, getRecentJobs)
router.get('/', authenticate, getAllJobsController )
router.delete('/:id', authenticate, deleteJob)
router.put('/:id', authenticate, updateJob)
router.post('/', authenticate, createJob)

export default router