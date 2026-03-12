const BASE_URL = 'http://localhost:5000/api'

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
})

const authHeadersNoContent = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`
})

export async function registerUser(email: string, password: string, f_name: string, l_name: string) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: authHeaders(),
    credentials: 'include',
    body: JSON.stringify({ email, password, f_name, l_name })
  })
  return res.json()
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: authHeaders(),
    credentials: 'include',
    body: JSON.stringify({ email, password })
  })
  return res.json()
}

export async function recentJobs() {
  const res = await fetch(`${BASE_URL}/jobs/recent`, {
    headers: authHeadersNoContent(),
    credentials: 'include',
  })
  return res.json()
}

export async function getAllJobs() {
  const res = await fetch(`${BASE_URL}/jobs`, {
    headers: authHeadersNoContent(),
    credentials: 'include',
  })
  return res.json()
}

export async function deleteJobApi(jobId: number) {
  const res = await fetch(`${BASE_URL}/jobs/${jobId}`, {
    method: 'DELETE',
    headers: authHeadersNoContent(),
    credentials: 'include',
  })
  return res.json()
}

export async function updateJobApi(jobId: number, jobData: any) {
  const res = await fetch(`${BASE_URL}/jobs/${jobId}`, {
    method: 'PUT',
    headers: authHeaders(),
    credentials: 'include',
    body: JSON.stringify(jobData)
  })
  return res.json()
}

export async function addJobApi(jobData: any) {
  const res = await fetch(`${BASE_URL}/jobs`, {
    method: 'POST',
    headers: authHeaders(),
    credentials: 'include',
    body: JSON.stringify(jobData)
  })
  return res.json()
}

export async function scrapeJobUrl(url: string) {
  const res = await fetch(`${BASE_URL}/scrape`, {
    method: 'POST',
    headers: authHeaders(),
    credentials: 'include',
    body: JSON.stringify({ url })
  })
  return res.json()
}

export async function getMe() {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: authHeadersNoContent(),
    credentials: 'include',
  })
  return res.json()
}

export async function updateName(f_name: string, l_name: string) {
  const res = await fetch(`${BASE_URL}/auth/name`, {
    method: 'PUT',
    headers: authHeaders(),
    credentials: 'include',
    body: JSON.stringify({ f_name, l_name })
  })
  return res.json()
}

export async function updatePassword(currentPassword: string, newPassword: string) {
  const res = await fetch(`${BASE_URL}/auth/password`, {
    method: 'PUT',
    headers: authHeaders(),
    credentials: 'include',
    body: JSON.stringify({ currentPassword, newPassword })
  })
  return res.json()
}

export async function deleteAccount() {
  const res = await fetch(`${BASE_URL}/auth/account`, {
    method: 'DELETE',
    headers: authHeadersNoContent(),
    credentials: 'include',
  })
  return res.json()
}
