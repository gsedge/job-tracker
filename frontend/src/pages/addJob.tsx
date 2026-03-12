import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackButton from '../components/backButton'
import JobForm from '../components/JobForm'
import { addJobApi, scrapeJobUrl } from '../services/apis'

type Mode = null | 'manual' | 'link'

export default function AddJobPage() {
  const [mode, setMode] = useState<Mode>(null)
  const [url, setUrl] = useState('')
  const [scraping, setScraping] = useState(false)
  const [scrapeError, setScrapeError] = useState('')
  const [prefillData, setPrefillData] = useState<any>(null)
  const navigate = useNavigate()

  async function handleScrape() {
    setScraping(true)
    setScrapeError('')
    const data = await scrapeJobUrl(url)
    if (data.error) {
      setScrapeError(data.error)
    } else {
      setPrefillData(data)
    }
    setScraping(false)
  }

async function handleSubmit(data: any) {
  console.log('submitting:', data)
  const result = await addJobApi(data)
  console.log('result:', result)
  navigate('/dashboard')
}

  return (
    <div className="p-6">
      <div className="relative flex items-center justify-center mb-8">
        <div className="absolute left-0"><BackButton /></div>
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
              className="px-6 py-4 bg-gray-700 hover:bg-gray-600 rounded-xl text-sm font-medium transition w-40 text-center"
            >
              🔗 From Link
            </button>
          </div>
        </div>
      )}

      {/* Link flow */}
      {mode === 'link' && !prefillData && (
        <div className="flex flex-col items-center gap-4 mt-16 w-full max-w-lg mx-auto">
          <h3 className="text-gray-400 text-sm">Paste a link to the job listing</h3>
          <p className="text-yellow-400 text-sm">Warning: Some websites may not work</p>

          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://..."
            className="bg-gray-700 text-white text-sm rounded px-3 py-2 w-full"
          />
          {scrapeError && <p className="text-red-400 text-sm">{scrapeError}</p>}
          <div className="flex gap-3 w-full">
            <button
              onClick={() => setMode(null)}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition"
            >
              Back
            </button>
            <button
              onClick={handleScrape}
              disabled={scraping || !url}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg text-sm transition"
            >
              {scraping ? 'Reading page...' : 'Get Details'}
            </button>
          </div>
        </div>
      )}

      {/* Manual form or pre-filled form from link */}
      {(mode === 'manual' || prefillData) && (
        <div className="flex flex-col items-center">
          {prefillData && (
            <p className="text-gray-400 text-sm mb-6">
              Fields found in the listing have been pre-filled. Check them before saving.
            </p>
          )}
          <JobForm
            onSubmit={handleSubmit}
            initialData={prefillData ?? {}}
            submitLabel="Add Job"
          />
        </div>
      )}
    </div>
  )
}