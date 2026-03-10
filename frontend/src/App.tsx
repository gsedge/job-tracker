
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'

import LandingPage from "./pages/landing"
import LoginPage from "./pages/login"
import SignupPage from "./pages/signup"
import DashboardPage from './pages/dashboard'
import AccountPage from './pages/account'
import AddJobPage from './pages/addJob'
import AllJobsPage from './pages/allJobs'

function App() {

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
      <Route path="/add-job" element={<ProtectedRoute><AddJobPage /></ProtectedRoute>} />
      <Route path="/all-jobs" element={<ProtectedRoute><AllJobsPage /></ProtectedRoute>} />
    </Routes>
  )
}

export default App
