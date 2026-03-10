import { useState } from 'react'

interface JobFormData {
  company: string
  position_name: string
  status: string
  applied_date: string
  notes: string
  salary: string
  location: string
}

interface JobFormProps {
  initialData?: Partial<JobFormData>
  onSubmit: (data: JobFormData) => Promise<void>
  submitLabel?: string
}

const defaultData: JobFormData = {
  company: '',
  position_name: '',
  status: 'applied',
  applied_date: new Date().toISOString().split('T')[0],
  notes: '',
  salary: '',
  location: '',
}

const statuses = ['applied', 'interview', 'offer', 'rejected']

export default function JobForm({ initialData = {}, onSubmit, submitLabel = 'Add Job' }: JobFormProps) {
  const [form, setForm] = useState<JobFormData>({ ...defaultData, ...initialData })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function update(key: keyof JobFormData, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

function validate(): string | null {
  if (!form.company.trim()) return 'Company is required.'
  if (!form.position_name.trim()) return 'Position is required.'
  if (!form.location.trim()) return 'Location is required.'

  if (form.salary) {
    const salary = Number(form.salary)
    if (isNaN(salary)) return 'Salary must be a number.'
    if (salary < 0) return 'Salary cannot be negative.'
    if (salary > 1000000) return 'Please enter a realistic salary.'
  }

  if (!form.applied_date) return 'Date applied is required.'
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const applied = new Date(form.applied_date)
  if (applied > today) return 'Date applied cannot be in the future.'

  return null
}

async function handleSubmit() {
  const validationError = validate()
  if (validationError) {
    setError(validationError)
    return
  }
  setLoading(true)
  setError('')
  try {
    await onSubmit(form)
  } catch {
    setError('Something went wrong. Please try again.')
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="flex flex-col gap-4 w-full max-w-lg">

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-400">Company *</label>
        <input
          type="text"
          value={form.company}
          onChange={e => update('company', e.target.value)}
          placeholder="e.g. Google"
          className="bg-gray-700 text-white text-sm rounded px-3 py-2"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-400">Position *</label>
        <input
          type="text"
          value={form.position_name}
          onChange={e => update('position_name', e.target.value)}
          placeholder="e.g. Software Engineer"
          className="bg-gray-700 text-white text-sm rounded px-3 py-2"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs text-gray-400">Location</label>
          <input
            type="text"
            value={form.location}
            onChange={e => update('location', e.target.value)}
            placeholder="e.g. London"
            className="bg-gray-700 text-white text-sm rounded px-3 py-2"
          />
        </div>

        {/* Salary */}
        <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs text-gray-400">Salary (£)</label>
            <input
                type="number"
                value={form.salary}
                min={0}
                max={1000000}
                onChange={e => update('salary', e.target.value)}
                placeholder="e.g. 35000"
                className={`bg-gray-700 text-white text-sm rounded px-3 py-2 ${
                Number(form.salary) < 0 ? 'border border-red-500' : ''
                }`}
            />
            {Number(form.salary) < 0 && (
                <p className="text-red-400 text-xs">Salary cannot be negative</p>
            )}
        </div>

      </div>

      <div className="flex gap-4">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs text-gray-400">Status</label>
          <select
            value={form.status}
            onChange={e => update('status', e.target.value)}
            className="bg-gray-700 text-white text-sm rounded px-3 py-2"
          >
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

            {/* Date Applied */}
        <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs text-gray-400">Date Applied</label>
            <input
                type="date"
                value={form.applied_date}
                max={new Date().toISOString().split('T')[0]}
                onChange={e => update('applied_date', e.target.value)}
                className={`bg-gray-700 text-white text-sm rounded px-3 py-2 ${
                form.applied_date && new Date(form.applied_date) > new Date() ? 'border border-red-500' : ''
                }`}
            />
            {form.applied_date && new Date(form.applied_date) > new Date() && (
                <p className="text-red-400 text-xs">Date cannot be in the future</p>
            )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-400">Notes</label>
        <textarea
          value={form.notes}
          onChange={e => update('notes', e.target.value)}
          placeholder="Any notes about the role..."
          className="bg-gray-700 text-white text-sm rounded px-3 py-2 h-24 resize-none"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg text-sm transition"
      >
        {loading ? 'Saving...' : submitLabel}
      </button>

    </div>
  )
}