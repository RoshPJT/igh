import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Bed,
  Calendar,
  User,
  ShieldCheck,
  Receipt,
  ArrowRight,
  Phone,
  KeyRound,
  Sparkles,
  Lock
} from 'lucide-react';
import { api } from '../services/api';
import bitLogo from '../assets/bit_mesra_logo.png';

export default function TrackBookingModal({
  isOpen,
  initialBookingId,
  onClose,
  onOpenPayment,
}) {
  const [activeTab, setActiveTab] = useState('phone'); // 'phone' (Visible Reference) or 'id' (Internal ID)
  const [phoneInput, setPhoneInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [devOtpHint, setDevOtpHint] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [bookingIdInput, setBookingIdInput] = useState(initialBookingId || '');
  const [bookingList, setBookingList] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (initialBookingId) {
      setActiveTab('id');
      setBookingIdInput(initialBookingId);
      lookupById(initialBookingId);
    }
  }, [initialBookingId]);

  if (!isOpen) return null;

  // 1. Request OTP for Mobile Reference Lookup (Part 6)
  const handleRequestOtp = async (e) => {
    e?.preventDefault();
    const clean = phoneInput.replace(/\D/g, '').slice(-10);
    if (clean.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      const res = await api.requestBookingOtp(clean);
      setIsLoading(false);
      setOtpSent(true);
      setDevOtpHint(res.devOtp || '123456');
      setSuccessMsg(res.message || 'OTP sent successfully.');
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Failed to send OTP.');
    }
  };

  // 2. Verify OTP & Retrieve Bookings
  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    if (!otpInput.trim()) {
      setError('Please enter the 6-digit OTP.');
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      const res = await api.verifyBookingOtp(phoneInput, otpInput.trim());
      setIsLoading(false);
      if (res.success && Array.isArray(res.data)) {
        if (res.data.length === 0) {
          setError('No booking records found for this mobile number.');
          setBookingList([]);
        } else {
          setBookingList(res.data);
          setSelectedBooking(res.data[0]);
          setSuccessMsg(`Verified! ${res.data.length} booking(s) found.`);
        }
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Invalid or expired OTP. Please try again.');
    }
  };

  // 3. Lookup by Internal Booking ID
  const lookupById = async (idToSearch) => {
    const id = idToSearch || bookingIdInput;
    if (!id.trim()) {
      setError('Please enter a Booking Reference ID (e.g. BIT-GH-1001)');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const res = await api.getBookingById(id.trim());
      setIsLoading(false);
      if (res.success && res.data) {
        setSelectedBooking(res.data);
        setBookingList([res.data]);
      } else {
        setError(res.message || 'No booking found');
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Booking not found. Please verify the ID.');
      setSelectedBooking(null);
      setBookingList([]);
    }
  };

  const handleIdSearch = (e) => {
    e?.preventDefault();
    lookupById();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in font-sans">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border-2 border-[#C6A15B] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#262626] text-white p-5 border-b-2 border-[#C6A15B] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white p-1 border border-[#C6A15B] flex items-center justify-center flex-shrink-0">
              <img src={bitLogo} alt="BIT Crest" className="w-full h-full object-contain rounded-full" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Retrieve & Track Booking
              </h3>
              <p className="text-[11px] text-[#C6A15B] font-semibold">
                BIT Mesra Guest House Official Reservation Portal
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm transition"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher: Mobile (Visible Reference) vs Internal ID */}
        <div className="bg-[#F6F1E8] p-3 border-b border-[#E7DFD2] flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('phone');
                setError('');
                setSuccessMsg('');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                activeTab === 'phone'
                  ? 'bg-[#7A2438] text-white shadow-sm'
                  : 'text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Mobile Number (Visible Ref)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('id');
                setError('');
                setSuccessMsg('');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                activeTab === 'id'
                  ? 'bg-[#7A2438] text-white shadow-sm'
                  : 'text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Internal Booking ID</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* TAB 1: Mobile Phone + OTP Verification (Part 6) */}
          {activeTab === 'phone' && (
            <div className="space-y-4">
              <div className="text-xs text-stone-600">
                In compliance with university guest privacy policies, enter your registered 10-digit mobile number to receive a one-time verification code (OTP).
              </div>

              {!otpSent ? (
                <form onSubmit={handleRequestOtp} className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-stone-500">+91</span>
                    <input
                      type="tel"
                      required
                      placeholder="9876543210 (10 digits)"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      className="w-full pl-12 pr-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7A2438] text-xs font-semibold text-stone-800"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 rounded-xl bg-[#7A2438] hover:bg-[#661C2E] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm whitespace-nowrap"
                  >
                    {isLoading ? 'Sending...' : 'Send OTP'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                    <span>Code sent to +91 ******{phoneInput.slice(-4)}</span>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-[#7A2438] font-bold hover:underline"
                    >
                      Change Number
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Enter 6-digit OTP"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      className="flex-1 px-4 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7A2438] text-xs font-bold tracking-widest text-stone-800 text-center"
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-5 py-2 rounded-xl bg-[#7A2438] hover:bg-[#661C2E] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm whitespace-nowrap"
                    >
                      {isLoading ? 'Verifying...' : 'Verify & View'}
                    </button>
                  </div>

                  {devOtpHint && (
                    <div className="text-[11px] text-stone-500 font-medium">
                      Demo verification OTP code: <strong className="text-[#7A2438]">{devOtpHint}</strong>
                    </div>
                  )}
                </form>
              )}
            </div>
          )}

          {/* TAB 2: Internal Booking ID */}
          {activeTab === 'id' && (
            <form onSubmit={handleIdSearch} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="e.g. BIT-GH-1001"
                value={bookingIdInput}
                onChange={(e) => setBookingIdInput(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7A2438] text-xs font-semibold text-stone-800"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2 rounded-xl bg-[#7A2438] hover:bg-[#661C2E] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm whitespace-nowrap flex items-center space-x-1"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
            </form>
          )}

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Multiple Bookings Selector (If mobile has multiple bookings) */}
          {bookingList.length > 1 && (
            <div className="space-y-2 pt-2 border-t border-stone-200">
              <span className="text-xs font-bold text-stone-700">Select Booking:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {bookingList.map((b) => (
                  <div
                    key={b.bookingId}
                    onClick={() => setSelectedBooking(b)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                      selectedBooking?.bookingId === b.bookingId
                        ? 'bg-[#FAF6ED] border-[#C6A15B] font-bold text-[#7A2438]'
                        : 'bg-white border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <div className="flex justify-between">
                      <span>Room {b.roomNumber}</span>
                      <span className="uppercase text-[10px]">{b.status}</span>
                    </div>
                    <div className="text-[10px] text-stone-500 mt-1">
                      {b.checkIn} to {b.checkOut} • ₹{b.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Booking Display */}
          {selectedBooking && (
            <div className="p-5 rounded-2xl bg-[#F6F1E8] border border-[#E7DFD2] space-y-4 text-xs animate-in fade-in">
              <div className="flex items-start justify-between pb-3 border-b border-[#E7DFD2]">
                <div>
                  <div className="text-sm font-black text-[#262626]">
                    Room {selectedBooking.roomNumber} • {selectedBooking.roomCategory || 'Executive Suite'}
                  </div>
                  <div className="text-[11px] text-stone-500 font-mono mt-0.5">
                    Internal ID: <strong>{selectedBooking.bookingId}</strong>
                  </div>
                  <div className="text-[11px] text-[#7A2438] font-bold mt-0.5">
                    Mobile Reference: +91 {selectedBooking.referencePhone || selectedBooking.guestDetails?.phone}
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  selectedBooking.status === 'PAID'
                    ? 'bg-emerald-700 text-white'
                    : selectedBooking.status === 'APPROVED'
                    ? 'bg-blue-700 text-white'
                    : selectedBooking.status === 'PENDING_APPROVAL'
                    ? 'bg-amber-600 text-white'
                    : 'bg-rose-700 text-white'
                }`}>
                  {selectedBooking.status}
                </span>
              </div>

              {/* Guest Details */}
              <div className="grid grid-cols-2 gap-3 text-stone-700">
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">Guest Name</span>
                  <span className="font-bold text-[#262626]">{selectedBooking.guestDetails?.name || 'Guest'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">Guest Category</span>
                  <span className="font-semibold">{selectedBooking.guestType}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">Stay Dates</span>
                  <span className="font-bold">{selectedBooking.checkIn} → {selectedBooking.checkOut}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">Duration & Occupancy</span>
                  <span>{selectedBooking.nights} Night(s) • Max 2 Guests</span>
                </div>
              </div>

              {/* Transparent Price Breakdown (Part 10) */}
              <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1 text-stone-700">
                <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Transparent Price Breakdown (incl. 5% GST)
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>Room Charge ({selectedBooking.nights} nights):</span>
                  <span>₹{selectedBooking.priceBreakdown?.roomBaseAmount || (selectedBooking.nights * 1200)}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>Institutional GST (5%):</span>
                  <span>₹{selectedBooking.priceBreakdown?.gstAmount || ((selectedBooking.amount || 2400) * 0.05).toFixed(2)}</span>
                </div>
                <div className="pt-1 border-t border-stone-100 flex justify-between font-black text-[#7A2438] text-xs">
                  <span>Total Payable:</span>
                  <span>₹{selectedBooking.amount}</span>
                </div>
              </div>

              {/* Action Buttons based on status */}
              {selectedBooking.status === 'APPROVED' && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenPayment) onOpenPayment(selectedBooking);
                  }}
                  className="w-full py-3 bg-[#7A2438] hover:bg-[#661C2E] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center justify-center space-x-2"
                >
                  <CreditCard className="w-4 h-4 text-[#C6A15B]" />
                  <span>Proceed to Pay (₹{selectedBooking.amount})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {selectedBooking.status === 'PAID' && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 text-xs text-emerald-950 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Payment Complete. Room allotment is confirmed. Present Government ID at reception upon check-in.</span>
                </div>
              )}

              {selectedBooking.status === 'PENDING_APPROVAL' && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 text-xs text-amber-950 flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Pending Registrar / Warden review. You will receive an SMS confirmation once approved.</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}