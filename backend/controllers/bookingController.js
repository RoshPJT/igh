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
    const {
      guestType,
      guestDetails,
      roomNumber,
      checkIn,
      checkOut,
      guestCount = 2,
      instantConfirm,
      diningOption,
    } = req.body;

    // 1. Validation of required fields
    if (!guestType || !guestDetails || !roomNumber || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: guestType, guestDetails, roomNumber, checkIn, checkOut',
      });
    }

    // 2. Room lookup and restriction checks (Part 1 & Part 2)
    const room = await StorageService.getRoomByNumber(roomNumber);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: `Room ${roomNumber} does not exist in the guest house.`,
      });
    }

    if (room.isRestricted) {
      return res.status(403).json({
        success: false,
        message: `Room ${roomNumber} is permanently restricted (${room.restrictionLabel || 'Staff/University Guest Reserved'}) and cannot be booked publicly.`,
      });
    }

    if (room.isMaintenance) {
      return res.status(400).json({
        success: false,
        message: `Room ${roomNumber} is currently under maintenance and unavailable for booking.`,
      });
    }

    // 3. Maximum 7 nights duration check (Part 7)
    const nights = calculateNights(checkIn, checkOut);
    if (nights > 7) {
      return res.status(400).json({
        success: false,
        message: 'Maximum stay duration allowed is 7 nights. Please adjust your check-out date.',
      });
    }
    if (nights < 1) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be strictly after Check-in date.',
      });
    }

    // 4. Maximum 2 guests per room occupancy limit (Part 9)
    const totalGuests = Number(guestCount) || Number(guestDetails?.guestCount) || 1;
    if (totalGuests > 2) {
      return res.status(400).json({
        success: false,
        message: 'Maximum room occupancy is 2 guests per suite. Additional rooms must be booked for more guests.',
      });
    }

    // 5. Backend Room Availability Revalidation (Exclusive Checkout: 12 PM turnaround)
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
        message: `Room ${roomNumber} was just booked or is unavailable for the selected dates (${checkIn} to ${checkOut}). Please select another room.`,
      });
    }

    // 6. Backend Financial Calculation & 5% GST (Part 10)
    // Rate depends strictly on actual room category from database
    const pricePerNight = room.pricePerNight || 1200;
    const ratePerNight = pricePerNight;
    const roomBaseAmount = nights * pricePerNight;
    const gstRate = 0.05; // 5% GST on room charges
    const gstAmount = Math.round(roomBaseAmount * gstRate * 100) / 100;
    const totalAmount = Math.round((roomBaseAmount + gstAmount) * 100) / 100;

    // 7. Visible Booking Reference using Registered 10-Digit Mobile Number (Part 6)
    const rawPhone = String(guestDetails.phone || '').trim();
    const referencePhone = rawPhone.replace(/\D/g, '').slice(-10);

    const initialStatus = instantConfirm ? 'APPROVED' : 'PENDING_APPROVAL';

    const newBooking = await StorageService.createBooking({
      guestType,
      guestDetails: {
        ...guestDetails,
        guestCount: totalGuests,
        phone: rawPhone,
      },
      referencePhone, // Visible Reference for guest lookup
      roomNumber: Number(roomNumber),
      roomCategory: room.category,
      floor: room.floor,
      checkIn,
      checkOut,
      nights,
      guestCount: totalGuests,
      priceBreakdown: {
        ratePerNight,
        nights,
        roomBaseAmount,
        gstRate,
        gstAmount,
        totalAmount,
      },
      amount: totalAmount,
      status: initialStatus,
      approvalNotes: instantConfirm ? 'Fast-tracked booking generated via AI Booking Agent.' : '',
    });

    res.status(201).json({
      success: true,
      message: instantConfirm
        ? 'Booking reserved successfully! You can now proceed to payment.'
        : 'Booking request submitted successfully. Pending Warden approval.',
      data: newBooking,
      referencePhone,
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

// POST /api/bookings/request-otp - Request OTP for mobile booking lookup (Part 6)
async function requestOtp(req, res) {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Mobile number is required' });
    }

    const result = StorageService.requestBookingOtp(phone);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

// POST /api/bookings/verify-otp - Verify OTP and retrieve bookings (Part 6)
async function verifyOtpAndGetBookings(req, res) {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Mobile number and OTP are required' });
    }

    const isValid = StorageService.verifyBookingOtp(phone, otp);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid or expired OTP. Please try again.' });
    }

    const bookings = await StorageService.getBookingsByPhone(phone);
    res.json({
      success: true,
      message: 'Mobile number verified successfully.',
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// GET /api/bookings/dining - Get dining capacity for date (Part 8)
async function getDiningCapacity(req, res) {
  try {
    const { date } = req.query;
    const capacity = await StorageService.getDiningCapacity(date);
    res.json({ success: true, data: capacity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// POST /api/bookings/dining/reserve - Reserve dining session (Part 8: max 56)
async function reserveDining(req, res) {
  try {
    const { date, mealSession, guests, bookingId, guestName, diet } = req.body;
    const result = await StorageService.reserveDining({
      date,
      mealSession,
      guests,
      bookingId,
      guestName,
      diet,
    });
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
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
  requestOtp,
  verifyOtpAndGetBookings,
  getDiningCapacity,
  reserveDining,
};
