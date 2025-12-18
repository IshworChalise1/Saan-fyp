import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'

// Pages
import LoginPage from './pages/auth/UserLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import VenueDashboard from './pages/venue-owner/VenueDashboard'
import UserHome from './pages/user/UserHome'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/venue-dashboard" element={<VenueDashboard />} />
        <Route path="/home" element={<UserHome />} />
      </Routes>
    </Router>
  )
}

export default App
