import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import TariffPage from './pages/TariffPage';
import RoomsPage from './pages/RoomsPage';
import DiningPage from './pages/DiningPage';
import FacilitiesPage from './pages/FacilitiesPage';
import GalleryPage from './pages/GalleryPage';
import ThingsToDoPage from './pages/ThingsToDoPage';
import BookingPage from './pages/BookingPage';
import ContactPage from './pages/ContactPage';
import RegistrarPage from './pages/RegistrarPage';

// Modals & Floating Widgets
import PaymentModal from './components/PaymentModal';
import TrackBookingModal from './components/TrackBookingModal';
import StayVoucherModal from './components/StayVoucherModal';
import ChatbotWidget from './components/ChatbotWidget';
import GuestAuthModal from './components/GuestAuthModal';
import WardenAuthModal from './components/WardenAuthModal';
import MyBookingsModal from './components/MyBookingsModal';
import NotificationCenter from './components/NotificationCenter';

import { translations } from './utils/translations';
import { api } from './services/api';
import { getTodayString, addDays, calculateNights } from './utils/dateUtils';

export default function App() {
  // Language state
  const [lang, setLang] = useState(() => localStorage.getItem('bit_guesthouse_lang') || 'en');
  const t = translations[lang] || translations.en;

  const toggleLanguage = () => {
    const nextLang = lang === 'en' ? 'hi' : 'en';
    setLang(nextLang);
    localStorage.setItem('bit_guesthouse_lang', nextLang);
  };

  // User auth state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('bit_guest_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Registrar / Warden auth state
  const [isWardenAuthenticated, setIsWardenAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('bit_warden_auth'));
  });

  // Date state initialized accurately:
  // Default check-in: today. Default check-out: exactly 1 calendar day later.
  const initialCheckIn = getTodayString();
  const initialCheckOut = addDays(initialCheckIn, 1);

  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [dateError, setDateError] = useState('');

  // Top search bar states
  const [guestCount, setGuestCount] = useState(2);
  const [guestType, setGuestType] = useState('Student');
  const [floorPreference, setFloorPreference] = useState('all'); // 'all', 1, 2

  // Data states
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [paymentBooking, setPaymentBooking] = useState(null);
  const [trackBookingId, setTrackBookingId] = useState('');
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [voucherBooking, setVoucherBooking] = useState(null);
  const [isGuestAuthOpen, setIsGuestAuthOpen] = useState(false);
  const [isWardenAuthOpen, setIsWardenAuthOpen] = useState(false);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);

  // Notifications state (starts empty - no popup on load)
  const [notifications, setNotifications] = useState([]);

  const addNotification = (type, title, message, destination) => {
    const newNotif = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type,
      title,
      message,
      destination,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Auto dismiss toast after 6 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== newNotif.id));
    }, 6000);
  };

  const handleDismissNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Fetch Rooms & Bookings
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [roomsRes, bookingsRes] = await Promise.all([
        api.getRooms(checkIn, checkOut),
        api.getBookings(),
      ]);

      if (roomsRes.success && roomsRes.data) {
        setRooms(roomsRes.data);
      }
      if (bookingsRes.success && bookingsRes.data) {
        setBookings(bookingsRes.data);
      }
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setIsLoading(false);
    }
  }, [checkIn, checkOut]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Date change handler with bulletproof +1 day auto check-out and multi-night manual support
  const handleDateChange = ({ checkIn: newIn, checkOut: newOut, triggerPrompt }) => {
    if (triggerPrompt) {
      setDateError('Please confirm your Check-in and Check-out dates.');
      return;
    }

    // When check-in changes: automatically set check-out to exactly 1 calendar day later
    if (newIn !== undefined && newIn !== checkIn) {
      const calculatedOut = addDays(newIn, 1);
      setCheckIn(newIn);
      setCheckOut(calculatedOut);
      setDateError('');
      setSelectedRoom(null); // Reset room selection when dates change
      return;
    }

    // When check-out changes manually (for multi-night stays):
    if (newOut !== undefined) {
      const minOut = addDays(checkIn, 1);
      if (newOut < minOut) {
        setCheckOut(minOut);
        setDateError('Check-out date must be strictly after Check-in date. Adjusted to next day.');
      } else {
        setCheckOut(newOut);
        setDateError('');
      }
      setSelectedRoom(null);
    }
  };

  // Immediate Local State Sync when booking is created
  const handleBookingCreated = (newBooking) => {
    setRooms((prevRooms) =>
      prevRooms.map((r) => {
        if (r.roomNumber === newBooking.roomNumber) {
          return {
            ...r,
            status: 'Pending Approval',
            activeBooking: {
              bookingId: newBooking.bookingId,
              status: 'PENDING_APPROVAL',
              guestName: newBooking.guestDetails?.name,
              checkIn: newBooking.checkIn,
              checkOut: newBooking.checkOut,
            },
          };
        }
        return r;
      })
    );

    setBookings((prev) => [newBooking, ...prev]);
    setSelectedRoom(null);

    // SMS simulation toast
    const phone = newBooking.guestDetails?.phone || '+91 98765 43210';
    addNotification(
      'sms',
      'Booking Request Submitted',
      `Booking ${newBooking.bookingId} for Room ${newBooking.roomNumber} submitted. You will receive an SMS upon Registrar approval.`,
      phone
    );

    // Email simulation toast
    const email = newBooking.guestDetails?.email || 'guest@bitmesra.ac.in';
    addNotification(
      'email',
      'Institutional Clearance Dispatched',
      `Application ${newBooking.bookingId} dispatched to BIT Mesra Registrar for identity review (${newBooking.guestType}).`,
      email
    );
  };

  // Payment Success Handler
  const handlePaymentSuccess = (updatedBooking) => {
    setBookings((prev) =>
      prev.map((b) => (b.bookingId === updatedBooking.bookingId ? updatedBooking : b))
    );
    setRooms((prev) =>
      prev.map((r) => {
        if (r.roomNumber === updatedBooking.roomNumber) {
          return {
            ...r,
            status: 'Booked',
            activeBooking: {
              bookingId: updatedBooking.bookingId,
              status: 'PAID',
              guestName: updatedBooking.guestDetails?.name,
              checkIn: updatedBooking.checkIn,
              checkOut: updatedBooking.checkOut,
            },
          };
        }
        return r;
      })
    );

    setVoucherBooking(updatedBooking);

    const phone = updatedBooking.guestDetails?.phone || '+91 98765 43210';
    const email = updatedBooking.guestDetails?.email || 'guest@bitmesra.ac.in';

    addNotification(
      'sms',
      'Payment Received & Allotment Confirmed',
      `Payment of ₹${updatedBooking.amount} successful for Room ${updatedBooking.roomNumber} (${updatedBooking.checkIn} to ${updatedBooking.checkOut}). Your BIT Stay Pass is active.`,
      phone
    );
    addNotification(
      'email',
      'Official BIT Stay Voucher Dispatched',
      `Your room booking pass for Suite ${updatedBooking.roomNumber} has been issued. Show at campus gate.`,
      email
    );
  };

  // Registrar approval notification trigger
  const handleRegistrarApprovalNotification = (booking) => {
    const phone = booking.guestDetails?.phone || '+91 98765 43210';
    const email = booking.guestDetails?.email || 'guest@bitmesra.ac.in';

    addNotification(
      'sms',
      'Registrar Approval Received',
      `Great news! Your booking ${booking.bookingId} for Room ${booking.roomNumber} has been APPROVED by the Registrar. Complete payment to confirm.`,
      phone
    );
    addNotification(
      'email',
      'Booking Approved by Registrar',
      `Registrar authorization granted. Payment gateway unlocked for Booking ${booking.bookingId}.`,
      email
    );
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-[#F6F1E8] text-[#262626] flex flex-col font-sans">
        {/* Top Navbar Header with Navigation Links */}
        <Navbar
          onOpenTrackModal={() => setIsTrackModalOpen(true)}
          currentUser={currentUser}
          onOpenGuestLogin={() => setIsGuestAuthOpen(true)}
          onLogoutGuest={() => {
            localStorage.removeItem('bit_guest_user');
            setCurrentUser(null);
          }}
          onOpenMyBookings={() => setIsMyBookingsOpen(true)}
          isWardenAuthenticated={isWardenAuthenticated}
          onOpenWardenLogin={() => setIsWardenAuthOpen(true)}
          lang={lang}
          onToggleLang={toggleLanguage}
          notifications={notifications}
          onOpenNotifications={() => setIsNotificationCenterOpen(true)}
          t={t}
        />

        {/* Dynamic Route Pages */}
        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  checkIn={checkIn}
                  checkOut={checkOut}
                  onDateChange={handleDateChange}
                  guestCount={guestCount}
                  onGuestCountChange={setGuestCount}
                  guestType={guestType}
                  onGuestTypeChange={setGuestType}
                  floorPreference={floorPreference}
                  onFloorPreferenceChange={setFloorPreference}
                  t={t}
                />
              }
            />

            <Route path="/tariff" element={<TariffPage t={t} />} />

            <Route
              path="/rooms"
              element={
                <RoomsPage
                  rooms={rooms}
                  selectedRoom={selectedRoom}
                  onSelectRoom={setSelectedRoom}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  onDateChange={handleDateChange}
                  dateError={dateError}
                  floorPreference={floorPreference}
                  onRefreshData={fetchData}
                  isLoading={isLoading}
                  t={t}
                />
              }
            />

            <Route path="/dining" element={<DiningPage t={t} />} />

            <Route path="/facilities" element={<FacilitiesPage t={t} />} />

            <Route path="/gallery" element={<GalleryPage t={t} />} />

            <Route path="/things-to-do" element={<ThingsToDoPage t={t} />} />

            <Route
              path="/booking"
              element={
                <BookingPage
                  rooms={rooms}
                  selectedRoom={selectedRoom}
                  onSelectRoom={setSelectedRoom}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  onDateChange={handleDateChange}
                  dateError={dateError}
                  guestCount={guestCount}
                  onGuestCountChange={setGuestCount}
                  guestType={guestType}
                  onGuestTypeChange={setGuestType}
                  floorPreference={floorPreference}
                  onFloorPreferenceChange={setFloorPreference}
                  onRefreshData={fetchData}
                  isLoading={isLoading}
                  currentUser={currentUser}
                  onBookingSuccess={handleBookingCreated}
                  onOpenTrackModal={(id) => {
                    setTrackBookingId(id);
                    setIsTrackModalOpen(true);
                  }}
                  t={t}
                />
              }
            />

            <Route path="/contact" element={<ContactPage t={t} />} />

            <Route
              path="/registrar"
              element={
                <RegistrarPage
                  isWardenAuthenticated={isWardenAuthenticated}
                  onOpenWardenLogin={() => setIsWardenAuthOpen(true)}
                  onLogoutWarden={() => {
                    localStorage.removeItem('bit_warden_auth');
                    setIsWardenAuthenticated(false);
                  }}
                  rooms={rooms}
                  bookings={bookings}
                  onRefreshData={fetchData}
                  onRoomsUpdated={fetchData}
                  onBookingApproved={handleRegistrarApprovalNotification}
                  t={t}
                />
              }
            />

            {/* Fallback to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Footer (Pre-footer gallery strip + 3-column contact/map section) */}
        <Footer t={t} />

        {/* Modals & Dialogs */}
        {/* 1. Track Booking Modal */}
        <TrackBookingModal
          isOpen={isTrackModalOpen}
          initialBookingId={trackBookingId}
          onClose={() => setIsTrackModalOpen(false)}
          onOpenPayment={(booking) => {
            setIsTrackModalOpen(false);
            setPaymentBooking(booking);
          }}
        />

        {/* 2. Mock Payment Modal */}
        {paymentBooking && (
          <PaymentModal
            booking={paymentBooking}
            onClose={() => setPaymentBooking(null)}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}

        {/* 3. Stay Voucher Modal */}
        {voucherBooking && (
          <StayVoucherModal
            booking={voucherBooking}
            onClose={() => setVoucherBooking(null)}
          />
        )}

        {/* 4. Guest Mobile Login (OTP) Modal */}
        <GuestAuthModal
          isOpen={isGuestAuthOpen}
          onClose={() => setIsGuestAuthOpen(false)}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            addNotification('sms', 'Login Verified', `Logged in as ${user.name} (${user.phone}).`, user.phone);
          }}
          t={t}
        />

        {/* 5. Registrar Protected Login Modal */}
        <WardenAuthModal
          isOpen={isWardenAuthOpen}
          onClose={() => setIsWardenAuthOpen(false)}
          onAuthorized={() => {
            setIsWardenAuthenticated(true);
            addNotification('sms', 'Registrar Authorized', 'Registrar console unlocked.', 'Admin');
          }}
          t={t}
        />

        {/* 6. My Bookings History Modal */}
        <MyBookingsModal
          isOpen={isMyBookingsOpen}
          onClose={() => setIsMyBookingsOpen(false)}
          bookings={bookings}
          currentUser={currentUser}
          onOpenPayment={(b) => setPaymentBooking(b)}
          onOpenVoucher={(b) => setVoucherBooking(b)}
        />

        {/* 7. Live Notification Center & Toast Stack */}
        <NotificationCenter
          notifications={notifications}
          onDismissNotification={handleDismissNotification}
          isOpen={isNotificationCenterOpen}
          onClose={() => setIsNotificationCenterOpen(false)}
        />

        {/* 8. AI Chatbot Widget (BIT Guest Assistant) */}
        <ChatbotWidget userProfile={currentUser} lang={lang} t={t} />
      </div>
    </BrowserRouter>
  );
}
