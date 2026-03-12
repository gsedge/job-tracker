import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../services/apis'

interface FormData {
  f_name: string
  l_name: string
  email: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  f_name?: string
  l_name?: string
  email?: string
  password?: string
  confirmPassword?: string
  general?: string
}

export default function SignupPage() {
  const [form, setForm] = useState<FormData>({
    f_name: '', l_name: '', email: '', password: '', confirmPassword: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function update(key: keyof FormData, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
    setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  function validate(): FormErrors {
    const e: FormErrors = {}

    if (!form.f_name.trim()) e.f_name = 'First name is required.'
    else if (form.f_name.trim().length < 2) e.f_name = 'First name must be at least 2 characters.'

    if (!form.l_name.trim()) e.l_name = 'Last name is required.'
    else if (form.l_name.trim().length < 2) e.l_name = 'Last name must be at least 2 characters.'

    if (!form.email.trim()) e.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.'

    if (!form.password) e.password = 'Password is required.'
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters.'
    else if (!/[A-Z]/.test(form.password)) e.password = 'Password must contain at least one uppercase letter.'
    else if (!/[0-9]/.test(form.password)) e.password = 'Password must contain at least one number.'

    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password.'
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.'

    return e
  }

  async function handleSubmit() {
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    const data = await registerUser(form.email, form.password, form.f_name, form.l_name)
    setLoading(false)

    if (data.error) {
      setErrors({ general: data.error })
      return
    }

    navigate('/login')
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col gap-4 w-full max-w-sm p-8">
        <h1 className="text-2xl font-semibold">Create an account</h1>

        {errors.general && <p className="text-red-400 text-sm">{errors.general}</p>}

        <div className="flex gap-3">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs text-gray-400">First Name</label>
            <input
              type="text"
              value={form.f_name}
              onChange={e => update('f_name', e.target.value)}
              placeholder="George"
              className="bg-gray-700 text-white text-sm rounded px-3 py-2"
            />
            {errors.f_name && <p className="text-red-400 text-xs">{errors.f_name}</p>}
          </div>

          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs text-gray-400">Last Name</label>
            <input
              type="text"
              value={form.l_name}
              onChange={e => update('l_name', e.target.value)}
              placeholder="Sedgwick"
              className="bg-gray-700 text-white text-sm rounded px-3 py-2"
            />
            {errors.l_name && <p className="text-red-400 text-xs">{errors.l_name}</p>}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={e => update('email', e.target.value)}
            placeholder="george@example.com"
            className="bg-gray-700 text-white text-sm rounded px-3 py-2"
          />
          {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={e => update('password', e.target.value)}
            placeholder="Min 8 chars, 1 uppercase, 1 number"
            className="bg-gray-700 text-white text-sm rounded px-3 py-2"
          />
          {errors.password && <p className="text-red-400 text-xs">{errors.password}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Confirm Password</label>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={e => update('confirmPassword', e.target.value)}
            placeholder="Repeat your password"
            className="bg-gray-700 text-white text-sm rounded px-3 py-2"
          />
          {errors.confirmPassword && <p className="text-red-400 text-xs">{errors.confirmPassword}</p>}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg text-sm transition"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>

        <p className="text-sm text-gray-400 text-center">
          Already have an account? <Link to="/login" className="text-blue-400 hover:text-blue-300">Log in</Link>
        </p>
      </div>
    </div>
  )
}