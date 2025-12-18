import Venue from '../models/Venue.js';
import User from '../models/User.js';

// Create venue (venue owner only)
export const createVenue = async (req, res) => {
  try {
    // Check if user is venue owner
    if (req.userRole !== 'venue-owner') {
      return res.status(403).json({
        success: false,
        message: 'Only venue owners can create venues'
      });
    }

    const { name, type, city, address, capacity, pricePerDay, description, amenities } = req.body;

    const venue = await Venue.create({
      name,
      type,
      city,
      address,
      capacity,
      pricePerDay,
      description,
      amenities: amenities || [],
      owner: req.userId,
      isApproved: false
    });

    res.status(201).json({
      success: true,
      message: 'Venue created successfully. Awaiting admin approval.',
      venue
    });
  } catch (error) {
    console.error('Create venue error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating venue',
      error: error.message
    });
  }
};

// Get all approved venues
export const getApprovedVenues = async (req, res) => {
  try {
    const venues = await Venue.find({ isApproved: true }).populate('owner', 'name email');

    res.status(200).json({
      success: true,
      count: venues.length,
      venues
    });
  } catch (error) {
    console.error('Get venues error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching venues',
      error: error.message
    });
  }
};

// Get my venues (venue owner only)
export const getMyVenues = async (req, res) => {
  try {
    if (req.userRole !== 'venue-owner') {
      return res.status(403).json({
        success: false,
        message: 'Only venue owners can view their venues'
      });
    }

    const venues = await Venue.find({ owner: req.userId });

    res.status(200).json({
      success: true,
      count: venues.length,
      venues
    });
  } catch (error) {
    console.error('Get my venues error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching venues',
      error: error.message
    });
  }
};

// Get single venue
export const getVenue = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id).populate('owner', 'name email');

    if (!venue) {
      return res.status(404).json({
        success: false,
        message: 'Venue not found'
      });
    }

    res.status(200).json({
      success: true,
      venue
    });
  } catch (error) {
    console.error('Get venue error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching venue',
      error: error.message
    });
  }
};

// Update venue (venue owner only)
export const updateVenue = async (req, res) => {
  try {
    let venue = await Venue.findById(req.params.id);

    if (!venue) {
      return res.status(404).json({
        success: false,
        message: 'Venue not found'
      });
    }

    // Check if user is venue owner
    if (venue.owner.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this venue'
      });
    }

    venue = await Venue.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Venue updated successfully',
      venue
    });
  } catch (error) {
    console.error('Update venue error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating venue',
      error: error.message
    });
  }
};

// Admin: Get all venues (approved and pending)
export const getAllVenues = async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admin can view all venues'
      });
    }

    const venues = await Venue.find().populate('owner', 'name email');

    res.status(200).json({
      success: true,
      count: venues.length,
      venues
    });
  } catch (error) {
    console.error('Get all venues error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching venues',
      error: error.message
    });
  }
};

// Admin: Approve venue
export const approveVenue = async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admin can approve venues'
      });
    }

    const venue = await Venue.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!venue) {
      return res.status(404).json({
        success: false,
        message: 'Venue not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Venue approved successfully',
      venue
    });
  } catch (error) {
    console.error('Approve venue error:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving venue',
      error: error.message
    });
  }
};

// Admin: Delete venue
export const deleteVenue = async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admin can delete venues'
      });
    }

    const venue = await Venue.findByIdAndDelete(req.params.id);

    if (!venue) {
      return res.status(404).json({
        success: false,
        message: 'Venue not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Venue deleted successfully'
    });
  } catch (error) {
    console.error('Delete venue error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting venue',
      error: error.message
    });
  }
};
