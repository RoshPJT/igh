import React, { useState } from 'react';
import {
  CreditCard,
  Smartphone,
  Building,
  CheckCircle2,
  Lock,
  ShieldCheck,
  X,
  ArrowRight,
  AlertCircle,
  QrCode
} from 'lucide-react';
import { api } from '../services/api';
import bitLogo from '../assets/bit_mesra_logo.png';

export default function PaymentModal({ booking, onClose, onPaymentSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi', 'card', 'netbanking'
  const [upiId, setUpiId] = useState('guest@oksbi');
  const [upiApp, setUpiApp] = useState('gpay');

  // Card fields
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('821');
  const [cardName, setCardName] = useState(booking?.guestDetails?.name || 'Rohan Verma');

  // Netbanking
  const [selectedBank, setSelectedBank] = useState('SBI');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState('form'); // 'form', 'processing', 'success'
  const [error, setError] = useState('');
  const [txnId, setTxnId] = useState('');

  if (!booking) return null;

  const handleSimulatePayment = async () => {
    setError('');
    setIsProcessing(true);
    setStep('processing');

    const generatedTxn = `RZP_BIT_${Date.now().toString().slice(-6)}_${Math.floor(1000 + Math.random() * 9000)}`;
    setTxnId(generatedTxn);

    // Simulate 1.5 seconds network/bank latency
    setTimeout(async () => {
      try {
        const methodLabel =
          paymentMethod === 'upi'
            ? `UPI (${upiApp.toUpperCase()} - ${upiId})`
            : paymentMethod === 'card'
            ? `Card (Ending in ${cardNumber.slice(-4)})`
            : `NetBanking (${selectedBank})`;

        const res = await api.payBooking(booking.bookingId, methodLabel, generatedTxn);

        setIsProcessing(false);
        setStep('success');

        if (onPaymentSuccess) {
          onPaymentSuccess(res.data);
        }
      } catch (err) {
        setIsProcessing(false);
        setStep('form');
        setError(err.message || 'Payment simulation failed. Please retry.');
      }
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Razorpay-style Header */}
        <div className="bg-gradient-to-r from-bit-maroon via-bit-maroon-dark to-slate-950 text-white p-5 sm:p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-white p-0.5 flex items-center justify-center shadow">
              <img
                src={bitLogo}
                alt="BIT Mesra Official Seal"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-bit-gold font-bold flex items-center space-x-1">
                <Lock className="w-3 h-3" />
                <span>Simulated Secure Payment Gateway</span>
              </div>
              <h3 className="text-lg font-black text-white">
                BIT Mesra Guest House Checkout
              </h3>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-rose-200 font-semibold">
                Ref: {booking.bookingId} • Room {booking.roomNumber} ({booking.nights} night{booking.nights > 1 ? 's' : ''})
              </div>
              <div className="text-xs text-slate-300">
                Guest: {booking.guestDetails?.name}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-300 uppercase tracking-wider block">Total Amount</span>
              <span className="text-2xl font-black text-bit-gold">
                ₹{booking.amount?.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        {step === 'processing' ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 border-4 border-bit-maroon/20 border-t-bit-maroon rounded-full animate-spin mx-auto" />
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900">
                Connecting to Institutional Banking Gateway...
              </h4>
              <p className="text-xs text-slate-500">
                Simulating 3D Secure 2.0 authorization for ₹{booking.amount?.toLocaleString('en-IN')}. Please do not refresh.
              </p>
            </div>
          </div>
        ) : step === 'success' ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h4 className="text-2xl font-black text-slate-900">
                Payment Successful!
              </h4>
              <p className="text-xs text-slate-500">
                Transaction ID: <span className="font-mono font-bold text-slate-800">{txnId}</span>
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-left text-xs text-emerald-950 space-y-2">
              <div className="flex items-center justify-between font-bold">
                <span>Room {booking.roomNumber} is now Officially Booked</span>
                <span className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px]">
                  STATUS: PAID
                </span>
              </div>
              <p className="text-slate-600">
                Your reservation is locked in the system. The visual floor map now marks Room {booking.roomNumber} as <strong>Booked (Red)</strong>.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 bg-bit-maroon hover:bg-bit-maroon-hover text-white font-bold rounded-xl shadow-md transition"
            >
              Done & View Reservation Voucher
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center space-x-2 border border-rose-200">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`py-3 px-2 rounded-xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
                  paymentMethod === 'upi'
                    ? 'border-bit-maroon bg-rose-50/50 text-bit-maroon font-bold ring-2 ring-bit-gold/50'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Smartphone className="w-5 h-5" />
                <span className="text-xs">UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-3 px-2 rounded-xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
                  paymentMethod === 'card'
                    ? 'border-bit-maroon bg-rose-50/50 text-bit-maroon font-bold ring-2 ring-bit-gold/50'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-xs">Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`py-3 px-2 rounded-xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
                  paymentMethod === 'netbanking'
                    ? 'border-bit-maroon bg-rose-50/50 text-bit-maroon font-bold ring-2 ring-bit-gold/50'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Building className="w-5 h-5" />
                <span className="text-xs">NetBanking</span>
              </button>
            </div>

            {/* UPI Option */}
            {paymentMethod === 'upi' && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {['gpay', 'phonepe', 'paytm'].map((app) => (
                    <button
                      key={app}
                      type="button"
                      onClick={() => setUpiApp(app)}
                      className={`p-2 rounded-xl border text-xs font-bold capitalize transition ${
                        upiApp === app
                          ? 'border-bit-maroon bg-bit-maroon/5 text-bit-maroon'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {app === 'gpay' ? 'Google Pay' : app}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Virtual Payment Address (VPA / UPI ID)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-bit-maroon/20 focus:border-bit-maroon"
                      placeholder="e.g. yourname@okhdfcbank"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    A mock collect request will be approved automatically.
                  </p>
                </div>
              </div>
            )}

            {/* Card Option */}
            {paymentMethod === 'card' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-bit-maroon/20 focus:border-bit-maroon"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-bit-maroon/20 focus:border-bit-maroon"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">CVV</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-bit-maroon/20 focus:border-bit-maroon"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Name on Card</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-bit-maroon/20 focus:border-bit-maroon"
                  />
                </div>
              </div>
            )}

            {/* Netbanking Option */}
            {paymentMethod === 'netbanking' && (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Choose Partner Bank
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Punjab National Bank', 'Bank of India'].map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition text-left ${
                        selectedBank === bank
                          ? 'border-bit-maroon bg-bit-maroon/5 text-bit-maroon'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Pay Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSimulatePayment}
                className="w-full py-3.5 bg-gradient-to-r from-bit-maroon to-bit-maroon-dark hover:from-bit-maroon-hover hover:to-bit-maroon text-white font-extrabold rounded-xl shadow-lg transition flex items-center justify-center space-x-2 text-sm"
              >
                <span>Pay ₹{booking.amount?.toLocaleString('en-IN')} Now</span>
                <ArrowRight className="w-4 h-4 text-bit-gold" />
              </button>
              <div className="flex items-center justify-center space-x-1.5 text-[10px] text-slate-400 mt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Simulated 256-Bit SSL Encrypted Sandbox Gateway</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
