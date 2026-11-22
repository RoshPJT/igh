import React from 'react';
import {
  X,
  Calendar,
  Bed,
  CheckCircle2,
  Clock,
  CreditCard,
  Printer,
  AlertCircle,
  FileText
} from 'lucide-react';

export default function MyBookingsModal({
  isOpen,
  onClose,
  bookings = [],
  currentUser,
  onOpenPayment,
  onOpenVoucher,
}) {
  if (!isOpen) return null;

  // Filter bookings matching currentUser's phone or show recent if none match
  const userBookings = bookings.filter((b) => {
    if (!currentUser) return false;
    const phone = b.guestDetails?.phone || '';
    const cleanUserPhone = (currentUser.phone || '').replace(/\D/g, '');
    const cleanBPhone = phone.replace(/\D/g, '');
    return cleanUserPhone && cleanBPhone && (cleanBPhone.includes(cleanUserPhone) || cleanUserPhone.includes(cleanBPhone));
  });

  const displayList = userBookings.length > 0 ? userBookings : bookings.slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b-2 border-bit-gold flex-shrink-0">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <FileText className="w-5 h-5 text-bit-gold" />
              <span>My Campus Stay Bookings</span>
            </h3>
            {currentUser && (
              <p className="text-xs text-blue-200 mt-0.5">
                Logged in as <strong>{currentUser.name}</strong> ({currentUser.phone})
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {displayList.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold">No bookings found for your number yet.</p>
              <p className="text-xs text-slate-400 mt-1">Reserve an Executive Suite to see it listed here.</p>
            </div>
          ) : (
            displayList.map((b) => {
              const isPaid = b.status === 'PAID';
              const isApproved = b.status === 'APPROVED';
              const isPending = b.status === 'PENDING_APPROVAL';

              return (
                <div
                  key={b.bookingId}
                  className="bg-slate-50 rounded-2xl p-4 border border-slate-200 hover:border-slate-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-black text-sm text-bit-maroon">
                        {b.bookingId}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isPaid
                            ? 'bg-rose-100 text-rose-800'
                            : isApproved
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-800">
                      Room {b.roomNumber} (Floor {b.roomNumber >= 200 ? 2 : 1}) • {b.guestType}
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center space-x-2">
                      <span>{b.checkIn} to {b.checkOut} ({b.nights} nights)</span>
                      <span>•</span>
                      <span className="font-semibold text-slate-700">₹{b.amount}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-center">
                    {isApproved && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenPayment(b);
                        }}
                        className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-xs rounded-xl shadow-xs hover:brightness-110 flex items-center space-x-1"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Pay ₹{b.amount}</span>
                      </button>
                    )}

                    {isPaid && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenVoucher(b);
                        }}
                        className="px-3 py-1.5 bg-slate-900 text-amber-300 font-bold text-xs rounded-xl shadow-xs hover:bg-slate-800 flex items-center space-x-1"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>View Pass</span>
                      </button>
                    )}

                    {isPending && (
                      <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                        Awaiting Warden Approval
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
