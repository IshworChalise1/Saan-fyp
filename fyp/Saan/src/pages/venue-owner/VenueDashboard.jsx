import React from "react";
import { useNavigate } from "react-router-dom";

function VenueDashboard() {
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
            <h1 className="text-3xl font-bold">Venue Owner Dashboard</h1>
            <p className="text-gray-300 mt-1">Manage your venues and bookings</p>
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
            <h3 className="text-blue-200 text-sm font-semibold uppercase tracking-wide">My Venues</h3>
            <p className="text-5xl font-bold mt-3">0</p>
            <p className="text-blue-300 text-sm mt-2">Total venues registered</p>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition">
            <h3 className="text-green-200 text-sm font-semibold uppercase tracking-wide">Active Bookings</h3>
            <p className="text-5xl font-bold mt-3">0</p>
            <p className="text-green-300 text-sm mt-2">Current reservations</p>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition">
            <h3 className="text-purple-200 text-sm font-semibold uppercase tracking-wide">Total Earnings</h3>
            <p className="text-5xl font-bold mt-3">$0</p>
            <p className="text-purple-300 text-sm mt-2">Revenue generated</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition">
            <h3 className="text-yellow-200 text-sm font-semibold uppercase tracking-wide">New Inquiries</h3>
            <p className="text-5xl font-bold mt-3">0</p>
            <p className="text-yellow-300 text-sm mt-2">Pending responses</p>
          </div>
        </div>

        {/* Main Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Venue Management */}
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">My Venues</h2>
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold transition">
                Add New Venue
              </button>
            </div>
            <div className="space-y-3">
              <p className="text-gray-400">• Register and manage your venues</p>
              <p className="text-gray-400">• Upload venue images and details</p>
              <p className="text-gray-400">• Set pricing and availability</p>
              <p className="text-gray-400">• View venue performance analytics</p>
            </div>
          </div>

          {/* Bookings Management */}
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Bookings</h2>
              <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-semibold transition">
                View All Bookings
              </button>
            </div>
            <div className="space-y-3">
              <p className="text-gray-400">• View incoming booking requests</p>
              <p className="text-gray-400">• Accept or reject bookings</p>
              <p className="text-gray-400">• Manage booking calendar</p>
              <p className="text-gray-400">• Communicate with customers</p>
            </div>
          </div>

          {/* Reviews & Ratings */}
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Reviews & Ratings</h2>
              <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-semibold transition">
                View Reviews
              </button>
            </div>
            <div className="space-y-3">
              <p className="text-gray-400">• Monitor customer reviews</p>
              <p className="text-gray-400">• Respond to feedback</p>
              <p className="text-gray-400">• View your venue ratings</p>
              <p className="text-gray-400">• Track review trends</p>
            </div>
          </div>

          {/* Earnings & Payments */}
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Earnings</h2>
              <button className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg text-sm font-semibold transition">
                Payment Details
              </button>
            </div>
            <div className="space-y-3">
              <p className="text-gray-400">• View detailed earnings breakdown</p>
              <p className="text-gray-400">• Download invoices and reports</p>
              <p className="text-gray-400">• Manage payment methods</p>
              <p className="text-gray-400">• Track withdrawal history</p>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <section className="mt-12 bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-2xl font-bold mb-6">Recent Bookings</h2>
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No bookings yet. Features coming soon...</p>
          </div>
        </section>

      </main>
    </div>
  );
}

export default VenueDashboard;
