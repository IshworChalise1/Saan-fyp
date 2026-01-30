import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config/config.js';

// Load environment variables
dotenv.config();

// ES Module dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import authRoute from './route/authRoute.js';
import venueRoute from './route/venueRoute.js';
import bookingRoute from './route/bookingRoute.js';
import otpRoutes from './route/otpRoutes.js';
import venueRegistrationRoute from './route/venueRegistrationRoute.js';
import notificationRoute from './route/notificationRoute.js';
import contactRoute from './route/contactRoute.js';
import menuRoute from './route/menuRoute.js';
import packageRoute from './route/packageRoute.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose
  .connect(config.mongoUri)
  .then(() => {
    console.log('✓ Connected to MongoDB');
  })
  .catch((error) => {
    console.error('✗ MongoDB connection error:', error);
    process.exit(1);
  });

// Health check route
app.get('/', (req, res) => {
  res.json({
    message: 'SAN - Venue Booking System API',
    version: '1.0.0',
    status: 'running'
  });
});

// Routes
app.use('/api/auth', authRoute);
app.use('/api/venues', venueRoute);
app.use('/api/bookings', bookingRoute);
app.use('/api/otp', otpRoutes);
app.use('/api/venue-registration', venueRegistrationRoute);
app.use('/api/notifications', notificationRoute);
app.use('/api/contact', contactRoute);
app.use('/api/menus', menuRoute);
app.use('/api/packages', packageRoute);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error'
  });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
  console.log(`Environment: ${config.nodeEnv}\n`);
});