const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      required: true,
      unique: true,
    },
    roomNumber: {
      type: Number,
      required: true,
    },
    guestName: {
      type: String,
      required: true,
    },
    bookingId: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['Air Conditioning', 'Plumbing / Geyser', 'Cleanliness / Housekeeping', 'Electrical / Lights', 'Wi-Fi / Internet', 'Noise / Disturbance', 'General'],
      default: 'General',
    },
    issueDescription: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED'],
      default: 'OPEN',
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
      default: 'MEDIUM',
    },
    adminNotes: {
      type: String,
      default: '',
    },
    resolvedAt: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Complaint', complaintSchema);
