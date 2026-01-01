import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaBars, FaTimes, FaHome, FaBuilding, FaInfoCircle, FaHeadset } from 'react-icons/fa';

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');

  // Get user info from localStorage
  useEffect(() => {
    const role = localStorage.getItem('userRole') || '';
    const name = localStorage.getItem('userName') || 'User';
    setUserRole(role);
    setUserName(name);
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // Check if current path is active
  const isActive = (path) => {
    return location.pathname === path ? 'bg-white/20' : '';
  };

  // Determine the home route based on user role
  const getHomeRoute = () => {
    switch(userRole) {
      case 'admin':
        return '/admin/dashboard';
      case 'venue-owner':
        return '/venue-owner/dashboard';
      case 'user':
      default:
        return '/home';
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-[#5d0f0f] text-white shadow-lg z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img
              src="/src/assets/logo.png"
              alt="SAAN Logo"
              className="w-10 h-10 object-contain"
            />
            <Link to={getHomeRoute()} className="text-xl font-bold hidden sm:block">
              SAAN
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-2">
            <Link
              to={getHomeRoute()}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors ${isActive(getHomeRoute())}`}
            >
              <FaHome className="w-4 h-4" />
              <span>Home</span>
            </Link>
            
            {userRole === 'user' && (
              <>
                <Link
                  to="/browse-venue"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors ${isActive('/browse-venue')}`}
                >
                  <FaBuilding className="w-4 h-4" />
                  <span>Browse Venues</span>
                </Link>
                
                <Link
                  to="/customer-inquiry"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors ${isActive('/customer-inquiry')}`}
                >
                  <FaHeadset className="w-4 h-4" />
                  <span>Support</span>
                </Link>
              </>
            )}
            
            {/* About Us link - accessible to all users */}
            <Link
              to="/about-us"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors ${isActive('/about-us')}`}
            >
              <FaInfoCircle className="w-4 h-4" />
              <span>About Us</span>
            </Link>
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center space-x-4">
            {/* User Profile */}
            <div className="hidden sm:flex items-center space-x-3 bg-white/10 px-4 py-2 rounded-full">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <FaUser className="w-4 h-4" />
              </div>
              <div className="text-sm">
                <p className="font-medium">{userName}</p>
                <p className="text-xs opacity-75 capitalize">{userRole || 'Guest'}</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-white text-[#5d0f0f] px-4 py-2 rounded-lg hover:bg-gray-100 font-medium transition-colors text-sm"
            >
              Logout
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FaTimes className="w-6 h-6" />
              ) : (
                <FaBars className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-[#6a1a1a] border-t border-white/10 py-4">
            <div className="space-y-1 px-4">
              <Link
                to={getHomeRoute()}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${isActive(getHomeRoute())}`}
              >
                <FaHome className="w-5 h-5" />
                <span>Home</span>
              </Link>
              
              {userRole === 'user' && (
                <>
                  <Link
                    to="/browse-venue"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${isActive('/browse-venue')}`}
                  >
                    <FaBuilding className="w-5 h-5" />
                    <span>Browse Venues</span>
                  </Link>
                  
                  <Link
                    to="/customer-inquiry"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${isActive('/customer-inquiry')}`}
                  >
                    <FaHeadset className="w-5 h-5" />
                    <span>Support</span>
                  </Link>
                </>
              )}
              
              <Link
                to="/about-us"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${isActive('/about-us')}`}
              >
                <FaInfoCircle className="w-5 h-5" />
                <span>About Us</span>
              </Link>
            </div>

            {/* User Info in Mobile Menu */}
            <div className="mt-4 pt-4 border-t border-white/10 px-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <FaUser className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">{userName}</p>
                  <p className="text-sm opacity-75 capitalize">{userRole || 'Guest'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;