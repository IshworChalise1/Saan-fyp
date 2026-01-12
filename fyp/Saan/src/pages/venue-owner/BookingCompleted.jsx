import React from "react";

function BookingCompleted() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Completed Bookings</h1>
        <p className="text-gray-500 mt-1">View history of completed events</p>
      </div>

      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Completed Events</h2>
          <p className="text-gray-500 mb-6">This page will show all completed bookings and events.</p>
          <p className="text-sm text-gray-400">Coming soon...</p>
        </div>
      </div>
    </div>
  );
}

export default BookingCompleted;
