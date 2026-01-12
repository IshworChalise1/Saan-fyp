const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Auth API calls
export const authAPI = {
  register: async (formData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    return response.json();
  },

  login: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  getCurrentUser: async (token) => {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  logout: async (token) => {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },
};

// OTP API calls
export const otpAPI = {
  sendOtp: async (email, name) => {
    const response = await fetch(`${API_URL}/otp/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, name }),
    });
    return response.json();
  },

  verifyOtp: async (email, otp) => {
    const response = await fetch(`${API_URL}/otp/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });
    return response.json();
  },

  resendOtp: async (email, name) => {
    const response = await fetch(`${API_URL}/otp/resend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, name }),
    });
    return response.json();
  },
};

// Venue API calls
export const venueAPI = {
  getApprovedVenues: async () => {
    const response = await fetch(`${API_URL}/venues/approved`);
    return response.json();
  },

  getSingleVenue: async (id) => {
    const response = await fetch(`${API_URL}/venues/${id}`);
    return response.json();
  },

  createVenue: async (token, venueData) => {
    const response = await fetch(`${API_URL}/venues`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(venueData),
    });
    return response.json();
  },

  getMyVenues: async (token) => {
    const response = await fetch(`${API_URL}/venues/owner/my-venues`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  updateVenue: async (token, id, venueData) => {
    const response = await fetch(`${API_URL}/venues/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(venueData),
    });
    return response.json();
  },
};

// Booking API calls
export const bookingAPI = {
  createBooking: async (token, bookingData) => {
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    return response.json();
  },

  getMyBookings: async (token) => {
    const response = await fetch(`${API_URL}/bookings/my-bookings`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  cancelBooking: async (token, id) => {
    const response = await fetch(`${API_URL}/bookings/${id}/cancel`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  getVenueBookings: async (token, venueId) => {
    const response = await fetch(`${API_URL}/bookings/venue/${venueId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  updateBookingStatus: async (token, id, status) => {
    const response = await fetch(`${API_URL}/bookings/${id}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    return response.json();
  },
};

// Venue Registration API calls
export const venueRegistrationAPI = {
  // Get my registration status
  getMyRegistration: async (token) => {
    const response = await fetch(`${API_URL}/venue-registration/my-registration`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  // Submit registration with all files
  submitRegistration: async (token, formData) => {
    const response = await fetch(`${API_URL}/venue-registration`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type for FormData - browser will set it with boundary
      },
      body: formData,
    });
    return response.json();
  },

  // Upload single document
  uploadDocument: async (token, fieldName, file) => {
    const formData = new FormData();
    formData.append(fieldName, file);

    const response = await fetch(`${API_URL}/venue-registration/upload/${fieldName}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return response.json();
  },

  // Add venue images
  addVenueImages: async (token, files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('venueImages', file);
    });

    const response = await fetch(`${API_URL}/venue-registration/venue-images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return response.json();
  },

  // Remove venue image
  removeVenueImage: async (token, imageId) => {
    const response = await fetch(`${API_URL}/venue-registration/venue-images/${imageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },
};

// Admin Venue Registration API calls
export const adminVenueRegistrationAPI = {
  // Get dashboard stats
  getStats: async (token) => {
    const response = await fetch(`${API_URL}/venue-registration/admin/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  // Get all registrations
  getAllRegistrations: async (token, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/venue-registration/admin/all?${queryString}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  // Get single registration
  getRegistration: async (token, id) => {
    const response = await fetch(`${API_URL}/venue-registration/admin/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  // Review a specific field/document (approve or reject with reason)
  reviewField: async (token, id, fieldName, status, rejectionReason = null) => {
    const response = await fetch(`${API_URL}/venue-registration/admin/${id}/review-document`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ documentField: fieldName, status, rejectionReason }),
    });
    return response.json();
  },

  // Approve registration
  approveRegistration: async (token, id, adminNotes = null) => {
    const response = await fetch(`${API_URL}/venue-registration/admin/${id}/approve`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ adminNotes }),
    });
    return response.json();
  },

  // Reject registration
  rejectRegistration: async (token, id, adminNotes) => {
    const response = await fetch(`${API_URL}/venue-registration/admin/${id}/reject`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ adminNotes }),
    });
    return response.json();
  },
};

// Notification API calls
export const notificationAPI = {
  // Get notifications
  getNotifications: async (token, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/notifications?${queryString}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  // Get unread count
  getUnreadCount: async (token) => {
    const response = await fetch(`${API_URL}/notifications/unread-count`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  // Mark notification as read
  markAsRead: async (token, id) => {
    const response = await fetch(`${API_URL}/notifications/${id}/read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  // Mark all as read
  markAllAsRead: async (token) => {
    const response = await fetch(`${API_URL}/notifications/mark-all-read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  // Delete notification
  deleteNotification: async (token, id) => {
    const response = await fetch(`${API_URL}/notifications/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  // Delete all notifications
  deleteAllNotifications: async (token) => {
    const response = await fetch(`${API_URL}/notifications`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },
};

export const venues = [
  { id: '1', name: 'Grand Hall', image: 'https://via.placeholder.com/640x360?text=Grand+Hall' },
  { id: '2', name: 'Garden Plaza', image: 'https://via.placeholder.com/640x360?text=Garden+Plaza' },
  { id: '3', name: 'Skyline Roof', image: 'https://via.placeholder.com/640x360?text=Skyline+Roof' }
];

export function getVenues() {
  return venues;
}

export function getVenueById(id) {
  return venues.find(v => v.id === id);
}
