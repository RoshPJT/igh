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
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import bitLogo from '../assets/bit_mesra_logo.png';

export default function TrackBookingModal({
  isOpen,
  initialBookingId,
  onClose,
  onOpenPayment,
}) {
  const [bookingIdInput, setBookingIdInput] = useState(initialBookingId || '');
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialBookingId) {
      setBookingIdInput(initialBookingId);
      lookupBooking(initialBookingId);
    }
  }, [initialBookingId]);

  if (!isOpen) return null;

  const lookupBooking = async (idToSearch) => {
    const id = idToSearch || bookingIdInput;
    if (!id.trim()) {
      setError('Please enter a Booking Reference ID');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const res = await api.getBookingById(id.trim());
      setIsLoading(false);
      if (res.success && res.data) {
        setBooking(res.data);
      } else {
        setError(res.message || 'No booking found');
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Booking not found. Please verify the reference ID.');
      setBooking(null);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    lookupBooking(bookingIdInput);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-bit-maroon text-white p-4 sm:p-5 border-b-2 border-bit-gold flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white p-0.5 flex items-center justify-center shadow flex-shrink-0">
              <img
                src={bitLogo}
                alt="BIT Mesra Seal"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold leading-tight">Track Booking & Payment</h3>
              <p className="text-[11px] text-amber-200">BIT Mesra Official Campus Portal</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Search Form */}
          <form onSubmit={handleFormSubmit} className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Enter Booking ID (e.g. BIT-GH-XXXX)
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="e.g. BIT-GH-1002"
                value={bookingIdInput}
                onChange={(e) => setBookingIdInput(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-bit-maroon/20 focus:border-bit-maroon"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2.5 bg-bit-maroon hover:bg-bit-maroon-hover text-white text-xs sm:text-sm font-bold rounded-xl shadow transition"
              >
                {isLoading ? 'Searching...' : 'Check Status'}
              </button>
            </div>

            {/* Quick Demo links */}
            <div className="flex items-center space-x-2 pt-1 text-[11px] text-slate-500">
              <span>Test Pre-seeded Bookings:</span>
              <button
                type="button"
                onClick={() => {
                  setBookingIdInput('BIT-GH-1002');
                  lookupBooking('BIT-GH-1002');
                }}
                className="text-bit-maroon font-bold underline hover:text-blue-800"
              >
                BIT-GH-1002 (Approved)
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  setBookingIdInput('BIT-GH-1001');
                  lookupBooking('BIT-GH-1001');
                }}
                className="text-bit-maroon font-bold underline hover:text-blue-800"
              >
                BIT-GH-1001 (Paid)
              </button>
            </div>
          </form>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Booking Status Card */}
          {booking && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
              {/* Reference & Status */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Reference</div>
                  <div className="text-base font-mono font-black text-bit-maroon">
                    {booking.bookingId}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Current Status</div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      booking.status === 'PENDING_APPROVAL'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : booking.status === 'APPROVED'
                        ? 'bg-blue-100 text-blue-900 border border-blue-300'
                        : booking.status === 'PAID'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'bg-rose-100 text-rose-900 border border-rose-300'
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="grid grid-cols-4 gap-1 text-center py-1">
                {[
                  { label: '1. Submitted', active: true, done: true },
                  {
                    label: '2. Warden Review',
                    active: booking.status !== 'PENDING_APPROVAL' || true,
                    done: booking.status === 'APPROVED' || booking.status === 'PAID',
                  },
                  {
                    label: '3. Payment',
                    active: booking.status === 'APPROVED' || booking.status === 'PAID',
                    done: booking.status === 'PAID',
                  },
                  {
                    label: '4. Confirmed',
                    active: booking.status === 'PAID',
                    done: booking.status === 'PAID',
                  },
                ].map((step, idx) => (
                  <div key={idx} className="space-y-1">
                    <div
                      className={`h-1.5 rounded-full ${
                        step.done
                          ? 'bg-emerald-500'
                          : step.active
                          ? 'bg-amber-400'
                          : 'bg-slate-200'
                      }`}
                    />
                    <span className="text-[9px] font-semibold text-slate-500 block leading-tight">
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Booking Details */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-white p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Guest</span>
                  <span className="font-bold text-slate-800">{booking.guestDetails?.name}</span>
                  <div className="text-[11px] text-slate-500">{booking.guestType}</div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Room Assigned</span>
                  <span className="font-bold text-slate-800">Room {booking.roomNumber}</span>
                  <div className="text-[11px] text-slate-500">AC Executive Suite</div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Dates</span>
                  <span className="font-semibold text-slate-800">
                    {booking.checkIn} to {booking.checkOut}
                  </span>
                  <div className="text-[11px] text-slate-500">{booking.nights} night(s)</div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Tariff</span>
                  <span className="text-sm font-black text-bit-maroon">
                    ₹{booking.amount?.toLocaleString('en-IN')}
                  </span>
                  <div className="text-[11px] text-slate-500">
                    {booking.paymentStatus === 'PAID' ? 'Payment Received' : 'Payment Pending'}
                  </div>
                </div>
              </div>

              {/* Status Specific Messages */}
              {booking.status === 'PENDING_APPROVAL' && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start space-x-2">
                  <Clock className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Awaiting Warden Approval</span>
                    <span>
                      Your request is in the Warden's approval queue. Once verified, the payment button will unlock here.
                    </span>
                  </div>
                </div>
              )}

              {booking.status === 'APPROVED' && (
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Application Approved by Warden!</span>
                      <span>{booking.approvalNotes || 'Credentials confirmed. Please proceed to payment.'}</span>
                    </div>
                  </div>

                  {/* PROCEED TO PAY BUTTON (Core Requirement D) */}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onOpenPayment) onOpenPayment(booking);
                    }}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-black text-sm rounded-xl shadow-lg transition flex items-center justify-center space-x-2 animate-pulse-subtle"
                  >
                    <CreditCard className="w-5 h-5 text-emerald-100" />
                    <span>Proceed to Pay (₹{booking.amount?.toLocaleString('en-IN')})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {booking.status === 'PAID' && (
                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Reservation Confirmed & Paid</span>
                  </div>
                  <p className="text-slate-600">
                    Payment Method: {booking.paymentDetails?.method || 'Online Banking'}
                  </p>
                  <p className="text-slate-600">
                    Transaction: {booking.paymentDetails?.transactionId || 'Confirmed'}
                  </p>
                </div>
              )}

              {booking.status === 'REJECTED' && (
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-900 flex items-start space-x-2">
                  <XCircle className="w-4 h-4 text-rose-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Request Not Approved</span>
                    <span>Reason: {booking.rejectionReason || 'Institutional quota unavailable.'}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
