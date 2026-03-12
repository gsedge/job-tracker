const BASE_URL = 'http://localhost:5000/api'

export async function registerUser(email: string, password: string, f_name: string, l_name: string) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, f_name, l_name })
  })
  return res.json()
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  return res.json()
}

export async function recentJobs() {
  const res = await fetch(`${BASE_URL}/jobs/recent`, {
    method: 'GET',
    headers: {'Authorization': `Bearer ${localStorage.getItem('token')}` },
  })
  return res.json()
}

export async function getAllJobs() {
  const res = await fetch(`${BASE_URL}/jobs`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
  })
  return res.json()
}

export async function deleteJobApi(jobId: number) {
  const res = await fetch(`${BASE_URL}/jobs/${jobId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
  })
  return res.json()
}

export async function updateJobApi(jobId: number, jobData: any) {
  const res = await fetch(`${BASE_URL}/jobs/${jobId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(jobData)
  })
  return res.json()
}

export async function addJobApi(jobData: any) {
  const res = await fetch(`${BASE_URL}/jobs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(jobData)
  })
  return res.json()
}

export async function scrapeJobUrl(url: string) {
  const res = await fetch(`${BASE_URL}/scrape`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ url })
  })
  return res.json()
}