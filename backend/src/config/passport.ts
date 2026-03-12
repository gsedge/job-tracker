import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import pool from '../db/pool'

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: 'http://localhost:5000/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0].value
    const google_id = profile.id
    const f_name = profile.name?.givenName
    const l_name = profile.name?.familyName

    // Check if user already exists
    const existing = await pool.query('SELECT * FROM users WHERE google_id = $1', [google_id])

    if (existing.rows.length > 0) {
      return done(null, existing.rows[0])
    }

    // Check if email already exists as local account
    const emailCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if (emailCheck.rows.length > 0) {
      // Link google to existing account
      const updated = await pool.query(
        'UPDATE users SET google_id = $1, provider = $2 WHERE email = $3 RETURNING *',
        [google_id, 'google', email]
      )
      return done(null, updated.rows[0])
    }

    // Create new user
    const result = await pool.query(
      'INSERT INTO users (email, google_id, provider, f_name, l_name) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [email, google_id, 'google', f_name, l_name]
    )
    return done(null, result.rows[0])

  } catch (err) {
    return done(err)
  }
}))

export default passport