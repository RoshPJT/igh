import React, { useRef, useEffect } from 'react';
import {
  CalendarCheck,
  Bed,
  ShieldCheck,
  Sparkles,
  Info,
  Clock,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import SearchWidget from '../components/SearchWidget';
import FloorMap from '../components/FloorMap';
import BookingForm from '../components/BookingForm';

export default function BookingPage({
  rooms = [],
  selectedRoom,
  onSelectRoom,
  checkIn,
  checkOut,
  onDateChange,
  dateError,
  guestCount,
  onGuestCountChange,
  guestType,
  onGuestTypeChange,
  floorPreference,
  onFloorPreferenceChange,
  onRefreshData,
  isLoading,
  currentUser,
  onBookingSuccess,
  onOpenTrackModal,
  t = {},
}) {
  const formRef = useRef(null);
  const isHindi = t.portalName?.includes('बीआईटी');

  // Auto-scroll to booking form when a room is selected
  useEffect(() => {
    if (selectedRoom && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedRoom]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* 1. Page Header with 3-Step Process Indicator */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-[#E7DFD2] space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#7A2438]/10 text-[#7A2438] text-xs font-bold uppercase tracking-wider mb-2">
              <CalendarCheck className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>Official Institutional Allotment</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
              Online Suite Reservation & Booking
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
              Select your dates, pick your preferred AC Executive Suite from the interactive floor map, and submit your institutional credentials for Registrar clearance.
            </p>
          </div>

          <div className="bg-[#F6F1E8] border border-[#C6A15B] rounded-2xl p-4 text-xs font-bold text-[#7A2438] text-center min-w-[190px]">
            <div>Flat Institutional Tariff</div>
            <div className="text-2xl font-black text-[#7A2438] mt-0.5">₹1,200</div>
            <div className="text-[10px] text-stone-500">per suite / night (all utilities incl.)</div>
          </div>
        </div>

        {/* 3 Step Progress Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-stone-100">
          <div className="p-3 rounded-xl bg-[#F6F1E8] border border-[#E7DFD2] flex items-center space-x-3">
            <span className="w-7 h-7 rounded-full bg-[#7A2438] text-white flex items-center justify-center text-xs font-black flex-shrink-0">
              1
            </span>
            <div className="text-xs">
              <span className="font-bold text-stone-900 block">Select Dates</span>
              <span className="text-[11px] text-stone-500">Auto +1 day check-out</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#F6F1E8] border border-[#E7DFD2] flex items-center space-x-3">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${
              selectedRoom ? 'bg-[#7A2438] text-white' : 'bg-[#C6A15B] text-stone-900'
            }`}>
              2
            </span>
            <div className="text-xs">
              <span className="font-bold text-stone-900 block">
                {selectedRoom ? `Selected: Room ${selectedRoom.roomNumber}` : 'Choose Room'}
              </span>
              <span className="text-[11px] text-stone-500">33 suites across 2 floors</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#F6F1E8] border border-[#E7DFD2] flex items-center space-x-3">
            <span className="w-7 h-7 rounded-full bg-stone-300 text-stone-700 flex items-center justify-center text-xs font-black flex-shrink-0">
              3
            </span>
            <div className="text-xs">
              <span className="font-bold text-stone-900 block">Clearance & Pass</span>
              <span className="text-[11px] text-stone-500">Registrar approval & voucher</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Date & Guest Search Widget */}
      <div>
        <SearchWidget
          checkIn={checkIn}
          checkOut={checkOut}
          onDateChange={onDateChange}
          guestCount={guestCount}
          onGuestCountChange={onGuestCountChange}
          guestType={guestType}
          onGuestTypeChange={onGuestTypeChange}
          floorPreference={floorPreference}
          onFloorPreferenceChange={onFloorPreferenceChange}
          onSearchRooms={() => {
            const el = document.getElementById('floor-selector');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          t={t}
        />
      </div>

      {/* 3. Interactive Room Floor Map */}
      <section id="floor-selector" className="space-y-4 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#7A2438]/10 text-[#7A2438] text-xs font-bold uppercase tracking-wider mb-1">
              <Bed className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>Step 2: Room Seat Selection</span>
            </div>
            <h2 className="text-2xl font-black text-stone-900 tracking-tight">
              Select Your Preferred Executive Suite
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Click any green <strong className="text-emerald-700">Available</strong> room to select it. Click again to unselect.
            </p>
          </div>
        </div>

        <FloorMap
          rooms={rooms}
          selectedRoom={selectedRoom}
          onSelectRoom={onSelectRoom}
          checkIn={checkIn}
          checkOut={checkOut}
          onDateChange={onDateChange}
          dateError={dateError}
          floorPreference={floorPreference}
          onRefreshData={onRefreshData}
          isLoading={isLoading}
          t={t}
        />
      </section>

      {/* 4. Verification & Booking Form */}
      <section ref={formRef} id="booking-form-section" className="scroll-mt-24 space-y-4">
        <div className="border-b border-stone-200 pb-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#7A2438]/10 text-[#7A2438] text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C6A15B]" />
            <span>Step 3: Verification & Submission</span>
          </div>
          <h2 className="text-2xl font-black text-stone-900 tracking-tight">
            Institutional Clearance & Guest Details
          </h2>
          <p className="text-xs text-stone-500">
            {selectedRoom
              ? `Fill in identification details to reserve Room ${selectedRoom.roomNumber} (${checkIn} to ${checkOut}).`
              : 'Select a room in the floor selector above to activate the reservation form.'}
          </p>
        </div>

        <BookingForm
          selectedRoom={selectedRoom}
          checkIn={checkIn}
          checkOut={checkOut}
          currentUser={currentUser}
          onBookingSuccess={onBookingSuccess}
          onOpenTrackModal={onOpenTrackModal}
          t={t}
        />
      </section>
    </div>
  );
}
