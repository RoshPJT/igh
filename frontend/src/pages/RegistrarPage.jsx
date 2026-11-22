import React from 'react';
import { Shield, Lock, ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import WardenDashboard from '../components/WardenDashboard';

export default function RegistrarPage({
  isWardenAuthenticated,
  onOpenWardenLogin,
  onLogoutWarden,
  rooms = [],
  bookings = [],
  onRefreshData,
  onRoomsUpdated,
  onBookingApproved,
  t = {},
}) {
  if (!isWardenAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#7A2438]/10 text-[#7A2438] flex items-center justify-center mx-auto border-2 border-[#C6A15B] shadow-lg">
          <Shield className="w-8 h-8 text-[#7A2438]" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Restricted Registrar Administration
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
            This console is reserved exclusively for authorized BIT Mesra Registrar Officers and Guest House Administration to review institutional credentials and approve suite allotments.
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl shadow-md border border-[#E7DFD2] space-y-3">
          <button
            type="button"
            onClick={onOpenWardenLogin}
            className="w-full py-3 bg-[#7A2438] hover:bg-[#661C2E] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center space-x-2"
          >
            <Lock className="w-4 h-4 text-[#C6A15B]" />
            <span>Login with Registrar Credentials</span>
          </button>

          <Link
            to="/"
            className="block text-xs font-semibold text-stone-500 hover:text-[#7A2438] transition"
          >
            ← Return to Guest Portal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Session Active Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white text-stone-800 p-4 rounded-2xl border-2 border-[#C6A15B] shadow-md gap-3">
        <div className="flex items-center space-x-2.5">
          <span className="w-8 h-8 rounded-full bg-[#7A2438] text-white flex items-center justify-center shadow-xs">
            <Shield className="w-4 h-4 text-[#C6A15B]" />
          </span>
          <div>
            <div className="text-xs font-black text-stone-900 uppercase tracking-wider">
              Authorized Registrar Management Session Active
            </div>
            <div className="text-[11px] text-stone-500">
              Registrar Office • BIT Mesra Guest House Administration Console
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onLogoutWarden}
            className="px-3.5 py-1.5 bg-[#F6F1E8] hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition border border-[#E7DFD2]"
          >
            Sign Out of Registrar Console
          </button>
        </div>
      </div>

      <WardenDashboard
        rooms={rooms}
        bookings={bookings}
        onRefreshData={onRefreshData}
        onRoomsUpdated={onRoomsUpdated}
        onBookingApproved={onBookingApproved}
      />
    </div>
  );
}
