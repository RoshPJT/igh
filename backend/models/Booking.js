const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
    },
    guestType: {
      type: String,
      required: true,
      enum: ['Student', 'Parent', 'Alumni', 'Other College Guest'],
    },
    guestDetails: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    roomNumber: {
      type: Number,
      required: true,
    },
    checkIn: {
      type: String, // Can store ISO string or date
      required: true,
    },
    checkOut: {
      type: String,
      required: true,
    },
    nights: {
      type: Number,
      required: true,
      min: 1,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING_APPROVAL', 'APPROVED', 'PAID', 'REJECTED'],
      default: 'PENDING_APPROVAL',
    },
    paymentStatus: {
      type: String,
      enum: ['UNPAID', 'PAID'],
      default: 'UNPAID',
    },
    approvalNotes: {
      type: String,
      default: '',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
