const express = require('express');
const router = express.Router();
const {
  createBooking,
  getAllBookings,
  getBookingById,
  approveBooking,
  rejectBooking,
  cancelBooking,
  modifyBooking,
  payBooking,
  requestOtp,
  verifyOtpAndGetBookings,
  getDiningCapacity,
  reserveDining,
} = require('../controllers/bookingController');

// Dedicated sub-routes before :id
router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtpAndGetBookings);
router.get('/dining/capacity', getDiningCapacity);
router.post('/dining/reserve', reserveDining);

router.post('/', createBooking);
router.get('/', getAllBookings);
router.get('/:id', getBookingById);
router.put('/:id/approve', approveBooking);
router.put('/:id/reject', rejectBooking);
router.put('/:id/cancel', cancelBooking);
router.put('/:id/modify', modifyBooking);
router.put('/:id/pay', payBooking);

module.exports = router;
