const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB } = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const chatRoutes = require('./routes/chatRoutes');
const complaintRoutes = require('./routes/complaintRoutes');

app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/complaints', complaintRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'BIT Mesra Guest House API',
  });
});

// Root welcome
app.get('/', (req, res) => {
  res.send('BIT Mesra Guest House Booking Portal API is running.');
});

// Start server
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🏛️  BIT Mesra Guest House API Server running on port ${PORT}`);
    console.log(`🔗  Endpoints:`);
    console.log(`    - Rooms:      http://localhost:${PORT}/api/rooms`);
    console.log(`    - Bookings:   http://localhost:${PORT}/api/bookings`);
    console.log(`    - AI Chat:    http://localhost:${PORT}/api/chat`);
    console.log(`====================================================`);
  });
}

startServer();
