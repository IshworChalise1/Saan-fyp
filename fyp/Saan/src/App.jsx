import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'

// Pages
import LoginPage from './pages/auth/UserLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import VenueDashboard from './pages/venue-owner/VenueDashboard'
import UserHome from './pages/user/UserHome'
import BrowseVenue from "./pages/user/BrowseVenue";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/venue-dashboard" element={<VenueDashboard />} />
        <Route path="/home" element={<UserHome />} />
        <Route path="/browse-venue" element={<BrowseVenue />} />
      </Routes>
    </Router>
  )
}

export default App
