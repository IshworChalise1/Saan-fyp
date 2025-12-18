import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  venue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue',
    required: true
  },
  eventDate: {
    type: Date,
    required: true
  },
  numberOfGuests: {
    type: Number,
    required: true
  },
  eventType: {
    type: String,
    required: true,
    trim: true
  },
  specialRequests: {
    type: String,
    trim: true
  },
  totalPrice: {
    type: Number
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
