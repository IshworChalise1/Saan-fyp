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
