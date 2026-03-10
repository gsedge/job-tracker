import { useEffect, useState } from 'react'
import { getAllJobs, deleteJobApi, updateJobApi } from '../services/apis'
import BackButton from '../components/backButton'

export default function AllJobsPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [editingJob, setEditingJob] = useState<any | null>(null)

  const [filters, setFilters] = useState({
    company: '', location: '', status: '',
    minSalary: '', maxSalary: '', dateFrom: '', dateTo: '',
  })

  useEffect(() => {
    getAllJobs().then(data => {
      setJobs(data)
      setFiltered(data)
    })
  }, [])

  const uniqueCompanies = [...new Set(jobs.map(j => j.company).filter(Boolean))]
  const uniqueLocations = [...new Set(jobs.map(j => j.location).filter(Boolean))]
  const statuses = ['applied', 'interview', 'offer', 'rejected']

  function applyFilters() {
    let result = [...jobs]
    if (filters.company) result = result.filter(j => j.company === filters.company)
    if (filters.location) result = result.filter(j => j.location === filters.location)
    if (filters.status) result = result.filter(j => j.status === filters.status)
    if (filters.minSalary) result = result.filter(j => j.salary >= Number(filters.minSalary))
    if (filters.maxSalary) result = result.filter(j => j.salary <= Number(filters.maxSalary))
    if (filters.dateFrom) result = result.filter(j => new Date(j.applied_date) >= new Date(filters.dateFrom))
    if (filters.dateTo) result = result.filter(j => new Date(j.applied_date) <= new Date(filters.dateTo))
    setFiltered(result)
    setShowFilters(false)
  }

  function clearFilters() {
    setFilters({ company: '', location: '', status: '', minSalary: '', maxSalary: '', dateFrom: '', dateTo: '' })
    setFiltered(jobs)
    setShowFilters(false)
  }

  async function handleDelete(jobId: number) {
    if (!confirm('Are you sure you want to delete this job?')) return
    await deleteJobApi(jobId)
    const updated = jobs.filter(j => j.job_id !== jobId)
    setJobs(updated)
    setFiltered(updated)
  }

  async function handleEditSave() {
    const saved = await updateJobApi(editingJob.job_id, editingJob)
    const updated = jobs.map(j => j.job_id === saved.job_id ? saved : j)
    setJobs(updated)
    setFiltered(updated)
    setEditingJob(null)
  }

  const activeFilterCount = Object.values(filters).filter(v => v !== '').length

  return (
    <div className="p-6">

      {/* Edit Modal */}
      {editingJob && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Edit Job</h2>

            {[
              { label: 'Company', key: 'company', type: 'text' },
              { label: 'Position', key: 'position_name', type: 'text' },
              { label: 'Location', key: 'location', type: 'text' },
              { label: 'Salary', key: 'salary', type: 'number' },
              { label: 'Date Applied', key: 'applied_date', type: 'date' },
            ].map(({ label, key, type }) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-xs text-gray-400">{label}</label>
                <input
                  type={type}
                  value={key === 'applied_date' ? editingJob[key]?.split('T')[0] : editingJob[key] ?? ''}
                  onChange={e => setEditingJob({ ...editingJob, [key]: e.target.value })}
                  className="bg-gray-700 text-white text-sm rounded px-3 py-2"
                />
              </div>
            ))}

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Status</label>
              <select
                value={editingJob.status}
                onChange={e => setEditingJob({ ...editingJob, status: e.target.value })}
                className="bg-gray-700 text-white text-sm rounded px-3 py-2"
              >
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Notes</label>
              <textarea
                value={editingJob.notes ?? ''}
                onChange={e => setEditingJob({ ...editingJob, notes: e.target.value })}
                className="bg-gray-700 text-white text-sm rounded px-3 py-2 h-24 resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setEditingJob(null)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 rounded-lg transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative flex items-center justify-center mb-6">
        <div className="absolute left-0"><BackButton /></div>
        <h1 className="text-xl font-semibold">All Jobs</h1>
        <div className="absolute right-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg transition"
          >
            Filter
            {activeFilterCount > 0 && (
              <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-gray-800 rounded-lg p-4 mb-6 grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">Company</label>
            <select value={filters.company} onChange={e => setFilters({ ...filters, company: e.target.value })} className="bg-gray-700 text-white text-sm rounded px-3 py-2">
              <option value="">All</option>
              {uniqueCompanies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">Location</label>
            <select value={filters.location} onChange={e => setFilters({ ...filters, location: e.target.value })} className="bg-gray-700 text-white text-sm rounded px-3 py-2">
              <option value="">All</option>
              {uniqueLocations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">Status</label>
            <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })} className="bg-gray-700 text-white text-sm rounded px-3 py-2">
              <option value="">All</option>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">Salary Range (£)</label>
            <div className="flex gap-2">
              <input type="number" placeholder="Min" value={filters.minSalary} onChange={e => setFilters({ ...filters, minSalary: e.target.value })} className="bg-gray-700 text-white text-sm rounded px-3 py-2 w-full" />
              <input type="number" placeholder="Max" value={filters.maxSalary} onChange={e => setFilters({ ...filters, maxSalary: e.target.value })} className="bg-gray-700 text-white text-sm rounded px-3 py-2 w-full" />
            </div>
          </div>
          <div className="flex flex-col gap-1 col-span-2">
            <label className="text-xs text-gray-400">Date Applied</label>
            <div className="flex gap-2">
              <input type="date" value={filters.dateFrom} onChange={e => setFilters({ ...filters, dateFrom: e.target.value })} className="bg-gray-700 text-white text-sm rounded px-3 py-2 w-full" />
              <input type="date" value={filters.dateTo} onChange={e => setFilters({ ...filters, dateTo: e.target.value })} className="bg-gray-700 text-white text-sm rounded px-3 py-2 w-full" />
            </div>
          </div>
          <div className="col-span-2 flex justify-end gap-2 mt-2">
            <button onClick={clearFilters} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition">Clear</button>
            <button onClick={applyFilters} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 rounded-lg transition">Apply</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-gray-400 border-b border-gray-700">
            <tr>
              <th className="py-3 px-4">Company</th>
              <th className="py-3 px-4">Position</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Date Applied</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Salary</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((job) => (
              <tr key={job.job_id} className="border-b border-gray-800 hover:bg-gray-800 transition">
                <td className="py-3 px-4">{job.company}</td>
                <td className="py-3 px-4">{job.position_name}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 rounded-full text-xs bg-gray-700 text-gray-300">{job.status}</span>
                </td>
                <td className="py-3 px-4">{new Date(job.applied_date).toLocaleDateString()}</td>
                <td className="py-3 px-4">{job.location}</td>
                <td className="py-3 px-4">{job.salary ? `£${job.salary.toLocaleString()}` : '—'}</td>
                <td className="py-3 px-4 flex gap-2">
                  <button
                    onClick={() => setEditingJob(job)}
                    className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-500 rounded transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(job.job_id)}
                    className="px-3 py-1 text-xs bg-red-600 hover:bg-red-500 rounded transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-gray-500 mt-8">No jobs match your filters.</p>
        )}
      </div>
    </div>
  )
}