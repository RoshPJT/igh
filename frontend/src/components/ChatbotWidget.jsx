import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  X,
  Send,
  Minimize2,
  Maximize2,
  RefreshCw,
  HelpCircle,
  Key,
  ShieldAlert,
  ChevronDown,
  BedDouble,
  Calendar,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  FileText,
  Clock,
  UserCheck,
  ChevronRight,
  ShieldCheck,
  Check,
  ArrowRight,
  Printer
} from 'lucide-react';
import { api } from '../services/api';
import bitLogo from '../assets/bit_mesra_logo.png';

const QUICK_SHORTCUTS_EN = [
  'Book a Room',
  'Check Availability',
  'Tariffs & Rules',
  'Track Booking',
  'Report an Issue',
  'Cancel Reservation'
];

const QUICK_SHORTCUTS_HI = [
  'कमरा बुक करें',
  'उपलब्धता देखें',
  'किराया एवं नियम',
  'बुकिंग ट्रैक करें',
  'समस्या दर्ज करें',
  'आरक्षण रद्द करें'
];

export default function ChatbotWidget({ userProfile = null, lang = 'en', t = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const sessionIdRef = useRef(`sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`);

  const isHindi = lang === 'hi' || t.portalName?.includes('बीआईटी');
  const shortcuts = isHindi ? QUICK_SHORTCUTS_HI : QUICK_SHORTCUTS_EN;

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: isHindi
        ? `नमस्ते! मैं आपका **बीआईटी अतिथि स्वागत सहायक** (Receptionist) हूँ 🏛️\n\nमैं आपकी पूरी कमरा बुकिंग एवं सहायता बातचीत के माध्यम से कर सकता हूँ:\n• **कमरे खोजें और तुरंत बुक करें**\n• **किराया एवं नियम देखें** (₹1,200/रात नियत दर, 33 एसी एग्जीक्यूटिव सुइट्स)\n• **बुकिंग ट्रैक या रद्द करें**\n• **ऑनलाइन भुगतान और स्टे वाउचर**\n• **शिकायत या सेवा अनुरोध** (एसी, वाई-फाई, गीज़र)\n\nआज मैं आपकी क्या सहायता कर सकता हूँ?`
        : `Hello! I am your **BIT Guest Receptionist** 🏛️\n\nI can handle your entire stay experience conversationally:\n• **Check Availability & Book Rooms** directly in this chat\n• **Review Tariffs & Rules** (₹1,200/night flat for 33 AC Executive Suites)\n• **Track, Modify or Cancel** reservations\n• **Instant Razorpay Payment** & Official Stay Voucher\n• **Lodge Maintenance / Service Complaints** (AC, Wi-Fi, Geyser)\n\nHow may I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg = {
      id: `msg_${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }],
        }));

      const res = await api.sendChatMessage(text, sessionIdRef.current, history, userProfile);

      const aiReply = {
        id: `reply_${Date.now()}`,
        role: 'assistant',
        text: res.reply || 'Thank you for reaching out. Please let me know how else I can assist you.',
        uiCard: res.uiCard || null,
        source: res.source,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiReply]);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          text: `⚠️ **Notice:** ${err.message || 'Unable to communicate with the Assistant. Please verify server connection.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetSession = () => {
    sessionIdRef.current = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        role: 'assistant',
        text: `Session refreshed! I am ready to help you with booking, tariffs, status tracking, or complaint registration.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Helper text formatter
  const renderFormattedText = (rawText) => {
    if (!rawText) return null;
    const lines = rawText.split('\n');
    return lines.map((line, idx) => {
      let content = line;
      // Bold replacer
      const parts = content.split(/(\*\*.*?\*\*)/g);
      return (
        <div key={idx} className={line.trim() === '' ? 'h-2' : 'min-h-[1.25rem]'}>
          {parts.map((p, pIdx) => {
            if (p.startsWith('**') && p.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-semibold text-slate-900">
                  {p.slice(2, -2)}
                </strong>
              );
            }
            if (p.startsWith('`') && p.endsWith('`')) {
              return (
                <code key={pIdx} className="bg-slate-100 text-bit-maroon px-1 py-0.5 rounded text-[10px] font-mono">
                  {p.slice(1, -1)}
                </code>
              );
            }
            return p;
          })}
        </div>
      );
    });
  };

  // Render UI Cards
  const renderCard = (uiCard) => {
    if (!uiCard) return null;

    // 1. Room Selection Cards
    if (uiCard.type === 'room_selection') {
      const { checkIn, checkOut, nights, ratePerNight, totalAmount, rooms = [] } = uiCard;
      return (
        <div className="mt-3 p-3 bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-xl border border-blue-200/80 shadow-sm text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-blue-100 mb-2.5">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-blue-700">Available Rooms</span>
              <div className="font-semibold text-slate-800 text-[11px]">
                {checkIn} → {checkOut} ({nights} night{nights > 1 ? 's' : ''})
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500">Tariff</span>
              <div className="font-bold text-emerald-700 text-xs">₹{totalAmount}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
            {rooms.map((r) => (
              <div
                key={r.roomNumber}
                className="p-2.5 bg-white rounded-lg border border-slate-200 hover:border-bit-maroon transition shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">Room {r.roomNumber}</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-medium">
                      Floor {r.floor}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-medium">AC Executive Suite</div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    <span className="text-[9px] bg-blue-50 text-blue-700 px-1 py-0.5 rounded">AC</span>
                    <span className="text-[9px] bg-blue-50 text-blue-700 px-1 py-0.5 rounded">Wi-Fi</span>
                    <span className="text-[9px] bg-blue-50 text-blue-700 px-1 py-0.5 rounded">Geyser</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleSendMessage(`Room ${r.roomNumber}`)}
                  className="mt-2.5 w-full py-1.5 bg-bit-maroon hover:bg-bit-maroon-hover text-white text-[11px] font-semibold rounded-md flex items-center justify-center space-x-1 transition shadow-xs"
                >
                  <span>Select Room {r.roomNumber}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 2. Missing Guest Details Form / Quick Buttons
    if (uiCard.type === 'guest_details_form') {
      const { missingFields = [] } = uiCard;
      return (
        <div className="mt-2.5 p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs">
          <div className="font-bold text-amber-900 flex items-center space-x-1.5 mb-1.5">
            <UserCheck className="w-4 h-4 text-amber-600" />
            <span>Missing Guest Details</span>
          </div>
          <p className="text-[11px] text-amber-800 mb-2">
            Please select your guest category or type your details:
          </p>
          <div className="grid grid-cols-2 gap-1.5 mb-2">
            {['Student', 'Parent', 'Alumni', 'Other College Guest'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleSendMessage(`I am a ${cat}`)}
                className="py-1 px-2 bg-white hover:bg-bit-maroon hover:text-white border border-amber-300 rounded text-[11px] font-medium text-slate-700 transition text-center shadow-2xs"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // 3. Booking Summary Card
    if (uiCard.type === 'booking_summary') {
      const { summary } = uiCard;
      return (
        <div className="mt-3 p-3.5 bg-gradient-to-b from-white to-slate-50 rounded-xl border-2 border-bit-gold/60 shadow-md text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-2.5">
            <div className="flex items-center space-x-1.5">
              <BedDouble className="w-4 h-4 text-bit-maroon" />
              <span className="font-bold text-slate-900 text-xs">Booking Summary</span>
            </div>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-[10px] font-semibold">
              Pending Confirmation
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 mb-3 bg-slate-50/80 p-2.5 rounded-lg border border-slate-200">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Room</span>
              <span className="font-semibold text-slate-900">Room {summary.roomNumber}</span> ({summary.roomType})
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Guest</span>
              <span className="font-semibold text-slate-900">{summary.guestName}</span> ({summary.guestType})
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Dates</span>
              {summary.checkIn} → {summary.checkOut}
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Duration & Rate</span>
              {summary.nights} nights @ ₹{summary.ratePerNight}/night
            </div>
            <div className="col-span-2 pt-1 border-t border-slate-200 flex justify-between items-center">
              <span className="font-bold text-slate-800">Total Payable:</span>
              <span className="text-sm font-extrabold text-bit-maroon">₹{summary.totalAmount}</span>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => handleSendMessage('Yes, confirm booking')}
              className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition shadow-sm flex items-center justify-center space-x-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Confirm & Book</span>
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage('Cancel booking')}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    // 4. Payment Checkout Card (Razorpay Simulator)
    if (uiCard.type === 'payment_checkout') {
      const { paymentDetails, booking } = uiCard;
      const bId = paymentDetails?.bookingId || booking?.bookingId;
      const amt = paymentDetails?.amount || booking?.amount || 1200;

      return (
        <div className="mt-3 p-3.5 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-xl shadow-lg text-xs border border-blue-800">
          <div className="flex items-center justify-between pb-2 border-b border-blue-800/80 mb-2.5">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-blue-400" />
              <span className="font-bold text-sm tracking-wide">Razorpay Gateway</span>
            </div>
            <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded font-mono">
              3D SECURE
            </span>
          </div>

          <div className="space-y-1.5 mb-3 bg-white/5 p-2.5 rounded-lg border border-white/10">
            <div className="flex justify-between">
              <span className="text-slate-400 text-[10px]">Booking Reference:</span>
              <span className="font-mono font-bold text-amber-300">{bId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 text-[10px]">Payee:</span>
              <span className="font-medium">BIT Mesra Hospitality</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-white/10">
              <span className="text-slate-300 font-bold">Total Amount:</span>
              <span className="text-base font-extrabold text-emerald-400">₹{amt}</span>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 mb-2.5 flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Supported: UPI (GPay/PhonePe), Credit & Debit Cards, NetBanking</span>
          </div>

          <button
            type="button"
            onClick={() => handleSendMessage('Pay now')}
            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-lg shadow-md transition flex items-center justify-center space-x-1.5"
          >
            <span>Pay ₹{amt} via Razorpay</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      );
    }

    // 5. Official Stay Voucher Card
    if (uiCard.type === 'stay_voucher') {
      const { booking } = uiCard;
      return (
        <div className="mt-3 p-3.5 bg-gradient-to-br from-emerald-50 via-teal-50 to-white rounded-xl border-2 border-emerald-500/70 shadow-md text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-200 mb-2.5">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-emerald-950 text-xs">Official Stay Voucher</span>
            </div>
            <span className="px-2 py-0.5 bg-emerald-600 text-white rounded-full text-[10px] font-bold">
              CONFIRMED & PAID
            </span>
          </div>

          <div className="bg-white p-2.5 rounded-lg border border-emerald-200 space-y-1.5 mb-2.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-500">Booking ID:</span>
              <span className="font-mono font-bold text-sm text-bit-maroon">{booking?.bookingId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-500">Room Number:</span>
              <span className="font-bold text-slate-900">Room {booking?.roomNumber} (AC Executive Suite)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-500">Stay Duration:</span>
              <span className="font-medium text-slate-800">{booking?.checkIn} to {booking?.checkOut}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-500">Guest Name:</span>
              <span className="font-semibold text-slate-900">{booking?.guestDetails?.name || 'Guest'}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] pt-1 border-t border-slate-100">
              <span className="text-slate-400">Transaction ID:</span>
              <span className="font-mono text-slate-600">{booking?.paymentDetails?.transactionId || 'Verified'}</span>
            </div>
          </div>

          <div className="p-2 bg-emerald-100/60 rounded text-[10px] text-emerald-900 flex items-center justify-between">
            <span>Security Pass: Show this voucher or Booking ID at campus main gate.</span>
          </div>
        </div>
      );
    }

    // 6. Complaint Ticket Card
    if (uiCard.type === 'complaint_ticket') {
      const { complaint } = uiCard;
      return (
        <div className="mt-3 p-3 bg-amber-50/80 rounded-xl border border-amber-300 text-xs shadow-sm">
          <div className="flex items-center justify-between pb-1.5 border-b border-amber-200 mb-2">
            <div className="flex items-center space-x-1.5 font-bold text-amber-950">
              <Wrench className="w-4 h-4 text-amber-600" />
              <span>Maintenance Ticket</span>
            </div>
            <span className="px-2 py-0.5 bg-amber-600 text-white rounded text-[10px] font-bold">
              {complaint?.status || 'OPEN'}
            </span>
          </div>
          <div className="space-y-1 text-slate-700 text-[11px] mb-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Ticket ID:</span>
              <span className="font-mono font-bold text-slate-900">{complaint?.complaintId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Room:</span>
              <span className="font-semibold text-slate-900">Room {complaint?.roomNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Category:</span>
              <span className="font-medium text-slate-800">{complaint?.category}</span>
            </div>
            <div className="pt-1 text-[11px] text-slate-800 bg-white p-2 rounded border border-amber-200">
              <span className="font-semibold text-slate-900 block text-[10px] text-slate-400 uppercase">Issue Description</span>
              {complaint?.issueDescription}
            </div>
          </div>
          <div className="text-[10px] text-amber-800 font-medium">
            Campus facility support team has been dispatched to inspect Room {complaint?.roomNumber}.
          </div>
        </div>
      );
    }

    // 7. Booking Status Tracking Card
    if (uiCard.type === 'booking_status') {
      const { booking } = uiCard;
      return (
        <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200 shadow-sm text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
            <span className="font-mono font-bold text-bit-maroon text-sm">{booking?.bookingId}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                booking?.status === 'PAID'
                  ? 'bg-emerald-100 text-emerald-800'
                  : booking?.status === 'APPROVED'
                  ? 'bg-blue-100 text-blue-800'
                  : booking?.status === 'CANCELLED'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {booking?.status}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-700 mb-2">
            <div>Room: <strong className="text-slate-900">{booking?.roomNumber}</strong></div>
            <div>Tariff: <strong className="text-slate-900">₹{booking?.amount}</strong></div>
            <div className="col-span-2">Dates: <strong>{booking?.checkIn}</strong> to <strong>{booking?.checkOut}</strong></div>
            <div className="col-span-2">Guest: <strong>{booking?.guestDetails?.name}</strong> ({booking?.guestType})</div>
          </div>
          {booking?.status === 'APPROVED' && booking?.paymentStatus !== 'PAID' && (
            <button
              type="button"
              onClick={() => handleSendMessage(`Pay for ${booking.bookingId}`)}
              className="w-full mt-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-xs transition"
            >
              Proceed to Payment (₹{booking.amount})
            </button>
          )}
          {booking?.status !== 'CANCELLED' && (
            <button
              type="button"
              onClick={() => handleSendMessage(`Cancel ${booking.bookingId}`)}
              className="w-full mt-1.5 py-1 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded text-[11px] font-semibold transition"
            >
              Cancel Reservation
            </button>
          )}
        </div>
      );
    }

    // 8. Cancellation Confirmation Card
    if (uiCard.type === 'cancel_confirmation') {
      const { booking } = uiCard;
      return (
        <div className="mt-3 p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs">
          <div className="font-bold text-rose-900 flex items-center space-x-1 mb-1">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Confirm Cancellation</span>
          </div>
          <p className="text-[11px] text-rose-800 mb-2">
            Are you sure you want to cancel booking <strong>{booking?.bookingId}</strong> for Room {booking?.roomNumber}?
          </p>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => handleSendMessage('Yes')}
              className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded text-xs transition"
            >
              Yes, Cancel Booking
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage('No')}
              className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded text-xs font-medium"
            >
              Keep Booking
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center space-x-2.5 px-4 py-3 bg-[#0B254A] hover:bg-[#12386E] text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-bit-gold/70"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-white p-0.5 flex items-center justify-center shadow">
              <img
                src={bitLogo}
                alt="BIT Mesra Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-blue-900" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold tracking-wide">
              {isHindi ? 'AI बुकिंग सहायक' : 'AI Booking Agent'}
            </div>
            <div className="text-[10px] text-amber-200 flex items-center space-x-1">
              <Sparkles className="w-2.5 h-2.5 text-[#FF9A00]" />
              <span>{isHindi ? 'चैट द्वारा बुक करें' : 'Book via Chat'}</span>
            </div>
          </div>
        </button>
      )}

      {/* Expandable Chat Window */}
      {isOpen && (
        <div
          className={`flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transition-all duration-300 ${
            isExpanded
              ? 'w-[92vw] sm:w-[680px] h-[82vh] sm:h-[700px]'
              : 'w-[92vw] sm:w-[420px] h-[580px]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#081B33] via-[#0E2E5C] to-[#143B70] p-3.5 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-full bg-white p-0.5 flex items-center justify-center shadow flex-shrink-0">
                <img
                  src={bitLogo}
                  alt="BIT Mesra Crest"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div>
                <div className="font-bold text-sm tracking-wide flex items-center space-x-1.5">
                  <span>BIT Guest Receptionist</span>
                  <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded text-[9px] font-semibold">
                    AI Agent
                  </span>
                </div>
                <div className="text-[10px] text-blue-200 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>33 Rooms • ₹1,200/night • Instant Booking</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              {/* Expand / Minimize Toggle */}
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 hover:bg-white/10 rounded-lg text-blue-200 hover:text-white transition"
                title={isExpanded ? 'Standard view' : 'Wide view'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              {/* Reset Session */}
              <button
                type="button"
                onClick={handleResetSession}
                className="p-1.5 hover:bg-white/10 rounded-lg text-blue-200 hover:text-white transition"
                title="Restart conversation"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              {/* Close */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg text-blue-200 hover:text-white transition"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/70 text-xs">
            {messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <div key={m.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 shadow-xs leading-relaxed ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                    }`}
                  >
                    <div>{renderFormattedText(m.text)}</div>
                    {/* Embedded UI Card */}
                    {m.uiCard && renderCard(m.uiCard)}
                    <div
                      className={`text-[9px] mt-1.5 text-right ${
                        isUser ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      {m.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-xs flex items-center space-x-2 text-slate-500 text-xs">
                  <div className="w-2 h-2 rounded-full bg-bit-maroon animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-bit-gold animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-bit-maroon animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] font-medium text-slate-400 pl-1">
                    AI receptionist checking availability & guidelines...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick-Reply Shortcuts */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center space-x-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex-shrink-0">
              {isHindi ? 'त्वरित क्रियाएं:' : 'Quick Actions:'}
            </span>
            {shortcuts.map((shortcut) => (
              <button
                key={shortcut}
                type="button"
                disabled={isLoading}
                onClick={() => handleSendMessage(shortcut)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-[#EE6200] hover:text-white text-slate-700 text-[11px] font-medium border border-slate-200 transition"
              >
                {shortcut}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-200">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="E.g., Book an AC room for two from 15 Nov to 18 Nov..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-bit-maroon/20 focus:border-bit-maroon"
              />
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className={`p-2.5 rounded-xl text-white transition ${
                  !inputMessage.trim() || isLoading
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-bit-maroon hover:bg-bit-maroon-hover shadow-md'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="text-[9px] text-center text-slate-400 mt-1.5 flex items-center justify-center space-x-1">
              <Sparkles className="w-3 h-3 text-bit-gold" />
              <span>Full conversational booking • Real-time DB sync • Razorpay simulator</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
