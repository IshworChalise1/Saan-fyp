import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import config from './config/config.js';
import User from './models/User.js';

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    console.log('✓ Connected to MongoDB');

    // Clear existing users (optional - remove this if you want to keep existing data)
    // await User.deleteMany({});
    // console.log('✓ Cleared existing users');

    // Test users data
    const users = [
      {
        name: 'Test User',
        email: 'user@gmail.com',
        password: 'user@123',
        role: 'user'
      },
      {
        name: 'Test Venue Owner',
        email: 'venue@gmail.com',
        password: 'venue@123',
        role: 'venue-owner'
      },
      {
        name: 'Test Admin',
        email: 'admin@saan.com',
        password: 'admin@123',
        role: 'admin'
      }
    ];

    // Hash passwords and create users
    for (const userData of users) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`⚠ User with email ${userData.email} already exists. Skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcryptjs.hash(userData.password, 10);

      // Create user
      const user = await User.create({
        ...userData,
        password: hashedPassword
      });

      console.log(`✓ Created ${userData.role} user: ${userData.email}`);
    }

    console.log('\n✓ Test users seeded successfully!');
    console.log('\nTest Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('User Account:');
    console.log('  Email: user@gmail.com');
    console.log('  Password: user@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Venue Owner Account:');
    console.log('  Email: venue@gmail.com');
    console.log('  Password: venue@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin Account:');
    console.log('  Email: admin@saan.com');
    console.log('  Password: admin@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.connection.close();
    console.log('✓ MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding users:', error.message);
    process.exit(1);
  }
};

// Run the seed function
seedUsers();
