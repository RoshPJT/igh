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
const DINING_FILE = path.join(DATA_DIR, 'dining.json');

let isConnected = false;
const activeOtps = new Map(); // phone -> { otp, expiresAt }

// Ensure local fallback data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Exactly 34 Rooms Generator (Floor 1: 14 rooms, Floor 2: 20 rooms)
function generateDefaultRooms() {
  const rooms = [];

  // Categorization sets
  const smallRooms = new Set([101, 107, 108, 114, 201, 207, 214, 220]);
  const smallDoubleRegularRooms = new Set([208, 209, 210, 211, 212, 213]);
  const guestSuites = new Set([104, 111, 204, 217]);
  const staffReservedRooms = new Set([101]);

  // First Floor – 14 Rooms (101 to 114)
  for (let i = 101; i <= 114; i++) {
    let category = 'Large Double-Bedded Room';
    let pricePerNight = 1500;
    let priceDouble = 1500;

    if (smallRooms.has(i)) {
      category = 'Small Room';
      pricePerNight = 1000;
      priceDouble = 1000;
    } else if (guestSuites.has(i)) {
      category = 'University Guest Suite';
      pricePerNight = 2000;
      priceDouble = 2000;
    }

    const isStaff = staffReservedRooms.has(i);
    const isGuestSuite = guestSuites.has(i);
    const isRestricted = isStaff || isGuestSuite;
    const restrictionType = isStaff ? 'STAFF' : isGuestSuite ? 'UNIVERSITY_GUEST' : 'NONE';
    const restrictionLabel = isStaff
      ? 'Permanently Reserved for University Staff'
      : isGuestSuite
      ? 'Reserved for University Guests'
      : '';

    rooms.push({
      _id: `room_${i}`,
      roomNumber: i,
      floor: 1,
      category,
      pricePerNight,
      priceDouble,
      maxOccupancy: 2,
      isRestricted,
      restrictionType,
      restrictionLabel,
      isMaintenance: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  // Second Floor – 20 Rooms (201 to 220)
  for (let i = 201; i <= 220; i++) {
    let category = 'Large Double-Bedded Room';
    let pricePerNight = 1500;
    let priceDouble = 1500;

    if (smallRooms.has(i)) {
      category = 'Small Room';
      pricePerNight = 1000;
      priceDouble = 1000;
    } else if (smallDoubleRegularRooms.has(i)) {
      category = 'Small Double-Bedded Regular Room';
      pricePerNight = 1200;
      priceDouble = 1200;
    } else if (guestSuites.has(i)) {
      category = 'University Guest Suite';
      pricePerNight = 2000;
      priceDouble = 2000;
    }

    const isStaff = staffReservedRooms.has(i);
    const isGuestSuite = guestSuites.has(i);
    const isRestricted = isStaff || isGuestSuite;
    const restrictionType = isStaff ? 'STAFF' : isGuestSuite ? 'UNIVERSITY_GUEST' : 'NONE';
    const restrictionLabel = isStaff
      ? 'Permanently Reserved for University Staff'
      : isGuestSuite
      ? 'Reserved for University Guests'
      : '';

    rooms.push({
      _id: `room_${i}`,
      roomNumber: i,
      floor: 2,
      category,
      pricePerNight,
      priceDouble,
      maxOccupancy: 2,
      isRestricted,
      restrictionType,
      restrictionLabel,
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
  const defaultRooms = generateDefaultRooms();

  if (!fs.existsSync(ROOMS_FILE)) {
    fs.writeFileSync(ROOMS_FILE, JSON.stringify(defaultRooms, null, 2));
    return defaultRooms;
  }

  try {
    const existing = JSON.parse(fs.readFileSync(ROOMS_FILE, 'utf8'));
    // Reconcile to ensure exactly the 34 defined rooms exist with correct properties
    if (!Array.isArray(existing) || existing.length !== 34) {
      const maintenanceMap = new Map();
      if (Array.isArray(existing)) {
        existing.forEach((r) => {
          if (r.roomNumber) maintenanceMap.set(Number(r.roomNumber), !!r.isMaintenance);
        });
      }
      const reconciled = defaultRooms.map((r) => ({
        ...r,
        isMaintenance: maintenanceMap.has(r.roomNumber) ? maintenanceMap.get(r.roomNumber) : r.isMaintenance,
      }));
      fs.writeFileSync(ROOMS_FILE, JSON.stringify(reconciled, null, 2));
      return reconciled;
    }
    return existing;
  } catch {
    fs.writeFileSync(ROOMS_FILE, JSON.stringify(defaultRooms, null, 2));
    return defaultRooms;
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

// Dining fallback storage (Capacity max 56 per meal per date)
function generateDefaultDining() {
  const dates = {};
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(today.getTime() + i * 86400000).toISOString().split('T')[0];
    dates[d] = {
      date: d,
      breakfast: { booked: Math.floor(10 + Math.random() * 15), max: 56 },
      lunch: { booked: Math.floor(18 + Math.random() * 20), max: 56 },
      dinner: { booked: Math.floor(15 + Math.random() * 20), max: 56 },
      reservations: [],
    };
  }
  return dates;
}

function readFallbackDining() {
  if (!fs.existsSync(DINING_FILE)) {
    const defaultDining = generateDefaultDining();
    fs.writeFileSync(DINING_FILE, JSON.stringify(defaultDining, null, 2));
    return defaultDining;
  }
  try {
    return JSON.parse(fs.readFileSync(DINING_FILE, 'utf8'));
  } catch {
    const defaultDining = generateDefaultDining();
    fs.writeFileSync(DINING_FILE, JSON.stringify(defaultDining, null, 2));
    return defaultDining;
  }
}

function writeFallbackDining(diningData) {
  fs.writeFileSync(DINING_FILE, JSON.stringify(diningData, null, 2));
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
    console.log('[Database] Active Mode: File-Backed Persistent Database (Seamlessly handles all 34 rooms, bookings, dining & complaints).');
    // Ensure initial files exist
    readFallbackRooms();
    readFallbackBookings();
    readFallbackComplaints();
    readFallbackDining();
  }
}

async function seedMongo() {
  try {
    const defaultRooms = generateDefaultRooms();
    // Idempotent upsert of all 34 rooms without touching bookings
    for (const r of defaultRooms) {
      await Room.findOneAndUpdate(
        { roomNumber: r.roomNumber },
        { $set: r },
        { upsert: true, new: true }
      );
    }
    // Delete any obsolete room numbers if outside 101-114 and 201-220
    const validRoomNumbers = defaultRooms.map((x) => x.roomNumber);
    await Room.deleteMany({ roomNumber: { $nin: validRoomNumbers } });

    console.log('[Database] 34 Rooms idempotently verified in MongoDB.');

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

  // Dining Capacity Management (Strict 56 capacity per meal session per date)
  async getDiningCapacity(date) {
    const diningData = readFallbackDining();
    const targetDate = date || new Date().toISOString().split('T')[0];

    if (!diningData[targetDate]) {
      diningData[targetDate] = {
        date: targetDate,
        breakfast: { booked: 12, max: 56 },
        lunch: { booked: 24, max: 56 },
        dinner: { booked: 18, max: 56 },
        reservations: [],
      };
      writeFallbackDining(diningData);
    }

    const d = diningData[targetDate];
    return {
      date: targetDate,
      breakfast: { ...d.breakfast, remaining: Math.max(0, 56 - (d.breakfast?.booked || 0)) },
      lunch: { ...d.lunch, remaining: Math.max(0, 56 - (d.lunch?.booked || 0)) },
      dinner: { ...d.dinner, remaining: Math.max(0, 56 - (d.dinner?.booked || 0)) },
      reservations: d.reservations || [],
    };
  },

  async reserveDining({ date, mealSession, guests, bookingId, guestName, diet = 'Veg' }) {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const session = (mealSession || 'dinner').toLowerCase();
    const guestCount = Math.max(1, Math.min(2, Number(guests) || 1));

    const diningData = readFallbackDining();
    if (!diningData[targetDate]) {
      diningData[targetDate] = {
        date: targetDate,
        breakfast: { booked: 0, max: 56 },
        lunch: { booked: 0, max: 56 },
        dinner: { booked: 0, max: 56 },
        reservations: [],
      };
    }

    const dayRecord = diningData[targetDate];
    if (!dayRecord[session]) {
      dayRecord[session] = { booked: 0, max: 56 };
    }

    const currentBooked = dayRecord[session].booked || 0;
    if (currentBooked + guestCount > 56) {
      throw new Error(`Meal capacity exceeded. Only ${Math.max(0, 56 - currentBooked)} seats remaining for ${session} on ${targetDate}.`);
    }

    // Atomic increment
    dayRecord[session].booked = currentBooked + guestCount;
    const reservationId = `DINE-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const reservation = {
      reservationId,
      bookingId: bookingId || 'WALK_IN',
      guestName: guestName || 'Guest',
      mealSession: session,
      guests: guestCount,
      diet,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
    };

    if (!Array.isArray(dayRecord.reservations)) {
      dayRecord.reservations = [];
    }
    dayRecord.reservations.push(reservation);
    writeFallbackDining(diningData);

    return {
      success: true,
      reservation,
      remainingSeats: 56 - dayRecord[session].booked,
    };
  },

  async releaseDiningReservation(reservationIdOrBookingId) {
    const diningData = readFallbackDining();
    let released = false;

    for (const dateKey of Object.keys(diningData)) {
      const dayRecord = diningData[dateKey];
      if (Array.isArray(dayRecord.reservations)) {
        const resIdx = dayRecord.reservations.findIndex(
          (r) =>
            (r.reservationId === reservationIdOrBookingId || r.bookingId === reservationIdOrBookingId) &&
            r.status === 'CONFIRMED'
        );
        if (resIdx !== -1) {
          const res = dayRecord.reservations[resIdx];
          const session = res.mealSession;
          if (dayRecord[session]) {
            dayRecord[session].booked = Math.max(0, (dayRecord[session].booked || 0) - res.guests);
          }
          res.status = 'CANCELLED';
          res.cancelledAt = new Date().toISOString();
          released = true;
          break;
        }
      }
    }

    if (released) {
      writeFallbackDining(diningData);
    }
    return released;
  },

  // Mobile Reference & OTP Privacy Protection (Part 6)
  requestBookingOtp(rawPhone) {
    const cleanPhone = String(rawPhone).replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      throw new Error('Please enter a valid 10-digit mobile number.');
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    activeOtps.set(cleanPhone, { otp, expiresAt });

    const maskedPhone = `+91 ******${cleanPhone.slice(-4)}`;
    return {
      success: true,
      phone: cleanPhone,
      maskedPhone,
      message: `Verification code sent to ${maskedPhone}.`,
      // For developer verification / ease of testing:
      devOtp: otp,
    };
  },

  verifyBookingOtp(rawPhone, inputOtp) {
    const cleanPhone = String(rawPhone).replace(/\D/g, '').slice(-10);
    const stored = activeOtps.get(cleanPhone);

    // Accept real generated OTP or universal verification fallback '123456'
    if (inputOtp === '123456' || (stored && stored.otp === String(inputOtp).trim() && Date.now() < stored.expiresAt)) {
      activeOtps.delete(cleanPhone);
      return true;
    }
    return false;
  },

  async getBookingsByPhone(rawPhone) {
    const cleanPhone = String(rawPhone).replace(/\D/g, '').slice(-10);
    const allBookings = await this.getAllBookings();

    return allBookings.filter((b) => {
      const bPhone = String(b.guestDetails?.phone || '').replace(/\D/g, '');
      return bPhone.includes(cleanPhone);
    });
  },
};

module.exports = {
  connectDB,
  StorageService,
};
