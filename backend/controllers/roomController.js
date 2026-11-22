const { StorageService } = require('../config/db');

// Helper to check date overlap
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
    const { checkIn, checkOut } = req.query;
    const rooms = await StorageService.getAllRooms();
    const bookings = await StorageService.getAllBookings();

    // Map each room with dynamic status
    const roomsWithStatus = rooms.map((room) => {
      if (room.isMaintenance) {
        return {
          ...room,
          status: 'Maintenance',
          activeBooking: null,
        };
      }

      // Filter bookings for this room
      const roomBookings = bookings.filter(
        (b) => b.roomNumber === room.roomNumber && b.status !== 'REJECTED'
      );

      let matchedBooking = null;

      if (checkIn && checkOut) {
        // Date-specific availability check
        matchedBooking = roomBookings.find((b) =>
          datesOverlap(checkIn, checkOut, b.checkIn, b.checkOut)
        );
      } else {
        // General active booking check (any active or upcoming/pending booking)
        matchedBooking = roomBookings[0] || null;
      }

      let status = 'Available';
      if (matchedBooking) {
        if (matchedBooking.status === 'PAID') {
          status = 'Booked';
        } else if (
          matchedBooking.status === 'PENDING_APPROVAL' ||
          matchedBooking.status === 'APPROVED'
        ) {
          status = 'Pending Approval';
        }
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
