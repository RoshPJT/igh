const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Complaint = require('../models/Complaint');

const DATA_DIR = path.join(__dirname, '../data');
const ROOMS_FILE = path.join(DATA_DIR, 'rooms.json');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');
const COMPLAINTS_FILE = path.join(DATA_DIR, 'complaints.json');

let isConnected = false;

// Ensure local fallback data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Default 33 rooms generator
function generateDefaultRooms() {
  const rooms = [];
  // Floor 1: 101 to 117 (17 rooms)
  for (let i = 101; i <= 117; i++) {
    rooms.push({
      _id: `room_${i}`,
      roomNumber: i,
      floor: 1,
      category: 'AC Executive Suite',
      pricePerNight: 1200,
      isMaintenance: i === 114, // Room 114 under routine maintenance for demonstration
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  // Floor 2: 201 to 216 (16 rooms)
  for (let i = 201; i <= 216; i++) {
    rooms.push({
      _id: `room_${i}`,
      roomNumber: i,
      floor: 2,
      category: 'AC Executive Suite',
      pricePerNight: 1200,
      isMaintenance: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  return rooms;
}

// Default demo bookings
function generateDefaultBookings() {
  const today = new Date();
  const checkIn1 = new Date(today.getTime() + 86400000).toISOString().split('T')[0];
  const checkOut1 = new Date(today.getTime() + 86400000 * 3).toISOString().split('T')[0];

  const checkIn2 = new Date(today.getTime() + 86400000 * 2).toISOString().split('T')[0];
  const checkOut2 = new Date(today.getTime() + 86400000 * 4).toISOString().split('T')[0];

  const checkIn3 = new Date(today.getTime() + 86400000 * 4).toISOString().split('T')[0];
  const checkOut3 = new Date(today.getTime() + 86400000 * 6).toISOString().split('T')[0];

  return [
    {
      _id: 'booking_sample_1',
      bookingId: 'BIT-GH-1001',
      guestType: 'Student',
      guestDetails: {
        name: 'Aarav Sharma',
        email: 'aarav.sharma@bitmesra.ac.in',
        phone: '+91 98765 43210',
        rollNumber: 'BTECH/10045/22',
        department: 'Computer Science & Engineering',
        yearOfStudy: '3rd Year',
      },
      roomNumber: 102,
      checkIn: checkIn1,
      checkOut: checkOut1,
      nights: 2,
      amount: 2400,
      status: 'PAID',
      paymentStatus: 'PAID',
      paymentDetails: {
        method: 'UPI (PhonePe)',
        transactionId: 'TXN_BIT_98472819',
        paidAt: new Date().toISOString(),
      },
      approvalNotes: 'Approved by Warden. Verified student roll number.',
      rejectionReason: '',
      createdAt: new Date(today.getTime() - 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'booking_sample_2',
      bookingId: 'BIT-GH-1002',
      guestType: 'Parent',
      guestDetails: {
        name: 'Rajesh & Sunita Gupta',
        email: 'rajesh.gupta@example.com',
        phone: '+91 94311 22334',
        studentName: 'Priya Gupta',
        studentRollNumber: 'BTECH/10210/23',
        relationship: 'Father & Mother',
        govtIdType: 'Aadhaar Card',
        govtIdNumber: 'XXXX-XXXX-8921',
      },
      roomNumber: 205,
      checkIn: checkIn2,
      checkOut: checkOut2,
      nights: 2,
      amount: 2400,
      status: 'APPROVED',
      paymentStatus: 'UNPAID',
      approvalNotes: 'Approved by Warden. Please complete payment within 24 hours to secure your room.',
      rejectionReason: '',
      createdAt: new Date(today.getTime() - 43200000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'booking_sample_3',
      bookingId: 'BIT-GH-1003',
      guestType: 'Alumni',
      guestDetails: {
        name: 'Vikramaditya Roy',
        email: 'vikram.roy.alumni@gmail.com',
        phone: '+91 91234 56789',
        passoutYear: '2016',
        branch: 'Mechanical Engineering',
        govtIdType: 'Passport',
        govtIdNumber: 'Z1982736',
      },
      roomNumber: 108,
      checkIn: checkIn3,
      checkOut: checkOut3,
      nights: 2,
      amount: 2400,
      status: 'PENDING_APPROVAL',
      paymentStatus: 'UNPAID',
      approvalNotes: '',
      rejectionReason: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}

// Default demo complaints
function generateDefaultComplaints() {
  return [
    {
      _id: 'complaint_1',
      complaintId: 'CMP-2026-101',
      roomNumber: 114,
      guestName: 'Rahul Verma',
      bookingId: 'BIT-GH-1001',
      category: 'Air Conditioning',
      issueDescription: 'AC temperature control display not responding, cooling is weak.',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      adminNotes: 'Electrician dispatched to check refrigerant gas and PCB.',
      resolvedAt: null,
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'complaint_2',
      complaintId: 'CMP-2026-102',
      roomNumber: 205,
      guestName: 'Rajesh Gupta',
      bookingId: 'BIT-GH-1002',
      category: 'Wi-Fi / Internet',
      issueDescription: 'Wi-Fi signal strength drops frequently in the corner workspace.',
      status: 'RESOLVED',
      priority: 'MEDIUM',
      adminNotes: 'Replaced floor router access point. Signal tested at 85 Mbps.',
      resolvedAt: new Date().toISOString(),
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}

// Fallback JSON File Operations
function readFallbackRooms() {
  if (!fs.existsSync(ROOMS_FILE)) {
    const defaultRooms = generateDefaultRooms();
    fs.writeFileSync(ROOMS_FILE, JSON.stringify(defaultRooms, null, 2));
    return defaultRooms;
  }
  try {
    return JSON.parse(fs.readFileSync(ROOMS_FILE, 'utf8'));
  } catch {
    return generateDefaultRooms();
  }
}

function writeFallbackRooms(rooms) {
  fs.writeFileSync(ROOMS_FILE, JSON.stringify(rooms, null, 2));
}

function readFallbackBookings() {
  if (!fs.existsSync(BOOKINGS_FILE)) {
    const defaultBookings = generateDefaultBookings();
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(defaultBookings, null, 2));
    return defaultBookings;
  }
  try {
    return JSON.parse(fs.readFileSync(BOOKINGS_FILE, 'utf8'));
  } catch {
    return generateDefaultBookings();
  }
}

function writeFallbackBookings(bookings) {
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
}

function readFallbackComplaints() {
  if (!fs.existsSync(COMPLAINTS_FILE)) {
    const defaultComplaints = generateDefaultComplaints();
    fs.writeFileSync(COMPLAINTS_FILE, JSON.stringify(defaultComplaints, null, 2));
    return defaultComplaints;
  }
  try {
    return JSON.parse(fs.readFileSync(COMPLAINTS_FILE, 'utf8'));
  } catch {
    return generateDefaultComplaints();
  }
}

function writeFallbackComplaints(complaints) {
  fs.writeFileSync(COMPLAINTS_FILE, JSON.stringify(complaints, null, 2));
}

// Connect to MongoDB with automatic fallback
async function connectDB() {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bit_mesra_guesthouse';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000,
    });
    isConnected = true;
    console.log('[Database] Connected to MongoDB successfully.');
    await seedMongo();
  } catch (err) {
    isConnected = false;
    console.warn(`[Database] MongoDB not reachable (${err.message}).`);
    console.log('[Database] Active Mode: File-Backed Persistent Database (Seamlessly handles all 33 rooms, bookings & complaints).');
    // Ensure initial files exist
    readFallbackRooms();
    readFallbackBookings();
    readFallbackComplaints();
  }
}

async function seedMongo() {
  try {
    const roomCount = await Room.countDocuments();
    if (roomCount < 33) {
      console.log('[Database] Seeding 33 default rooms into MongoDB...');
      await Room.deleteMany({});
      const defaultRooms = generateDefaultRooms();
      await Room.insertMany(defaultRooms);
      console.log('[Database] 33 Rooms seeded successfully into MongoDB.');
    }

    const bookingCount = await Booking.countDocuments();
    if (bookingCount === 0) {
      console.log('[Database] Seeding sample bookings into MongoDB...');
      const defaultBookings = generateDefaultBookings();
      await Booking.insertMany(defaultBookings);
      console.log('[Database] Sample bookings seeded successfully into MongoDB.');
    }

    const complaintCount = await Complaint.countDocuments();
    if (complaintCount === 0) {
      console.log('[Database] Seeding sample complaints into MongoDB...');
      const defaultComplaints = generateDefaultComplaints();
      await Complaint.insertMany(defaultComplaints);
      console.log('[Database] Sample complaints seeded successfully into MongoDB.');
    }
  } catch (err) {
    console.error('[Database] Seeding error:', err.message);
  }
}

// Storage Service API
const StorageService = {
  isMongoConnected: () => isConnected,

  async getAllRooms() {
    if (isConnected) {
      return await Room.find({}).sort({ roomNumber: 1 }).lean();
    }
    const rooms = readFallbackRooms();
    return rooms.sort((a, b) => a.roomNumber - b.roomNumber);
  },

  async getRoomByNumber(roomNumber) {
    const num = Number(roomNumber);
    if (isConnected) {
      return await Room.findOne({ roomNumber: num }).lean();
    }
    const rooms = readFallbackRooms();
    return rooms.find((r) => r.roomNumber === num) || null;
  },

  async toggleRoomMaintenance(roomNumber) {
    const num = Number(roomNumber);
    if (isConnected) {
      const room = await Room.findOne({ roomNumber: num });
      if (!room) return null;
      room.isMaintenance = !room.isMaintenance;
      await room.save();
      return room.toObject();
    }

    const rooms = readFallbackRooms();
    const room = rooms.find((r) => r.roomNumber === num);
    if (!room) return null;
    room.isMaintenance = !room.isMaintenance;
    room.updatedAt = new Date().toISOString();
    writeFallbackRooms(rooms);
    return room;
  },

  async getAllBookings() {
    if (isConnected) {
      return await Booking.find({}).sort({ createdAt: -1 }).lean();
    }
    const bookings = readFallbackBookings();
    return bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getBookingByIdOrCode(idOrCode) {
    if (!idOrCode) return null;
    const cleanId = String(idOrCode).trim();
    if (isConnected) {
      let booking = await Booking.findOne({ bookingId: new RegExp(`^${cleanId}$`, 'i') }).lean();
      if (!booking && mongoose.Types.ObjectId.isValid(cleanId)) {
        booking = await Booking.findById(cleanId).lean();
      }
      return booking;
    }

    const bookings = readFallbackBookings();
    return bookings.find(
      (b) => b.bookingId.toLowerCase() === cleanId.toLowerCase() || b._id === cleanId
    ) || null;
  },

  async createBooking(data) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `BIT-GH-${randomSuffix}`;

    const bookingPayload = {
      ...data,
      bookingId,
      status: data.status || 'PENDING_APPROVAL',
      paymentStatus: data.paymentStatus || 'UNPAID',
      approvalNotes: data.approvalNotes || '',
      rejectionReason: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isConnected) {
      const newBooking = new Booking(bookingPayload);
      const saved = await newBooking.save();
      return saved.toObject();
    }

    const bookings = readFallbackBookings();
    bookingPayload._id = `booking_${Date.now()}`;
    bookings.unshift(bookingPayload);
    writeFallbackBookings(bookings);
    return bookingPayload;
  },

  async updateBooking(idOrCode, updates) {
    if (!idOrCode) return null;
    const cleanId = String(idOrCode).trim();
    updates.updatedAt = new Date().toISOString();

    if (isConnected) {
      let booking = await Booking.findOneAndUpdate(
        { bookingId: new RegExp(`^${cleanId}$`, 'i') },
        { $set: updates },
        { new: true }
      );
      if (!booking && mongoose.Types.ObjectId.isValid(cleanId)) {
        booking = await Booking.findByIdAndUpdate(
          cleanId,
          { $set: updates },
          { new: true }
        );
      }
      return booking ? booking.toObject() : null;
    }

    const bookings = readFallbackBookings();
    const index = bookings.findIndex(
      (b) => b.bookingId.toLowerCase() === cleanId.toLowerCase() || b._id === cleanId
    );
    if (index === -1) return null;

    bookings[index] = { ...bookings[index], ...updates };
    writeFallbackBookings(bookings);
    return bookings[index];
  },

  async cancelBooking(idOrCode, reason = 'Cancelled by guest request') {
    return await this.updateBooking(idOrCode, {
      status: 'CANCELLED',
      rejectionReason: reason,
      cancelledAt: new Date().toISOString(),
    });
  },

  // Complaints
  async getAllComplaints(filters = {}) {
    if (isConnected) {
      const query = {};
      if (filters.status) query.status = filters.status;
      if (filters.roomNumber) query.roomNumber = Number(filters.roomNumber);
      return await Complaint.find(query).sort({ createdAt: -1 }).lean();
    }

    let complaints = readFallbackComplaints();
    if (filters.status) {
      complaints = complaints.filter((c) => c.status === filters.status);
    }
    if (filters.roomNumber) {
      complaints = complaints.filter((c) => c.roomNumber === Number(filters.roomNumber));
    }
    return complaints.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getComplaintById(complaintId) {
    if (!complaintId) return null;
    const cleanId = String(complaintId).trim();
    if (isConnected) {
      let complaint = await Complaint.findOne({ complaintId: new RegExp(`^${cleanId}$`, 'i') }).lean();
      if (!complaint && mongoose.Types.ObjectId.isValid(cleanId)) {
        complaint = await Complaint.findById(cleanId).lean();
      }
      return complaint;
    }

    const complaints = readFallbackComplaints();
    return complaints.find(
      (c) => c.complaintId.toLowerCase() === cleanId.toLowerCase() || c._id === cleanId
    ) || null;
  },

  async createComplaint(data) {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const year = new Date().getFullYear();
    const complaintId = `CMP-${year}-${randomSuffix}`;

    const complaintPayload = {
      ...data,
      complaintId,
      roomNumber: Number(data.roomNumber),
      guestName: data.guestName || 'Guest',
      bookingId: data.bookingId || '',
      category: data.category || 'General',
      issueDescription: data.issueDescription,
      status: 'OPEN',
      priority: data.priority || 'MEDIUM',
      adminNotes: '',
      resolvedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isConnected) {
      const newComplaint = new Complaint(complaintPayload);
      const saved = await newComplaint.save();
      return saved.toObject();
    }

    const complaints = readFallbackComplaints();
    complaintPayload._id = `complaint_${Date.now()}`;
    complaints.unshift(complaintPayload);
    writeFallbackComplaints(complaints);
    return complaintPayload;
  },

  async updateComplaint(complaintId, updates) {
    if (!complaintId) return null;
    const cleanId = String(complaintId).trim();
    updates.updatedAt = new Date().toISOString();
    if (updates.status === 'RESOLVED' && !updates.resolvedAt) {
      updates.resolvedAt = new Date().toISOString();
    }

    if (isConnected) {
      let complaint = await Complaint.findOneAndUpdate(
        { complaintId: new RegExp(`^${cleanId}$`, 'i') },
        { $set: updates },
        { new: true }
      );
      if (!complaint && mongoose.Types.ObjectId.isValid(cleanId)) {
        complaint = await Complaint.findByIdAndUpdate(
          cleanId,
          { $set: updates },
          { new: true }
        );
      }
      return complaint ? complaint.toObject() : null;
    }

    const complaints = readFallbackComplaints();
    const index = complaints.findIndex(
      (c) => c.complaintId.toLowerCase() === cleanId.toLowerCase() || c._id === cleanId
    );
    if (index === -1) return null;

    complaints[index] = { ...complaints[index], ...updates };
    writeFallbackComplaints(complaints);
    return complaints[index];
  },
};

module.exports = {
  connectDB,
  StorageService,
};
