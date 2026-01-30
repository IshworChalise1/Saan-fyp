import mongoose from 'mongoose';
import dotenv from 'dotenv';
import config from './config/config.js';
import Venue from './models/Venue.js';
import VenueRegistration from './models/VenueRegistration.js';
import User from './models/User.js';

dotenv.config();

async function migrateApprovedVenues() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    console.log('✓ Connected to MongoDB\n');

    // Find all approved registrations without venues
    const approvedRegistrations = await VenueRegistration.find({ 
      registrationStatus: 'APPROVED',
      venue: { $exists: false }
    }).populate('owner', 'name email');

    console.log(`Found ${approvedRegistrations.length} approved registrations without venues\n`);

    if (approvedRegistrations.length === 0) {
      console.log('✓ All approved registrations already have venues!');
      await mongoose.disconnect();
      return;
    }

    // Create venues for each approved registration
    let created = 0;
    for (const registration of approvedRegistrations) {
      try {
        console.log(`Processing: ${registration.venueName}...`);
        
        // Extract images
        const venueImages = registration.venueImages?.map(img => img.url) || [];
        
        // Create venue
        const venueData = {
          name: registration.venueName || 'New Venue',
          type: 'banquet',
          city: registration.location?.district || 'Kathmandu',
          address: `${registration.location?.street || ''}, Ward ${registration.location?.wardNo || ''}, ${registration.location?.municipality || ''}`,
          capacity: 500,
          pricePerDay: 1500,
          description: `Beautiful ${registration.venueName} located in ${registration.location?.municipality || ''}. Perfect for weddings, corporate events, and celebrations.`,
          amenities: ['AC', 'Parking', 'Catering', 'WiFi', 'Sound System'],
          owner: registration.owner._id,
          images: venueImages,
          phone: registration.phone,
          isApproved: true
        };

        const newVenue = await Venue.create(venueData);
        console.log(`  ✓ Venue created: ${newVenue._id}`);
        
        // Update registration with venue reference
        await VenueRegistration.findByIdAndUpdate(registration._id, {
          $set: { venue: newVenue._id }
        });
        console.log(`  ✓ Registration updated with venue reference\n`);
        
        created++;
      } catch (error) {
        console.error(`  ✗ Error processing ${registration.venueName}:`, error.message);
      }
    }

    console.log(`\n✅ Migration complete! Created ${created} venues`);

    // Verify results
    console.log('\n=== VERIFICATION ===');
    const allVenues = await Venue.find({}).select('name city isApproved');
    console.log(`Total venues in database: ${allVenues.length}`);
    console.log(JSON.stringify(allVenues, null, 2));

    await mongoose.disconnect();
    console.log('\n✓ Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

migrateApprovedVenues();
