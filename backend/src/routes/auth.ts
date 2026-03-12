import { Router } from 'express'
import { register, login, updateName, updatePassword, deleteAccount, getMe } from '../controller/authController'
import passport from '../config/passport'
import jwt from 'jsonwebtoken'
import { authenticate } from '../middleware/authMiddleware'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', authenticate, getMe)
router.put('/name', authenticate, updateName)
router.put('/password', authenticate, updatePassword)
router.delete('/account', authenticate, deleteAccount)

// Redirects user to Google login page
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' }))

// Google redirects back here after login
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login', session: false }),
  (req, res) => {
    const user = req.user as any
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' })
    // Send token to frontend via URL param
    res.redirect(`http://localhost:5173/auth/callback?token=${token}`)
  }
)

export default router