import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackButton from '../components/backButton'
import { getMe, updateName, updatePassword, deleteAccount } from '../services/apis'

export default function AccountPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)

  // Name form
  const [nameForm, setNameForm] = useState({ f_name: '', l_name: '' })
  const [nameMessage, setNameMessage] = useState('')
  const [nameError, setNameError] = useState('')

  // Password form
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [passMessage, setPassMessage] = useState('')
  const [passError, setPassError] = useState('')

  // Delete
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    getMe().then(data => {
      setUser(data)
      setNameForm({ f_name: data.f_name ?? '', l_name: data.l_name ?? '' })
    })
  }, [])

  function handleLogout() {
    localStorage.removeItem('token')
    navigate('/')
  }

  async function handleUpdateName() {
    setNameError('')
    setNameMessage('')
    if (!nameForm.f_name.trim() || !nameForm.l_name.trim()) {
      setNameError('Both fields are required.')
      return
    }
    const data = await updateName(nameForm.f_name, nameForm.l_name)
    if (data.error) setNameError(data.error)
    else setNameMessage('Name updated successfully.')
  }

  async function handleUpdatePassword() {
    setPassError('')
    setPassMessage('')
    if (!passForm.currentPassword || !passForm.newPassword || !passForm.confirmPassword) {
      setPassError('All fields are required.')
      return
    }
    if (passForm.newPassword !== passForm.confirmPassword) {
      setPassError('New passwords do not match.')
      return
    }
    if (passForm.newPassword.length < 8) {
      setPassError('Password must be at least 8 characters.')
      return
    }
    if (!/[A-Z]/.test(passForm.newPassword)) {
      setPassError('Password must contain at least one uppercase letter.')
      return
    }
    if (!/[0-9]/.test(passForm.newPassword)) {
      setPassError('Password must contain at least one number.')
      return
    }
    const data = await updatePassword(passForm.currentPassword, passForm.newPassword)
    if (data.error) setPassError(data.error)
    else {
      setPassMessage('Password updated successfully.')
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    }
  }

  async function handleDeleteAccount() {
    await deleteAccount()
    localStorage.removeItem('token')
    navigate('/login')
  }

  if (!user) return <p className="text-center mt-20 text-gray-400">Loading...</p>

  return (
    <div className="p-6 max-w-lg mx-auto">
      <div className="relative flex items-center justify-center mb-8">
        <div className="absolute left-0"><BackButton /></div>
        <h1 className="text-xl font-semibold">Account</h1>
      </div>

      <p className="text-sm text-gray-400 mb-8">{user.email}</p>

      {/* Update Name */}
      <section className="mb-8">
        <h2 className="text-base font-medium mb-3">Update Name</h2>
        <div className="flex gap-3 mb-2">
          <input
            type="text"
            value={nameForm.f_name}
            onChange={e => setNameForm({ ...nameForm, f_name: e.target.value })}
            placeholder="First name"
            className="bg-gray-700 text-white text-sm rounded px-3 py-2 flex-1"
          />
          <input
            type="text"
            value={nameForm.l_name}
            onChange={e => setNameForm({ ...nameForm, l_name: e.target.value })}
            placeholder="Last name"
            className="bg-gray-700 text-white text-sm rounded px-3 py-2 flex-1"
          />
        </div>
        {nameError && <p className="text-red-400 text-xs mb-2">{nameError}</p>}
        {nameMessage && <p className="text-green-400 text-xs mb-2">{nameMessage}</p>}
        <button
          onClick={handleUpdateName}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm transition"
        >
          Save Name
        </button>
      </section>

      <hr className="border-gray-700 mb-8" />

      {/* Update Password */}
      {user.provider === 'local' && (
        <>
          <section className="mb-8">
            <h2 className="text-base font-medium mb-3">Change Password</h2>
            <div className="flex flex-col gap-2">
              <input
                type="password"
                value={passForm.currentPassword}
                onChange={e => setPassForm({ ...passForm, currentPassword: e.target.value })}
                placeholder="Current password"
                className="bg-gray-700 text-white text-sm rounded px-3 py-2"
              />
              <input
                type="password"
                value={passForm.newPassword}
                onChange={e => setPassForm({ ...passForm, newPassword: e.target.value })}
                placeholder="New password"
                className="bg-gray-700 text-white text-sm rounded px-3 py-2"
              />
              <input
                type="password"
                value={passForm.confirmPassword}
                onChange={e => setPassForm({ ...passForm, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
                className="bg-gray-700 text-white text-sm rounded px-3 py-2"
              />
            </div>
            {passError && <p className="text-red-400 text-xs mt-2">{passError}</p>}
            {passMessage && <p className="text-green-400 text-xs mt-2">{passMessage}</p>}
            <button
              onClick={handleUpdatePassword}
              className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm transition"
            >
              Update Password
            </button>
          </section>
          <hr className="border-gray-700 mb-8" />
        </>
      )}

      {/* Logout */}
      <section className="mb-8">
        <h2 className="text-base font-medium mb-3">Session</h2>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition"
        >
          Log Out
        </button>
      </section>

      <hr className="border-gray-700 mb-8" />

      {/* Delete Account */}
      <section>
        <h2 className="text-base font-medium mb-1">Danger Zone</h2>
        <p className="text-xs text-gray-400 mb-3">
          Deleting your account is permanent and will remove all your data.
        </p>
        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded-lg text-sm transition"
          >
            Delete Account
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <p className="text-sm text-red-400">Are you sure?</p>
            <button
              onClick={handleDeleteAccount}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm transition"
            >
              Yes, delete
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition"
            >
              Cancel
            </button>
          </div>
        )}
      </section>
    </div>
  )
}