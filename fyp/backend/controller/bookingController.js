import Booking from '../models/Booking.js';
import Venue from '../models/Venue.js';

// Create booking (user only)
export const createBooking = async (req, res) => {
  try {
    if (req.userRole !== 'user') {
      return res.status(403).json({
        success: false,
        message: 'Only users can create bookings'
      });
    }

    const { venueId, eventDate, numberOfGuests, eventType, specialRequests } = req.body;

    // Check if venue exists
    const venue = await Venue.findById(venueId);
    if (!venue) {
      return res.status(404).json({
        success: false,
        message: 'Venue not found'
      });
    }

    const totalPrice = venue.pricePerDay || 0;

    const booking = await Booking.create({
      user: req.userId,
      venue: venueId,
      eventDate,
      numberOfGuests,
      eventType,
      specialRequests,
      totalPrice,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully. Awaiting venue owner confirmation.',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
};

// Get my bookings (user only)
export const getMyBookings = async (req, res) => {
  try {
    if (req.userRole !== 'user') {
      return res.status(403).json({
        success: false,
        message: 'Only users can view their bookings'
      });
    }

    const bookings = await Booking.find({ user: req.userId })
      .populate('venue', 'name city type')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    console.error('Get my bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

// Get bookings for my venue (venue owner only)
export const getVenueBookings = async (req, res) => {
  try {
    if (req.userRole !== 'venue-owner') {
      return res.status(403).json({
        success: false,
        message: 'Only venue owners can view bookings for their venues'
      });
    }

    const venueId = req.params.venueId;

    // Check if venue belongs to this owner
    const venue = await Venue.findOne({ _id: venueId, owner: req.userId });
    if (!venue) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view bookings for this venue'
      });
    }

    const bookings = await Booking.find({ venue: venueId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    console.error('Get venue bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

// Update booking status (venue owner only)
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const bookingId = req.params.id;

    // Validate status
    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking status'
      });
    }

    const booking = await Booking.findById(bookingId).populate('venue');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns the venue
    if (booking.venue.owner.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this booking'
      });
    }

    booking.status = status;
    booking.updatedAt = Date.now();
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      booking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating booking',
      error: error.message
    });
  }
};

// Admin: Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admin can view all bookings'
      });
    }

    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('venue', 'name city')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

// Cancel booking (user only)
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns the booking
    if (booking.user.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    booking.status = 'cancelled';
    booking.updatedAt = Date.now();
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message
    });
  }
};
