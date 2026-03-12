import { Request, Response } from 'express'
import pool from '../db/pool'

export async function getRecentJobs(req: any, res: Response) {
  try {
    const result = await pool.query(
      `SELECT * FROM jobs 
       WHERE user_id = $1 
       ORDER BY applied_date DESC 
       LIMIT 4`,
      [req.user.userId]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recent jobs' })
  }
}

export async function getAllJobsController(req: any, res: Response) {
  try {
    const result = await pool.query(
      `SELECT * FROM jobs WHERE user_id = $1 ORDER BY applied_date DESC`,
      [req.user.userId]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch jobs' })
  }
}

export async function deleteJob(req: any, res: Response) {
  try {
    await pool.query(
      'DELETE FROM jobs WHERE job_id = $1 AND user_id = $2',
      [req.params.id, req.user.userId]
    )
    res.json({ message: 'Job deleted' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete job' })
  }
}

export async function updateJob(req: any, res: Response) {
  const { company, position_name, status, applied_date, location, salary, notes } = req.body
  try {
    const result = await pool.query(
      `UPDATE jobs SET 
        company = $1, position_name = $2, status = $3,
        applied_date = $4, location = $5, salary = $6, notes = $7
       WHERE job_id = $8 AND user_id = $9
       RETURNING *`,
      [company, position_name, status, applied_date, location, salary, notes, req.params.id, req.user.userId]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to update job' })
  }
}

export async function createJob(req: any, res: Response) {
  const { company, position_name, status, applied_date, location, salary, notes } = req.body
  const salaryValue = salary === '' || salary === null ? null : Number(salary)
  
  try {
    const result = await pool.query(
      `INSERT INTO jobs (user_id, company, position_name, status, applied_date, location, salary, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [req.user.userId, company, position_name, status, applied_date, location, salaryValue, notes]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.log('createJob error:', err)
    res.status(500).json({ error: 'Failed to create job' })
  }
}