import { Router } from 'express'
import { scrapeJobFromUrl } from '../controller/scrapeController'
import { authenticate } from '../middleware/authMiddleware'

const router = Router()

console.log('scrape route loaded') 

router.post('/', authenticate, scrapeJobFromUrl)

export default router