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
      default: 'AC Executive Suite',
    },
    pricePerNight: {
      type: Number,
      default: 1200,
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
