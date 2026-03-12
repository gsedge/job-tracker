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