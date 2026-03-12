import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')

    if (token) {
      localStorage.setItem('token', token)
      // Verify it actually saved before navigating
      const saved = localStorage.getItem('token')
      if (saved) {
        navigate('/dashboard')
      } else {
        navigate('/login')
      }
    } else if (localStorage.getItem('token')) {
      navigate('/dashboard')
    } else {
      navigate('/login')
    }
  }, [])

  return <p className="text-center mt-20 text-gray-400">Signing you in...</p>
}