import React from 'react';
import {
  X,
  Printer,
  CheckCircle2,
  ShieldCheck,
  Building,
  Calendar,
  Bed,
  User,
  QrCode
} from 'lucide-react';
import bitLogo from '../assets/bit_mesra_logo.png';

export default function StayVoucherModal({ booking, onClose }) {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Top Header */}
        <div className="bg-bit-maroon text-white p-4 flex items-center justify-between border-b-2 border-bit-gold">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold">Official Guest House Allotment Voucher</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Voucher Paper */}
        <div className="p-6 space-y-5 bg-white text-slate-900" id="printable-voucher">
          {/* Institute Letterhead */}
          <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1">
            <img
              src={bitLogo}
              alt="Birla Institute of Technology, Mesra"
              className="w-16 h-16 object-contain mx-auto mb-1 drop-shadow-sm"
            />
            <h2 className="text-sm font-black uppercase tracking-wider text-bit-maroon">
              Birla Institute of Technology, Mesra
            </h2>
            <p className="text-[11px] text-slate-600 font-semibold">
              Guest House Administration • Main Campus, Ranchi - 835215, Jharkhand
            </p>
            <div className="inline-block px-3 py-0.5 bg-emerald-100 text-emerald-900 rounded-full text-[10px] font-black uppercase tracking-widest mt-1">
              Confirmed Reservation • Paid
            </div>
          </div>

          {/* Reference & QR Code */}
          <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Booking Reference ID
              </span>
              <span className="text-base font-mono font-black text-bit-maroon">
                {booking.bookingId}
              </span>
              <div className="text-[10px] text-slate-500">
                Issued: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>

            {/* Simulated Campus Gate QR */}
            <div className="text-center">
              <div className="w-14 h-14 bg-white p-1 rounded-lg border border-slate-300 shadow-sm flex items-center justify-center mx-auto">
                <QrCode className="w-12 h-12 text-slate-800" />
              </div>
              <span className="text-[9px] font-bold text-slate-500 uppercase mt-0.5 block">
                Gate Pass QR
              </span>
            </div>
          </div>

          {/* Voucher Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase text-slate-400 font-bold block">Room Allotment</span>
              <span className="text-sm font-black text-slate-900">Room {booking.roomNumber}</span>
              <span className="text-[10px] text-slate-500 block">AC Executive Suite (Floor {booking.roomNumber > 200 ? 2 : 1})</span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase text-slate-400 font-bold block">Guest Name</span>
              <span className="text-sm font-bold text-slate-900">{booking.guestDetails?.name}</span>
              <span className="text-[10px] text-slate-500 block">Category: {booking.guestType}</span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase text-slate-400 font-bold block">Check-In</span>
              <span className="font-bold text-slate-900">{booking.checkIn}</span>
              <span className="text-[10px] text-slate-500 block">From 12:00 PM (Noon)</span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase text-slate-400 font-bold block">Check-Out</span>
              <span className="font-bold text-slate-900">{booking.checkOut}</span>
              <span className="text-[10px] text-slate-500 block">Until 11:00 AM</span>
            </div>
          </div>

          {/* Tariff & Payment Info */}
          <div className="border-t border-b border-slate-200 py-2.5 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500">Tariff: ₹1,200 × {booking.nights} night(s)</span>
              <div className="text-[10px] text-slate-400">
                Txn: {booking.paymentDetails?.transactionId || 'ONLINE_TXN'}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Amount Paid</span>
              <span className="text-base font-black text-bit-maroon">
                ₹{booking.amount?.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Campus Rules Notice */}
          <div className="text-[10px] text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">Important Instructions for Guests:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Show original Govt ID / Student Roll card at the reception during check-in.</li>
              <li>Produce this voucher or the QR code at the Main Campus Security Gate.</li>
              <li>Guest House Dining Hall serving hours: Breakfast (8-10 AM), Dinner (8-10 PM).</li>
            </ul>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-bit-maroon hover:bg-bit-maroon-hover text-white shadow flex items-center space-x-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Voucher</span>
          </button>
        </div>
      </div>
    </div>
  );
}
