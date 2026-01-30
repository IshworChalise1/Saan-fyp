import Package from '../models/Package.js';
import Venue from '../models/Venue.js';

// Create a new package
export const createPackage = async (req, res) => {
  try {
    const { venueId } = req.params;
    const { name, description, type, basePrice, features, maxGuestCapacity, minGuestCapacity, includedMenus } = req.body;

    // Verify venue exists and belongs to user
    const venue = await Venue.findById(venueId);
    if (!venue) {
      return res.status(404).json({
        success: false,
        message: 'Venue not found'
      });
    }

    if (venue.owner.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add package to this venue'
      });
    }

    const pkg = await Package.create({
      venue: venueId,
      owner: req.userId,
      name,
      description,
      type: type || 'standard',
      basePrice,
      features: features || [],
      maxGuestCapacity,
      minGuestCapacity: minGuestCapacity || 1,
      includedMenus: includedMenus || []
    });

    res.status(201).json({
      success: true,
      message: 'Package created successfully',
      package: pkg
    });
  } catch (error) {
    console.error('Create package error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating package',
      error: error.message
    });
  }
};

// Get all packages for a venue
export const getVenuePackages = async (req, res) => {
  try {
    const { venueId } = req.params;

    const packages = await Package.find({ venue: venueId })
      .populate('owner', 'name email')
      .populate('includedMenus');

    res.status(200).json({
      success: true,
      count: packages.length,
      packages
    });
  } catch (error) {
    console.error('Get packages error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching packages',
      error: error.message
    });
  }
};

// Get single package
export const getPackage = async (req, res) => {
  try {
    const { packageId } = req.params;

    const pkg = await Package.findById(packageId)
      .populate('owner', 'name email')
      .populate('includedMenus');

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    res.status(200).json({
      success: true,
      package: pkg
    });
  } catch (error) {
    console.error('Get package error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching package',
      error: error.message
    });
  }
};

// Update package
export const updatePackage = async (req, res) => {
  try {
    const { packageId } = req.params;
    const { name, description, type, basePrice, features, maxGuestCapacity, minGuestCapacity, includedMenus, isActive } = req.body;

    let pkg = await Package.findById(packageId);

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    // Check authorization
    if (pkg.owner.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this package'
      });
    }

    // Update fields
    if (name) pkg.name = name;
    if (description) pkg.description = description;
    if (type) pkg.type = type;
    if (basePrice !== undefined) pkg.basePrice = basePrice;
    if (features) pkg.features = features;
    if (maxGuestCapacity) pkg.maxGuestCapacity = maxGuestCapacity;
    if (minGuestCapacity) pkg.minGuestCapacity = minGuestCapacity;
    if (includedMenus) pkg.includedMenus = includedMenus;
    if (isActive !== undefined) pkg.isActive = isActive;
    pkg.updatedAt = new Date();

    await pkg.save();

    res.status(200).json({
      success: true,
      message: 'Package updated successfully',
      package: pkg
    });
  } catch (error) {
    console.error('Update package error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating package',
      error: error.message
    });
  }
};

// Delete package
export const deletePackage = async (req, res) => {
  try {
    const { packageId } = req.params;

    const pkg = await Package.findById(packageId);

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    // Check authorization
    if (pkg.owner.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this package'
      });
    }

    await Package.findByIdAndDelete(packageId);

    res.status(200).json({
      success: true,
      message: 'Package deleted successfully'
    });
  } catch (error) {
    console.error('Delete package error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting package',
      error: error.message
    });
  }
};
