import express from 'express';
import {
  createVenue,
  getApprovedVenues,
  getMyVenues,
  getVenue,
  updateVenue,
  getAllVenues,
  approveVenue,
  deleteVenue
} from '../controller/venueController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/approved', getApprovedVenues);
router.get('/:id', getVenue);

// Protected routes for venue owners
router.post('/', authenticate, authorize(['venue-owner']), createVenue);
router.get('/owner/my-venues', authenticate, authorize(['venue-owner']), getMyVenues);
router.put('/:id', authenticate, authorize(['venue-owner', 'admin']), updateVenue);

// Admin routes
router.get('/', authenticate, authorize(['admin']), getAllVenues);
router.put('/:id/approve', authenticate, authorize(['admin']), approveVenue);
router.delete('/:id', authenticate, authorize(['admin']), deleteVenue);

export default router;
