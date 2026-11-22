const { StorageService } = require('../config/db');

// Helper to calculate nights between two dates
function calculateNights(checkIn, checkOut) {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
}

// Helper to check date overlap
function datesOverlap(startA, endA, startB, endB) {
  const sA = new Date(startA).getTime();
  const eA = new Date(endA).getTime();
  const sB = new Date(startB).getTime();
  const eB = new Date(endB).getTime();

  return sA < eB && eA > sB;
}

// POST /api/bookings - Create new booking
async function createBooking(req, res) {
  try {
    const { guestType, guestDetails, roomNumber, checkIn, checkOut, instantConfirm } = req.body;

    // Validation
    if (!guestType || !guestDetails || !roomNumber || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: guestType, guestDetails, roomNumber, checkIn, checkOut',
      });
    }

    const room = await StorageService.getRoomByNumber(roomNumber);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: `Room ${roomNumber} does not exist`,
      });
    }

    if (room.isMaintenance) {
      return res.status(400).json({
        success: false,
        message: `Room ${roomNumber} is currently under maintenance and cannot be booked`,
      });
    }

    // Check for existing overlapping active bookings for this room
    const allBookings = await StorageService.getAllBookings();
    const isConflict = allBookings.some((b) => {
      if (b.roomNumber !== Number(roomNumber) || b.status === 'REJECTED' || b.status === 'CANCELLED') {
        return false;
      }
      return datesOverlap(checkIn, checkOut, b.checkIn, b.checkOut);
    });

    if (isConflict) {
      return res.status(409).json({
        success: false,
        message: `Room ${roomNumber} is already booked or reserved for the selected dates. Please choose another room or change dates.`,
      });
    }

    const nights = calculateNights(checkIn, checkOut);
    const pricePerNight = room.pricePerNight || 1200;
    const amount = nights * pricePerNight;

    const initialStatus = instantConfirm ? 'APPROVED' : 'PENDING_APPROVAL';

    const newBooking = await StorageService.createBooking({
      guestType,
      guestDetails,
      roomNumber: Number(roomNumber),
      checkIn,
      checkOut,
      nights,
      amount,
      status: initialStatus,
      approvalNotes: instantConfirm ? 'Fast-tracked booking generated via AI Booking Agent.' : '',
    });

    res.status(201).json({
      success: true,
      message: instantConfirm
        ? 'Booking reserved successfully! You can now proceed to payment.'
        : 'Booking request submitted successfully. Pending Warden approval.',
      data: newBooking,
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ success: false, message: 'Server error processing booking request' });
  }
}

// GET /api/bookings - Get all bookings (for Warden Dashboard)
async function getAllBookings(req, res) {
  try {
    const { status } = req.query;
    let bookings = await StorageService.getAllBookings();

    if (status) {
      bookings = bookings.filter((b) => b.status === status.toUpperCase());
    }

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ success: false, message: 'Server error fetching bookings' });
  }
}

// GET /api/bookings/:id - Get specific booking status
async function getBookingById(req, res) {
  try {
    const { id } = req.params;
    const booking = await StorageService.getBookingByIdOrCode(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking found with ID or code: ${id}`,
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Error fetching booking details:', error);
    res.status(500).json({ success: false, message: 'Server error fetching booking details' });
  }
}

// PUT /api/bookings/:id/approve - Update status to APPROVED
async function approveBooking(req, res) {
  try {
    const { id } = req.params;
    const { approvalNotes } = req.body;

    const booking = await StorageService.getBookingByIdOrCode(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const updated = await StorageService.updateBooking(booking.bookingId, {
      status: 'APPROVED',
      approvalNotes: approvalNotes || 'Approved by BIT Mesra Guest House Warden.',
    });

    res.json({
      success: true,
      message: 'Booking approved successfully. Guest can now proceed to payment.',
      data: updated,
    });
  } catch (error) {
    console.error('Error approving booking:', error);
    res.status(500).json({ success: false, message: 'Server error approving booking' });
  }
}

// PUT /api/bookings/:id/reject - Update status to REJECTED
async function rejectBooking(req, res) {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    const booking = await StorageService.getBookingByIdOrCode(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const updated = await StorageService.updateBooking(booking.bookingId, {
      status: 'REJECTED',
      rejectionReason: rejectionReason || 'Request could not be accommodated due to institutional priority / verification issue.',
    });

    res.json({
      success: true,
      message: 'Booking rejected and room released for booking.',
      data: updated,
    });
  } catch (error) {
    console.error('Error rejecting booking:', error);
    res.status(500).json({ success: false, message: 'Server error rejecting booking' });
  }
}

// PUT /api/bookings/:id/cancel - Cancel booking
async function cancelBooking(req, res) {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await StorageService.getBookingByIdOrCode(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.status === 'CANCELLED') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
    }

    const updated = await StorageService.cancelBooking(booking.bookingId, reason || 'Cancelled by user request');

    res.json({
      success: true,
      message: `Booking ${booking.bookingId} has been successfully cancelled. The room has been released.`,
      data: updated,
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ success: false, message: 'Server error cancelling booking' });
  }
}

// PUT /api/bookings/:id/modify - Modify booking dates or room
async function modifyBooking(req, res) {
  try {
    const { id } = req.params;
    const { checkIn, checkOut, roomNumber } = req.body;

    const booking = await StorageService.getBookingByIdOrCode(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.status === 'CANCELLED' || booking.status === 'REJECTED') {
      return res.status(400).json({
        success: false,
        message: `Cannot modify a booking that is currently ${booking.status}.`,
      });
    }

    const targetRoomNumber = roomNumber ? Number(roomNumber) : booking.roomNumber;
    const targetCheckIn = checkIn || booking.checkIn;
    const targetCheckOut = checkOut || booking.checkOut;

    // Verify room existence
    const room = await StorageService.getRoomByNumber(targetRoomNumber);
    if (!room) {
      return res.status(404).json({ success: false, message: `Room ${targetRoomNumber} does not exist` });
    }

    if (room.isMaintenance) {
      return res.status(400).json({
        success: false,
        message: `Room ${targetRoomNumber} is currently under maintenance.`,
      });
    }

    // Check conflict against OTHER bookings
    const allBookings = await StorageService.getAllBookings();
    const isConflict = allBookings.some((b) => {
      if (b.bookingId.toLowerCase() === booking.bookingId.toLowerCase()) return false;
      if (b.roomNumber !== targetRoomNumber || b.status === 'REJECTED' || b.status === 'CANCELLED') return false;
      return datesOverlap(targetCheckIn, targetCheckOut, b.checkIn, b.checkOut);
    });

    if (isConflict) {
      return res.status(409).json({
        success: false,
        message: `Room ${targetRoomNumber} is not available for ${targetCheckIn} to ${targetCheckOut}. Please choose another room or date range.`,
      });
    }

    const nights = calculateNights(targetCheckIn, targetCheckOut);
    const amount = nights * (room.pricePerNight || 1200);

    const updated = await StorageService.updateBooking(booking.bookingId, {
      roomNumber: targetRoomNumber,
      checkIn: targetCheckIn,
      checkOut: targetCheckOut,
      nights,
      amount,
    });

    res.json({
      success: true,
      message: `Booking ${booking.bookingId} updated successfully. New Room: ${targetRoomNumber}, Dates: ${targetCheckIn} to ${targetCheckOut} (${nights} nights, ₹${amount}).`,
      data: updated,
    });
  } catch (error) {
    console.error('Error modifying booking:', error);
    res.status(500).json({ success: false, message: 'Server error modifying booking' });
  }
}

// PUT /api/bookings/:id/pay - Update status to PAID
async function payBooking(req, res) {
  try {
    const { id } = req.params;
    const { paymentMethod, transactionId } = req.body;

    const booking = await StorageService.getBookingByIdOrCode(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.status === 'CANCELLED') {
      return res.status(400).json({
        success: false,
        message: 'Cannot pay for a cancelled booking.',
      });
    }

    const updated = await StorageService.updateBooking(booking.bookingId, {
      status: 'PAID',
      paymentStatus: 'PAID',
      paymentDetails: {
        method: paymentMethod || 'Mock UPI / Card Gateway',
        transactionId: transactionId || `TXN_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
        paidAt: new Date().toISOString(),
      },
    });

    res.json({
      success: true,
      message: 'Payment verified successfully! Booking confirmed and room reserved.',
      data: updated,
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ success: false, message: 'Server error processing payment' });
  }
}

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  approveBooking,
  rejectBooking,
  cancelBooking,
  modifyBooking,
  payBooking,
};
