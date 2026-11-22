const { StorageService } = require('../config/db');

// POST /api/complaints - Register a new complaint
async function createComplaint(req, res) {
  try {
    const { roomNumber, guestName, bookingId, issueDescription, category, priority } = req.body;

    if (!roomNumber || !issueDescription) {
      return res.status(400).json({
        success: false,
        message: 'Room number and issue description are required to submit a complaint.',
      });
    }

    const complaint = await StorageService.createComplaint({
      roomNumber: Number(roomNumber),
      guestName: guestName || 'Guest',
      bookingId: bookingId || '',
      issueDescription,
      category: category || 'General',
      priority: priority || 'MEDIUM',
    });

    res.status(201).json({
      success: true,
      message: `Complaint ticket ${complaint.complaintId} has been registered successfully. Our facility maintenance team has been alerted.`,
      data: complaint,
    });
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ success: false, message: 'Server error registering complaint' });
  }
}

// GET /api/complaints - Get all complaints (with optional status or roomNumber filter)
async function getAllComplaints(req, res) {
  try {
    const { status, roomNumber } = req.query;
    const complaints = await StorageService.getAllComplaints({ status, roomNumber });

    res.json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ success: false, message: 'Server error fetching complaints' });
  }
}

// GET /api/complaints/:id - Get specific complaint
async function getComplaintById(req, res) {
  try {
    const { id } = req.params;
    const complaint = await StorageService.getComplaintById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `Complaint ticket ${id} not found`,
      });
    }

    res.json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    console.error('Error fetching complaint:', error);
    res.status(500).json({ success: false, message: 'Server error fetching complaint' });
  }
}

// PUT /api/complaints/:id/status - Update complaint status / admin notes
async function updateComplaintStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, adminNotes, priority } = req.body;

    const complaint = await StorageService.getComplaintById(id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: `Complaint ${id} not found` });
    }

    const updates = {};
    if (status) updates.status = status;
    if (adminNotes !== undefined) updates.adminNotes = adminNotes;
    if (priority) updates.priority = priority;

    const updated = await StorageService.updateComplaint(complaint.complaintId, updates);

    res.json({
      success: true,
      message: `Complaint ${complaint.complaintId} updated successfully.`,
      data: updated,
    });
  } catch (error) {
    console.error('Error updating complaint status:', error);
    res.status(500).json({ success: false, message: 'Server error updating complaint' });
  }
}

module.exports = {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,
};
