const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    floor: {
      type: Number,
      required: true,
      enum: [1, 2],
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Small Room',
        'Small Double-Bedded Regular Room',
        'Large Double-Bedded Room',
        'University Guest Suite',
      ],
      default: 'Large Double-Bedded Room',
    },
    pricePerNight: {
      type: Number,
      default: 1200,
    },
    priceDouble: {
      type: Number,
      default: 1200,
    },
    maxOccupancy: {
      type: Number,
      default: 2,
    },
    isRestricted: {
      type: Boolean,
      default: false,
    },
    restrictionType: {
      type: String,
      enum: ['NONE', 'STAFF', 'UNIVERSITY_GUEST'],
      default: 'NONE',
    },
    restrictionLabel: {
      type: String,
      default: '',
    },
    isMaintenance: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Room', roomSchema);
