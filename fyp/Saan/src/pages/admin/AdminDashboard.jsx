import React from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-[#5d0f0f] shadow-lg p-6">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-300 mt-1">Manage users, venues, and bookings</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-semibold transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition">
            <h3 className="text-blue-200 text-sm font-semibold uppercase tracking-wide">Total Users</h3>
            <p className="text-5xl font-bold mt-3">0</p>
            <p className="text-blue-300 text-sm mt-2">Active on platform</p>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition">
            <h3 className="text-purple-200 text-sm font-semibold uppercase tracking-wide">Registered Venues</h3>
            <p className="text-5xl font-bold mt-3">0</p>
            <p className="text-purple-300 text-sm mt-2">Available for booking</p>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition">
            <h3 className="text-green-200 text-sm font-semibold uppercase tracking-wide">Total Bookings</h3>
            <p className="text-5xl font-bold mt-3">0</p>
            <p className="text-green-300 text-sm mt-2">All time bookings</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition">
            <h3 className="text-yellow-200 text-sm font-semibold uppercase tracking-wide">Pending Reviews</h3>
            <p className="text-5xl font-bold mt-3">0</p>
            <p className="text-yellow-300 text-sm mt-2">Awaiting approval</p>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* User Management */}
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">User Management</h2>
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold transition">
                View All Users
              </button>
            </div>
            <div className="space-y-3">
              <p className="text-gray-400">• Manage user accounts and permissions</p>
              <p className="text-gray-400">• View user activity and booking history</p>
              <p className="text-gray-400">• Handle user complaints and support</p>
              <p className="text-gray-400">• Block or deactivate users if needed</p>
            </div>
          </div>

          {/* Venue Management */}
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Venue Management</h2>
              <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-semibold transition">
                View All Venues
              </button>
            </div>
            <div className="space-y-3">
              <p className="text-gray-400">• Approve venue registrations</p>
              <p className="text-gray-400">• Monitor venue details and images</p>
              <p className="text-gray-400">• Verify venue owner information</p>
              <p className="text-gray-400">• Remove venues that violate policies</p>
            </div>
          </div>

          {/* Booking Management */}
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Booking Management</h2>
              <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-semibold transition">
                View All Bookings
              </button>
            </div>
            <div className="space-y-3">
              <p className="text-gray-400">• Monitor all active bookings</p>
              <p className="text-gray-400">• Resolve booking disputes</p>
              <p className="text-gray-400">• View transaction details</p>
              <p className="text-gray-400">• Generate booking reports</p>
            </div>
          </div>

          {/* Reports & Analytics */}
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Reports & Analytics</h2>
              <button className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg text-sm font-semibold transition">
                View Reports
              </button>
            </div>
            <div className="space-y-3">
              <p className="text-gray-400">• Platform statistics and trends</p>
              <p className="text-gray-400">• Revenue and transaction analytics</p>
              <p className="text-gray-400">• Popular venues and events</p>
              <p className="text-gray-400">• User engagement metrics</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <section className="mt-12 bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No recent activity yet. Features coming soon...</p>
          </div>
        </section>

      </main>
    </div>
  );
}

export default AdminDashboard;
