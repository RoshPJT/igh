const { StorageService } = require('../config/db');
const { queryKnowledgeBase } = require('./knowledgeBase');

// Helper for date overlap
function datesOverlap(startA, endA, startB, endB) {
  const sA = new Date(startA).getTime();
  const eA = new Date(endA).getTime();
  const sB = new Date(startB).getTime();
  const eB = new Date(endB).getTime();
  return sA < eB && eA > sB;
}

// Helper to calculate nights
function calculateNights(checkIn, checkOut) {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
}

const tools = {
  // 1. check_availability
  async check_availability({ checkIn, checkOut, floor, category }) {
    if (!checkIn || !checkOut) {
      return {
        success: false,
        message: 'Both check-in and check-out dates are required to check room availability.',
      };
    }

    const rooms = await StorageService.getAllRooms();
    const bookings = await StorageService.getAllBookings();

    const availableRooms = rooms.filter((room) => {
      if (room.isRestricted) return false; // Never show restricted university rooms for public bookings (Part 1 & Part 11)
      if (room.isMaintenance) return false;
      if (floor && room.floor !== Number(floor)) return false;

      // Check conflict with active bookings
      const isConflict = bookings.some((b) => {
        if (b.roomNumber !== room.roomNumber || b.status === 'REJECTED' || b.status === 'CANCELLED') {
          return false;
        }
        return datesOverlap(checkIn, checkOut, b.checkIn, b.checkOut);
      });

      return !isConflict;
    });

    const nights = calculateNights(checkIn, checkOut);

    return {
      success: true,
      checkIn,
      checkOut,
      nights,
      totalAvailable: availableRooms.length,
      rooms: availableRooms.map((r) => {
        const base = nights * (r.pricePerNight || 1200);
        const gst = Math.round(base * 0.05 * 100) / 100;
        return {
          roomNumber: r.roomNumber,
          floor: r.floor,
          category: r.category,
          pricePerNight: r.pricePerNight,
          priceDouble: r.priceDouble || r.pricePerNight,
          baseTotal: base,
          gst5Percent: gst,
          totalWithGST: base + gst,
          maxOccupancy: 2,
          amenities: ['Air Conditioning', 'High-Speed Wi-Fi', 'Smart TV', 'Geyser Hot Water', 'Work Desk'],
        };
      }),
    };
  },

  // 2. get_room_details
  async get_room_details({ roomNumber }) {
    const room = await StorageService.getRoomByNumber(roomNumber);
    if (!room) {
      return { success: false, message: `Room ${roomNumber} does not exist.` };
    }

    return {
      success: true,
      roomNumber: room.roomNumber,
      floor: room.floor,
      category: room.category || 'AC Executive Suite',
      pricePerNight: room.pricePerNight || 1200,
      isMaintenance: !!room.isMaintenance,
      amenities: [
        'Split Air Conditioning',
        'Campus High-Speed Wi-Fi',
        '43" Smart LED TV',
        'Geyser 24x7 Hot Water',
        'Dedicated Study/Work Desk',
        'Tea/Coffee Maker',
      ],
    };
  },

  // 3. get_room_price
  async get_room_price({ checkIn, checkOut, roomNumber, guestCount = 2 }) {
    const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 1;
    let rate = 1200;
    let category = 'Room';

    if (roomNumber) {
      const room = await StorageService.getRoomByNumber(roomNumber);
      if (room) {
        rate = Number(guestCount) === 1 && room.pricePerNight ? room.pricePerNight : (room.priceDouble || room.pricePerNight || 1200);
        category = room.category;
      }
    }

    const baseAmount = nights * rate;
    const gstRate = 0.05;
    const gstAmount = Math.round(baseAmount * gstRate * 100) / 100;
    const totalAmount = Math.round((baseAmount + gstAmount) * 100) / 100;

    return {
      success: true,
      roomNumber: roomNumber || null,
      category,
      ratePerNight: rate,
      nights,
      baseAmount,
      gstRate: '5%',
      gstAmount,
      totalAmount,
      currency: 'INR (₹)',
    };
  },

  // 4. create_booking (Part 11 Compliant)
  async create_booking({ guestType, guestDetails, roomNumber, checkIn, checkOut, guestCount = 2, instantConfirm = true }) {
    if (!guestType || !guestDetails || !roomNumber || !checkIn || !checkOut) {
      return {
        success: false,
        message: 'Missing required booking information. Please provide guestType, guestDetails, roomNumber, checkIn, and checkOut.',
      };
    }

    const room = await StorageService.getRoomByNumber(roomNumber);
    if (!room) {
      return { success: false, message: `Room ${roomNumber} does not exist.` };
    }

    // Part 1 & 11: Enforce room restrictions
    if (room.isRestricted) {
      return {
        success: false,
        message: `Room ${roomNumber} is permanently restricted (${room.restrictionLabel || 'Staff/University Guest Reserved'}) and cannot be booked publicly.`,
      };
    }

    if (room.isMaintenance) {
      return { success: false, message: `Room ${roomNumber} is currently under maintenance.` };
    }

    // Part 7: Maximum 7 nights duration check
    const nights = calculateNights(checkIn, checkOut);
    if (nights > 7) {
      return {
        success: false,
        message: 'Maximum stay duration allowed is 7 nights. Please adjust your check-out date.',
      };
    }

    // Part 9: Maximum 2 guests per room occupancy limit
    const totalGuests = Number(guestCount) || Number(guestDetails?.guestCount) || 1;
    if (totalGuests > 2) {
      return {
        success: false,
        message: 'Maximum room occupancy is 2 guests per suite.',
      };
    }

    // Revalidate backend availability immediately before booking
    const bookings = await StorageService.getAllBookings();
    const isConflict = bookings.some((b) => {
      if (b.roomNumber !== Number(roomNumber) || b.status === 'REJECTED' || b.status === 'CANCELLED') {
        return false;
      }
      return datesOverlap(checkIn, checkOut, b.checkIn, b.checkOut);
    });

    if (isConflict) {
      return {
        success: false,
        message: `Room ${roomNumber} was just reserved for the selected dates. Please choose another available room.`,
      };
    }

    // Backend financial calculations with 5% GST
    const ratePerNight = room.pricePerNight || 1200;
    const roomBaseAmount = nights * ratePerNight;
    const gstRate = 0.05;
    const gstAmount = Math.round(roomBaseAmount * gstRate * 100) / 100;
    const totalAmount = Math.round((roomBaseAmount + gstAmount) * 100) / 100;

    const rawPhone = String(guestDetails.phone || '').trim();
    const referencePhone = rawPhone.replace(/\D/g, '').slice(-10);

    const booking = await StorageService.createBooking({
      guestType,
      guestDetails: {
        ...guestDetails,
        guestCount: totalGuests,
        phone: rawPhone,
      },
      referencePhone,
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
      status: instantConfirm ? 'APPROVED' : 'PENDING_APPROVAL',
      approvalNotes: instantConfirm ? 'Fast-tracked booking generated via AI Booking Agent.' : '',
    });

    return {
      success: true,
      bookingId: booking.bookingId,
      booking,
      referencePhone,
      message: `Reservation created successfully! Internal Booking ID: ${booking.bookingId}. Registered Reference: ${referencePhone}. Total Amount: ₹${totalAmount} (incl. 5% GST).`,
    };
  },

  // 5. modify_booking
  async modify_booking({ bookingId, newCheckIn, newCheckOut, newRoomNumber }) {
    const booking = await StorageService.getBookingByIdOrCode(bookingId);
    if (!booking) {
      return { success: false, message: `Booking ${bookingId} not found.` };
    }

    if (booking.status === 'CANCELLED' || booking.status === 'REJECTED') {
      return { success: false, message: `Cannot modify a ${booking.status} booking.` };
    }

    const targetRoomNumber = newRoomNumber ? Number(newRoomNumber) : booking.roomNumber;
    const targetCheckIn = newCheckIn || booking.checkIn;
    const targetCheckOut = newCheckOut || booking.checkOut;

    // Check conflict
    const allBookings = await StorageService.getAllBookings();
    const isConflict = allBookings.some((b) => {
      if (b.bookingId.toLowerCase() === booking.bookingId.toLowerCase()) return false;
      if (b.roomNumber !== targetRoomNumber || b.status === 'REJECTED' || b.status === 'CANCELLED') return false;
      return datesOverlap(targetCheckIn, targetCheckOut, b.checkIn, b.checkOut);
    });

    if (isConflict) {
      return {
        success: false,
        message: `Room ${targetRoomNumber} is not available for ${targetCheckIn} to ${targetCheckOut}.`,
      };
    }

    const nights = calculateNights(targetCheckIn, targetCheckOut);
    const amount = nights * 1200;

    const updated = await StorageService.updateBooking(booking.bookingId, {
      roomNumber: targetRoomNumber,
      checkIn: targetCheckIn,
      checkOut: targetCheckOut,
      nights,
      amount,
    });

    return {
      success: true,
      booking: updated,
      message: `Booking ${booking.bookingId} modified. Room: ${targetRoomNumber}, Dates: ${targetCheckIn} to ${targetCheckOut} (${nights} nights, ₹${amount}).`,
    };
  },

  // 6. cancel_booking
  async cancel_booking({ bookingId, reason, confirmed = false }) {
    const booking = await StorageService.getBookingByIdOrCode(bookingId);
    if (!booking) {
      return { success: false, message: `Booking ${bookingId} not found.` };
    }

    if (booking.status === 'CANCELLED') {
      return { success: false, message: `Booking ${bookingId} is already cancelled.` };
    }

    if (!confirmed) {
      return {
        success: false,
        requiresConfirmation: true,
        bookingId: booking.bookingId,
        message: `Are you sure you want to cancel booking ${booking.bookingId} for Room ${booking.roomNumber} (${booking.checkIn} to ${booking.checkOut})? Reply 'Yes' to confirm cancellation.`,
      };
    }

    const updated = await StorageService.cancelBooking(booking.bookingId, reason || 'Cancelled by guest via conversational agent.');

    return {
      success: true,
      bookingId: booking.bookingId,
      booking: updated,
      message: `Booking ${booking.bookingId} has been successfully cancelled. Your room has been released.`,
    };
  },

  // 7. get_booking_status
  async get_booking_status({ bookingId, phone }) {
    if (bookingId) {
      const booking = await StorageService.getBookingByIdOrCode(bookingId);
      if (!booking) {
        return { success: false, message: `No booking found for ID: ${bookingId}` };
      }
      return { success: true, booking };
    }

    if (phone) {
      const allBookings = await StorageService.getAllBookings();
      const cleanPhone = phone.replace(/\D/g, '');
      const match = allBookings.find((b) => {
        const bPhone = (b.guestDetails?.phone || '').replace(/\D/g, '');
        return bPhone && (bPhone.includes(cleanPhone) || cleanPhone.includes(bPhone));
      });
      if (!match) {
        return { success: false, message: `No active booking found matching contact: ${phone}` };
      }
      return { success: true, booking: match };
    }

    return { success: false, message: 'Please provide either a Booking ID or your registered phone number.' };
  },

  // 8. initiate_payment
  async initiate_payment({ bookingId }) {
    const booking = await StorageService.getBookingByIdOrCode(bookingId);
    if (!booking) {
      return { success: false, message: `Booking ${bookingId} not found.` };
    }

    if (booking.paymentStatus === 'PAID') {
      return { success: false, message: `Booking ${bookingId} has already been paid for.` };
    }

    const orderId = `order_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    return {
      success: true,
      bookingId: booking.bookingId,
      amount: booking.amount,
      currency: 'INR',
      roomNumber: booking.roomNumber,
      orderId,
      guestName: booking.guestDetails?.name || 'Guest',
      paymentMethods: ['UPI (Google Pay, PhonePe, Paytm)', 'Credit / Debit Cards', 'NetBanking'],
    };
  },

  // 9. verify_payment
  async verify_payment({ bookingId, paymentMethod = 'UPI', transactionId }) {
    const booking = await StorageService.getBookingByIdOrCode(bookingId);
    if (!booking) {
      return { success: false, message: `Booking ${bookingId} not found.` };
    }

    const txn = transactionId || `TXN_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    const updated = await StorageService.updateBooking(booking.bookingId, {
      status: 'PAID',
      paymentStatus: 'PAID',
      paymentDetails: {
        method: paymentMethod,
        transactionId: txn,
        paidAt: new Date().toISOString(),
      },
    });

    return {
      success: true,
      booking: updated,
      transactionId: txn,
      message: `Payment of ₹${booking.amount} verified successfully! Your booking ${booking.bookingId} is confirmed.`,
    };
  },

  // 10. get_guesthouse_policy
  async get_guesthouse_policy({ topic }) {
    return queryKnowledgeBase(topic);
  },

  // 11. register_complaint
  async register_complaint({ roomNumber, guestName, bookingId, issueDescription, category, priority }) {
    if (!roomNumber || !issueDescription) {
      return {
        success: false,
        message: 'Please provide both the room number and a description of the issue.',
      };
    }

    const complaint = await StorageService.createComplaint({
      roomNumber: Number(roomNumber),
      guestName: guestName || 'Guest',
      bookingId: bookingId || '',
      issueDescription,
      category: category || 'General',
      priority: priority || 'MEDIUM',
    });

    return {
      success: true,
      complaintId: complaint.complaintId,
      complaint,
      message: `Complaint ticket ${complaint.complaintId} has been lodged. Our facility team has been notified.`,
    };
  },

  // 12. get_complaint_status
  async get_complaint_status({ complaintId }) {
    const complaint = await StorageService.getComplaintById(complaintId);
    if (!complaint) {
      return { success: false, message: `No complaint found for ID: ${complaintId}` };
    }

    return {
      success: true,
      complaint,
      message: `Complaint ${complaint.complaintId} is currently ${complaint.status}.`,
    };
  },
};

module.exports = {
  tools,
};
