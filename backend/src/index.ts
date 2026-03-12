import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'
import pool from './db/pool' 
import jobRoutes from './routes/jobs'
import scrapeRoutes from './routes/scrape'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)

app.use('/api/jobs', jobRoutes)


app.use('/api/scrape', scrapeRoutes)


const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.log('Database connection failed:', err)
  } else {
    console.log('Database connected at:', res.rows[0].now)
  }
})