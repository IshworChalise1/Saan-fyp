import Booking from '../models/Booking.js';
import Venue from '../models/Venue.js';
import User from '../models/User.js';
import { sendEmail } from '../config/mailer.js';

// Create booking (user only)
export const createBooking = async (req, res) => {
  try {
    if (req.userRole !== 'user') {
      return res.status(403).json({
        success: false,
        message: 'Only users can create bookings'
      });
    }

    const { 
      venueId, 
      eventDate, 
      numberOfGuests, 
      eventType, 
      specialRequests,
      selectedMenuItems,
      selectedPackage,
      selectedAddOns,
      totalPrice
    } = req.body;

    // Check if venue exists
    const venue = await Venue.findById(venueId).populate('owner');
    if (!venue) {
      return res.status(404).json({
        success: false,
        message: 'Venue not found'
      });
    }

    // Get current user details
    const user = await User.findById(req.userId);

    const booking = await Booking.create({
      user: req.userId,
      venue: venueId,
      eventDate,
      numberOfGuests,
      eventType,
      selectedMenuItems: selectedMenuItems || [],
      selectedPackage: selectedPackage || {},
      selectedAddOns: selectedAddOns || {},
      specialRequests,
      totalPrice: totalPrice || (venue.pricePerPlate || 0),
      status: 'pending'
    });

    // Send email to venue owner
    try {
      if (venue.owner && venue.owner.email) {
        // Build menu items list for email
        let menuItemsHtml = '';
        if (selectedMenuItems && selectedMenuItems.length > 0) {
          menuItemsHtml = '<h3 style="color: #5d0f0f; margin-top: 15px;">📋 Selected Menu Items:</h3><ul style="margin: 10px 0;">';
          selectedMenuItems.forEach(item => {
            menuItemsHtml += `<li>${item.itemName} (${item.quantity}x) - ₹${item.price * item.quantity}</li>`;
          });
          menuItemsHtml += '</ul>';
        }

        // Build package info for email
        let packageHtml = '';
        if (selectedPackage && selectedPackage.packageName) {
          packageHtml = `<h3 style="color: #5d0f0f; margin-top: 15px;">📦 Package:</h3>
          <p>${selectedPackage.packageName} (${selectedPackage.packageType}) - ₹${selectedPackage.basePrice}</p>`;
        }

        // Build add-ons for email
        let addOnsHtml = '';
        if (selectedAddOns) {
          const addOnsArray = [];
          if (selectedAddOns.decoration && selectedAddOns.decoration.enabled) {
            addOnsArray.push(`🎨 Decoration - ₹${selectedAddOns.decoration.price}`);
          }
          if (selectedAddOns.soundSystem && selectedAddOns.soundSystem.enabled) {
            addOnsArray.push(`🔊 Sound System - ₹${selectedAddOns.soundSystem.price}`);
          }
          if (selectedAddOns.bartender && selectedAddOns.bartender.enabled) {
            addOnsArray.push(`🍸 Bartender - ₹${selectedAddOns.bartender.price}`);
          }
          
          if (addOnsArray.length > 0) {
            addOnsHtml = '<h3 style="color: #5d0f0f; margin-top: 15px;">➕ Additional Services:</h3><ul style="margin: 10px 0;">';
            addOnsArray.forEach(addOn => {
              addOnsHtml += `<li>${addOn}</li>`;
            });
            addOnsHtml += '</ul>';
          }
        }

        const emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #5d0f0f; color: white; padding: 20px; text-align: center;">
              <h2>🎉 New Booking Request!</h2>
            </div>
            
            <div style="padding: 20px; background-color: #f9f9f9;">
              <h3 style="color: #5d0f0f;">Booking Details</h3>
              
              <p><strong>Venue:</strong> ${venue.name}</p>
              <p><strong>Customer Name:</strong> ${user.firstName} ${user.lastName}</p>
              <p><strong>Customer Email:</strong> ${user.email}</p>
              <p><strong>Customer Phone:</strong> ${user.phone || 'Not provided'}</p>
              
              <h3 style="color: #5d0f0f; margin-top: 15px;">📅 Event Details</h3>
              <p><strong>Event Date:</strong> ${new Date(eventDate).toLocaleDateString()}</p>
              <p><strong>Event Type:</strong> ${eventType}</p>
              <p><strong>Number of Guests:</strong> ${numberOfGuests}</p>
              
              ${menuItemsHtml}
              ${packageHtml}
              ${addOnsHtml}
              
              ${specialRequests ? `<h3 style="color: #5d0f0f; margin-top: 15px;">📝 Special Requests:</h3><p>${specialRequests}</p>` : ''}
              
              <h3 style="color: #5d0f0f; margin-top: 15px;">💰 Total Price: ₹${totalPrice}</h3>
              
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
                <p><strong>Status:</strong> <span style="color: orange; font-weight: bold;">Pending</span></p>
                <p>Please log in to your dashboard to review and confirm/reject this booking.</p>
              </div>
            </div>
            
            <div style="background-color: #5d0f0f; color: white; padding: 15px; text-align: center;">
              <p style="margin: 0;">© SAAN - Venue Management System</p>
            </div>
          </div>
        `;

        await sendEmail(
          venue.owner.email,
          `New Booking Request for ${venue.name}`,
          emailContent
        );
      }
    } catch (emailError) {
      console.error('Error sending email to venue owner:', emailError);
      // Don't fail the booking if email fails
    }

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
