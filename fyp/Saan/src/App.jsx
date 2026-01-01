// In your App.jsx or main routing file
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import AboutUs from './pages/user/aboutus';
import BrowseVenue from './pages/user/BrowseVenue';
import CustomerInquiry from './pages/user/CustomerInquiry';
import UserHome from './pages/user/UserHome';
import AdminDashboard from './pages/admin/AdminDashboard';
import VenueDashboard from './pages/venue-owner/VenueDashboard';
import UserLogin from './pages/auth/UserLogin';
import Signup from './pages/auth/Signup';

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  const ProtectedRoute = ({ children, requiredRole }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/" />;
    }

    const userRole = localStorage.getItem('userRole');
    if (requiredRole && userRole !== requiredRole) {
      // Redirect to appropriate home based on role
      switch(userRole) {
        case 'admin':
          return <Navigate to="/admin/dashboard" />;
        case 'venue-owner':
          return <Navigate to="/venue-owner/dashboard" />;
        default:
          return <Navigate to="/home" />;
      }
    }

    return children;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<UserLogin />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes with Navigation */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute requiredRole="user">
                <>
                  <Navigation />
                  <UserHome />
                </>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/browse-venue" 
            element={
              <ProtectedRoute requiredRole="user">
                <>
                  <Navigation />
                  <BrowseVenue />
                </>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/about-us" 
            element={
              <ProtectedRoute>
                <>
                  <Navigation />
                  <AboutUs />
                </>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/customer-inquiry" 
            element={
              <ProtectedRoute requiredRole="user">
                <>
                  <Navigation />
                  <CustomerInquiry />
                </>
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute requiredRole="admin">
                <>
                  <Navigation />
                  <AdminDashboard />
                </>
              </ProtectedRoute>
            } 
          />
          
          {/* Venue Owner Routes */}
          <Route 
            path="/venue-owner/dashboard" 
            element={
              <ProtectedRoute requiredRole="venue-owner">
                <>
                  <Navigation />
                  <VenueDashboard />
                </>
              </ProtectedRoute>
            } 
          />
          
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;