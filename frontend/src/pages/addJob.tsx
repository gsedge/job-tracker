
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackButton from '../components/backButton'
import JobForm from '../components/JobForm'
import { addJobApi } from '../services/apis'

type Mode = null | 'manual' | 'link'

export default function AddJobPage() {
  const [mode, setMode] = useState<Mode>(null)
  const navigate = useNavigate()

  async function handleSubmit(data: any) {
    await addJobApi(data)
    navigate('/dashboard')
  }

  return (
    <div className="p-6">
      <div className="relative flex items-center justify-center mb-8">
        <div className="absolute left-0">
          <BackButton />
        </div>
        <h1 className="text-xl font-semibold">Add Job</h1>
      </div>

      {/* Mode selection */}
      {!mode && (
        <div className="flex flex-col items-center gap-4 mt-16">
          <p className="text-gray-400 text-sm mb-2">How would you like to add this job?</p>
          <div className="flex gap-4">
            <button
              onClick={() => setMode('manual')}
              className="px-6 py-4 bg-gray-700 hover:bg-gray-600 rounded-xl text-sm font-medium transition w-40 text-center"
            >
              ✏️ Manual Entry
            </button>
            <button
              onClick={() => setMode('link')}
              disabled
              className="px-6 py-4 bg-gray-700 opacity-40 rounded-xl text-sm font-medium w-40 text-center cursor-not-allowed"
            >
              🔗 From Link
              <span className="block text-xs text-gray-400 mt-1">Coming soon</span>
            </button>
          </div>
        </div>
      )}

      {/* Manual form */}
      {mode === 'manual' && (
        <div className="flex flex-col items-center">
          <JobForm onSubmit={handleSubmit} submitLabel="Add Job" />
        </div>
      )}
    </div>
  )
}