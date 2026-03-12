import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import pool from '../db/pool'

export async function register(req: Request, res: Response) {
  const { email, password, f_name, l_name } = req.body

  if (!email || !password || !f_name || !l_name) {
    return res.status(400).json({ error: 'All fields are required.' })
  }

  const hashed = await bcrypt.hash(password, 10)

  try {
    const result = await pool.query(
      'INSERT INTO users (email, password, f_name, l_name) VALUES ($1, $2, $3, $4) RETURNING id, email, f_name, l_name',
      [email, hashed, f_name, l_name]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(400).json({ error: 'Email already in use.' })
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body

  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
  const user = result.rows[0]

  if (!user) return res.status(401).json({ error: 'Invalid credentials' })

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' })

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' })
  res.json({ token })
}

export async function updateName(req: any, res: Response) {
  const { f_name, l_name } = req.body
  if (!f_name?.trim() || !l_name?.trim()) {
    return res.status(400).json({ error: 'First and last name are required.' })
  }
  try {
    const result = await pool.query(
      'UPDATE users SET f_name = $1, l_name = $2 WHERE id = $3 RETURNING id, email, f_name, l_name',
      [f_name, l_name, req.user.userId]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to update name.' })
  }
}

export async function updatePassword(req: any, res: Response) {
  const { currentPassword, newPassword } = req.body
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.userId])
    const user = result.rows[0]

    if (!user.password) {
      return res.status(400).json({ error: 'This account uses Google sign in and has no password.' })
    }

    const valid = await bcrypt.compare(currentPassword, user.password)
    if (!valid) return res.status(401).json({ error: 'Current password is incorrect.' })

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters.' })
    }
    if (!/[A-Z]/.test(newPassword)) {
      return res.status(400).json({ error: 'Password must contain at least one uppercase letter.' })
    }
    if (!/[0-9]/.test(newPassword)) {
      return res.status(400).json({ error: 'Password must contain at least one number.' })
    }

    const hashed = await bcrypt.hash(newPassword, 10)
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashed, req.user.userId])
    res.json({ message: 'Password updated.' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to update password.' })
  }
}



export async function deleteAccount(req: any, res: Response) {
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [req.user.userId])
    res.json({ message: 'Account deleted.' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete account.' })
  }
}

export async function getMe(req: any, res: Response) {
  try {
    const result = await pool.query(
      'SELECT id, email, f_name, l_name, provider FROM users WHERE id = $1',
      [req.user.userId]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user.' })
  }
}