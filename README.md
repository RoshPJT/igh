# 🏛️ BIT Mesra Guest House Booking Portal

A full-stack, enterprise-grade campus hospitality reservation web application built specifically for the **Birla Institute of Technology (BIT) Mesra, Ranchi**.

---

## 🌟 Key Features & Architectural Highlights

### 1. 🏢 Visual Movie-Ticket Style Room Selector (33 Rooms Across 2 Floors)
- **Floor 1:** 17 AC Executive Suites (Rooms 101 to 117).
- **Floor 2:** 16 AC Executive Suites (Rooms 201 to 216).
- **Seat-Selector Grid UI:** Interactive clickable room squares styled after movie-ticket seat selectors with corridor orientation, room categories, and floor filtering.
- **Dynamic Status Colors:**
  - 🟢 **Available:** Green with clear outline (`bg-emerald-50 text-emerald-900 border-2 border-emerald-500`).
  - 🔵 **Selected (Current User):** Royal Blue with Amber ring (`bg-blue-600 ring-4 ring-amber-300`).
  - 🟡 **Pending Approval:** Yellow / Amber (`bg-amber-100 text-amber-900 border-2 border-amber-500`).
  - 🔴 **Booked:** Crimson Red disabled (`bg-rose-100 text-rose-800 border-2 border-rose-300`).
  - ⚪ **Maintenance:** Diagonal-striped Gray disabled (`bg-slate-200 border-slate-400`).
- **Date-Gated Availability Engine:** Users must select Check-in and Check-out dates first to view real-time date-specific availability before selecting a room.

---

### 2. 📋 Dynamic Guest Verification Form
Dynamically adapts its verification fields based on the selected **Guest Type**:
- **🎓 Student:** BIT Roll Number, Department, Year of Study.
- **👨‍👩‍👧 Parent:** Visiting Student's Name, Student Roll Number, Relationship, Govt ID Type & Number.
- **🎓 Alumni:** Passout Year, Branch / Major, Govt ID Type & Number.
- **🏫 Other College Guest:** Home College / University Name, Sponsoring BIT Faculty / Department, Govt ID Type & Number.
- **Universal Fields:** Full Name, Institutional / Personal Email, Phone Number.
- **Tariff Engine:** Flat rate of **₹1,200 / night** per AC Suite. Total = Nights × ₹1,200.
- **Quick Test Buttons:** One-click demo fill buttons for Student, Parent, Alumni, and College Guest to expedite evaluation.

---

### 3. 🛡️ Warden / Admin Management Console
- Switch seamlessly between **"Guest Booking"** and **"Warden View"** via the top navigation toggle.
- **Pending Approvals Queue:** Lists all reservation requests with guest details, institutional credentials, requested dates, and room number.
- **Actions:**
  - **Approve:** Updates status to `APPROVED` and attaches custom approval notes, unlocking the payment gateway for the guest.
  - **Reject:** Updates status to `REJECTED` with custom reason, immediately freeing up the room on the floor map.
  - **Maintenance Floor Map:** Interactive admin-version map to toggle `isMaintenance: true/false` on any of the 33 rooms with a single click.

---

### 4. 💳 Mock Payment Gateway (Razorpay Style)
- **Trigger:** Accessible when a booking has reached `APPROVED` status (accessible via the **"Track Booking"** button in navbar or after submission).
- **UI:** High-fidelity Razorpay-style checkout modal with institutional BIT Mesra branding.
- **Options:** UPI (Google Pay, PhonePe, Paytm, VPA), Credit/Debit Cards, and NetBanking (SBI, HDFC, ICICI, Axis, PNB).
- **Outcome:** Simulates 3D secure payment, marks booking as `PAID`, switches the room status to **Booked (Red)**, and displays an official printable **Campus Stay Allotment Voucher** with a security gate QR pass.

---

### 5. 🤖 AI Chatbot Widget ("BIT Guest Assistant")
- Floating action button in bottom right with badge, subtle pulse, and tooltip.
- Official Google Gemini AI SDK (`@google/generative-ai`) integration.
- **System Prompt Context:** Configured with 33 rooms, ₹1,200/night flat tariff, 12:00 PM check-in, 11:00 AM check-out, ID verification rules, and Warden office contact (+91 651 2275444).
- **3 Quick-Reply Shortcut Buttons:**
  - `"Room Tariffs?"`
  - `"ID Rules?"`
  - `"Approval Time?"`
- Built-in intelligent fallback responder so it provides instant, accurate answers even without an external API key!

---

## 🛠️ Tech Stack & Directory Structure

```
guesthouse/
├── backend/
│   ├── config/
│   │   └── db.js                 # Mongoose connection with resilient fallback store
│   ├── controllers/
│   │   ├── roomController.js     # Room queries & maintenance toggle
│   │   └── bookingController.js  # Booking creation, approval, rejection, payment
│   ├── models/
│   │   ├── Booking.js            # Mongoose schema for Bookings
│   │   └── Room.js               # Mongoose schema for Rooms
│   ├── routes/
│   │   ├── roomRoutes.js         # /api/rooms
│   │   ├── bookingRoutes.js      # /api/bookings
│   │   └── chatRoutes.js         # /api/chat
│   ├── server.js                 # Express server on port 5000
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Official BIT Mesra header & view switch
│   │   │   ├── HeroSection.jsx       # Clock Tower & Guest House visual cards
│   │   │   ├── FloorMap.jsx          # 33-room movie-ticket seat selector
│   │   │   ├── BookingForm.jsx       # Dynamic verification form & presets
│   │   │   ├── WardenDashboard.jsx   # Warden approvals, rejections & maintenance
│   │   │   ├── PaymentModal.jsx      # Razorpay-style checkout modal
│   │   │   ├── TrackBookingModal.jsx # Track booking by ID & trigger payment
│   │   │   ├── StayVoucherModal.jsx  # Printable allotment pass with QR code
│   │   │   └── ChatbotWidget.jsx     # Floating Gemini AI assistant
│   │   ├── services/
│   │   │   └── api.js                # Centralized frontend API client
│   │   ├── App.jsx                   # Root application state & real-time sync
│   │   ├── index.css                 # Tailwind base & custom animations
│   │   └── main.jsx
│   ├── tailwind.config.js            # BIT maroon (#700000) & gold (#FFB300)
│   ├── vite.config.js                # Proxy routing /api to port 5000
│   └── package.json
│
├── .env                              # Environment variables
└── package.json                      # Root workspace scripts
```

---

## 🚀 Running the Application

### 1. Start Both Services (Recommended)
From the root directory:
```bash
npm run dev
```

### 2. Or Run Backend and Frontend in Separate Terminals

**Backend:**
```bash
cd backend
npm run dev
# Running on http://localhost:5000
```

**Frontend:**
```bash
cd frontend
npm run dev
# Running on http://localhost:5173
```

---

## 🧪 Pre-Seeded Sample Data for Instant Testing

When the server starts, it initializes the 33 rooms and creates sample bookings for immediate review:

| Booking ID | Guest Type | Guest Name | Room | Current Status | What to test |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **`BIT-GH-1002`** | Parent | Rajesh & Sunita Gupta | **205** | `APPROVED` | Click **Track Booking** -> Enter `BIT-GH-1002` -> Click **Proceed to Pay** to test the Razorpay modal. |
| **`BIT-GH-1003`** | Alumni | Vikramaditya Roy | **108** | `PENDING_APPROVAL` | Switch to **Warden View** -> Review credentials -> Click **Approve** or **Reject**. |
| **`BIT-GH-1001`** | Student | Aarav Sharma | **104** | `PAID` | Visible on Floor Map as **Booked (Red)**. |
| **Room 114** | — | — | **114** | `Maintenance` | Marked as striped gray. Can toggle via Warden Console. |

---

## 🎨 Official Brand Identity
- **Primary Institutional Maroon:** `#700000` / `bg-rose-900`
- **Secondary Institutional Gold:** `#FFB300` / `bg-amber-500`
- **Accent Institutional Navy:** `#0F1E36` / `#1E293B`
- **Background:** `#F8FAFC` (Slate-50)
