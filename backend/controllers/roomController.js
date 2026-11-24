const { StorageService } = require('../config/db');

// Helper to check date overlap (Exclusive checkout: checkout at 12 PM allows same-day checkin)
function datesOverlap(startA, endA, startB, endB) {
  const sA = new Date(startA).getTime();
  const eA = new Date(endA).getTime();
  const sB = new Date(startB).getTime();
  const eB = new Date(endB).getTime();

  return sA < eB && eA > sB;
}

// GET /api/rooms
async function getRooms(req, res) {
  try {
    const { checkIn, checkOut, forAdmin } = req.query;
    const rooms = await StorageService.getAllRooms();
    const bookings = await StorageService.getAllBookings();

    // Map each room with dynamic status matching the required 4 distinct states:
    // AVAILABLE, BOOKED, RESERVED, UNDER MAINTENANCE
    const roomsWithStatus = rooms.map((room) => {
      // 1. Permanently Restricted University Rooms
      if (room.isRestricted) {
        return {
          ...room,
          status: 'RESERVED',
          activeBooking: null,
          restrictionNotice: room.restrictionLabel || 'Reserved for Official University Accommodation',
        };
      }

      // 2. Administrative Under Maintenance
      if (room.isMaintenance) {
        return {
          ...room,
          status: 'UNDER MAINTENANCE',
          activeBooking: null,
        };
      }

      // Filter active bookings for this room
      const roomBookings = bookings.filter(
        (b) => b.roomNumber === room.roomNumber && b.status !== 'REJECTED' && b.status !== 'CANCELLED'
      );

      let matchedBooking = null;

      if (checkIn && checkOut) {
        // Date-specific availability check
        matchedBooking = roomBookings.find((b) =>
          datesOverlap(checkIn, checkOut, b.checkIn, b.checkOut)
        );
      } else {
        // General active booking check
        const today = new Date().toISOString().split('T')[0];
        matchedBooking = roomBookings.find((b) => b.checkOut >= today) || roomBookings[0] || null;
      }

      // 3. Booked / Available
      let status = 'AVAILABLE';
      if (matchedBooking) {
        status = 'BOOKED';
      }

      return {
        ...room,
        status,
        activeBooking: matchedBooking
          ? {
              bookingId: matchedBooking.bookingId,
              status: matchedBooking.status,
              guestName: matchedBooking.guestDetails?.name || 'Guest',
              checkIn: matchedBooking.checkIn,
              checkOut: matchedBooking.checkOut,
            }
          : null,
      };
    });

    res.json({
      success: true,
      count: roomsWithStatus.length,
      data: roomsWithStatus,
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ success: false, message: 'Server error fetching rooms' });
  }
}

// PUT /api/rooms/:roomNumber/maintenance
async function toggleMaintenance(req, res) {
  try {
    const { roomNumber } = req.params;
    const room = await StorageService.toggleRoomMaintenance(roomNumber);

    if (!room) {
      return res.status(404).json({ success: false, message: `Room ${roomNumber} not found` });
    }

    res.json({
      success: true,
      message: `Room ${roomNumber} maintenance status toggled to ${room.isMaintenance}`,
      data: room,
    });
  } catch (error) {
    console.error('Error toggling maintenance:', error);
    res.status(500).json({ success: false, message: 'Server error updating maintenance' });
  }
}

module.exports = {
  getRooms,
  toggleMaintenance,
};
