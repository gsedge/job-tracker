
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../services/apis'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit() {
    const data = await loginUser(email, password)

    if (data.token) {
      localStorage.setItem('token', data.token)
      navigate('/dashboard')
    } else {
      setError('Invalid email or password')
    }
  }

  return (
    <div>
      <input 
        type="email" 
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input 
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p>{error}</p>}
      <button onClick={handleSubmit}>Login</button>
      <Link to="/signup">Don't have an account? Sign up</Link>
    </div>
  )
}