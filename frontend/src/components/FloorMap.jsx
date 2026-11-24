import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Layers,
  CheckCircle,
  AlertCircle,
  Clock,
  Wrench,
  Info,
  Check,
  DoorClosed,
  ChevronRight,
  ShieldAlert,
  RefreshCw,
  Sparkles,
  Lock,
  Bed,
  Users,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { addDays, calculateNights, getTodayString } from '../utils/dateUtils';

export default function FloorMap({
  rooms = [],
  selectedRoom,
  onSelectRoom,
  checkIn,
  checkOut,
  onDateChange,
  dateError,
  floorPreference = 'all',
  onRefreshData,
  isLoading = false,
  t = {},
}) {
  const [activeFloorTab, setActiveFloorTab] = useState(floorPreference === 'all' ? 1 : floorPreference); // Default to Floor 1 or 'all'
  const [inspectedRoom, setInspectedRoom] = useState(null); // Modal / drawer details for inspected room
  const [refreshToast, setRefreshToast] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (floorPreference !== undefined && floorPreference !== 'all') {
      setActiveFloorTab(Number(floorPreference));
    }
  }, [floorPreference]);

  const handleRefreshClick = async () => {
    if (onRefreshData) {
      await onRefreshData();
      setRefreshToast(true);
      setTimeout(() => setRefreshToast(false), 3000);
    }
  };

  const hasDatesSelected = Boolean(checkIn && checkOut);

  // Exact 14 rooms on Floor 1 and 20 rooms on Floor 2
  const floor1Rooms = useMemo(() => {
    return rooms
      .filter((r) => r.floor === 1)
      .sort((a, b) => a.roomNumber - b.roomNumber);
  }, [rooms]);

  const floor2Rooms = useMemo(() => {
    return rooms
      .filter((r) => r.floor === 2)
      .sort((a, b) => a.roomNumber - b.roomNumber);
  }, [rooms]);

  // Determine room status: AVAILABLE, BOOKED, RESERVED, UNDER MAINTENANCE
  const getRoomStatusMeta = (room) => {
    const isSelected = selectedRoom && selectedRoom.roomNumber === room.roomNumber;

    // 1. Permanently Restricted University Rooms
    if (room.isRestricted) {
      return {
        status: 'RESERVED',
        badge: 'RESERVED',
        badgeClass: 'bg-[#C6A15B] text-[#262626] font-black border border-[#A68442]',
        cardClass: 'bg-[#FAF6ED] text-stone-700 border-2 border-[#C6A15B]/70 shadow-xs cursor-pointer',
        indicatorColor: 'bg-[#C6A15B]',
        canSelect: false,
        reason: room.restrictionLabel || (room.roomNumber === 101 ? 'Permanently Reserved for University Staff' : 'Reserved for University Guests'),
      };
    }

    // 2. Under Maintenance
    if (room.isMaintenance || room.status === 'UNDER MAINTENANCE' || room.status === 'Maintenance') {
      return {
        status: 'UNDER MAINTENANCE',
        badge: 'UNDER MAINTENANCE',
        badgeClass: 'bg-amber-600 text-white font-bold',
        cardClass: 'bg-amber-50/70 text-amber-900 border-2 border-amber-300 opacity-80 cursor-not-allowed bg-[repeating-linear-gradient(45deg,#fffbeb,#fffbeb_10px,#fef3c7_10px,#fef3c7_20px)]',
        indicatorColor: 'bg-amber-500',
        canSelect: false,
        reason: 'Temporarily unavailable due to routine engineering / electrical maintenance.',
      };
    }

    // 3. Booked for selected dates
    if (room.status === 'BOOKED' || room.status === 'Booked') {
      return {
        status: 'BOOKED',
        badge: 'BOOKED',
        badgeClass: 'bg-[#262626] text-white font-bold',
        cardClass: 'bg-stone-100 text-stone-600 border-2 border-stone-300 opacity-75 cursor-not-allowed',
        indicatorColor: 'bg-stone-600',
        canSelect: false,
        reason: `Reserved by another guest for the selected dates (${checkIn} to ${checkOut}).`,
      };
    }

    // 4. Selected state
    if (isSelected) {
      return {
        status: 'AVAILABLE',
        badge: 'SELECTED',
        badgeClass: 'bg-[#C6A15B] text-[#262626] font-black shadow-md',
        cardClass: 'bg-[#7A2438] text-white border-2 border-[#C6A15B] ring-4 ring-[#C6A15B]/50 shadow-xl scale-[1.02] z-20',
        indicatorColor: 'bg-[#C6A15B]',
        canSelect: true,
      };
    }

    // 5. Available state
    return {
      status: 'AVAILABLE',
      badge: 'AVAILABLE',
      badgeClass: 'bg-emerald-700 text-white font-extrabold shadow-2xs',
      cardClass: 'bg-white text-stone-900 border-2 border-emerald-500/80 hover:border-[#7A2438] hover:shadow-lg hover:scale-[1.02] cursor-pointer transition-all duration-200',
      indicatorColor: 'bg-emerald-600',
      canSelect: true,
    };
  };

  const handleRoomCardClick = (room) => {
    const meta = getRoomStatusMeta(room);

    // If reserved or under maintenance, open informative modal explaining restriction
    if (!meta.canSelect) {
      setInspectedRoom({ ...room, meta });
      return;
    }

    // If available: pre-select and open inspection dialog with booking CTA
    if (onSelectRoom) {
      onSelectRoom(room);
    }
    setInspectedRoom({ ...room, meta });
  };

  const handleProceedToBooking = (room) => {
    if (onSelectRoom) {
      onSelectRoom(room);
    }
    navigate('/booking');
  };

  const nights = useMemo(() => calculateNights(checkIn, checkOut), [checkIn, checkOut]);

  const renderFloorGrid = (roomList, floorNum, floorLabel, totalCount) => {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7DFD2] shadow-xl space-y-6">
        {/* Floor Header Bar */}
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#E7DFD2] gap-3">
          <div className="flex items-center space-x-3">
            <span className="w-10 h-10 rounded-2xl bg-[#7A2438] text-[#C6A15B] flex items-center justify-center font-black text-sm shadow-md border border-[#C6A15B]">
              F{floorNum}
            </span>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-[#262626] tracking-tight">
                {floorLabel} — {totalCount} Rooms
              </h3>
              <p className="text-xs text-stone-500">
                {floorNum === 1
                  ? 'Suites 101 – 114 (101 Staff-Reserved • 104 & 111 Guest Suites • 11 Publicly Bookable)'
                  : 'Suites 201 – 220 (204 & 217 Guest Suites • 18 Publicly Bookable)'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-[#FAF6ED] text-[#7A2438] border border-[#C6A15B] font-bold">
              Floor {floorNum} Overview
            </span>
          </div>
        </div>

        {/* Schematic Architectural Corridor Marker */}
        <div className="w-full text-center py-2 bg-[#F6F1E8] text-[#7A2438] text-xs font-bold tracking-widest uppercase rounded-xl border border-dashed border-[#C6A15B]/60 shadow-2xs">
          ✦ Main Central Corridor & Greenery Balcony View ✦
        </div>

        {/* Room Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 pt-1">
          {roomList.map((room) => {
            const meta = getRoomStatusMeta(room);
            const isSelected = selectedRoom && selectedRoom.roomNumber === room.roomNumber;

            return (
              <div
                key={room.roomNumber}
                onClick={() => handleRoomCardClick(room)}
                className={`relative rounded-2xl p-4 transition-all duration-200 select-none flex flex-col justify-between min-h-[140px] ${meta.cardClass}`}
              >
                {/* Top Row: Room Number & Status Badge */}
                <div className="flex items-start justify-between gap-1.5">
                  <div className="flex items-center space-x-1.5">
                    <DoorClosed className={`w-4 h-4 ${isSelected ? 'text-[#C6A15B]' : 'text-[#7A2438]'}`} />
                    <span className="text-base font-black tracking-tight">
                      Room {room.roomNumber}
                    </span>
                  </div>

                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-[#C6A15B] text-[#262626] flex items-center justify-center shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}
                </div>

                {/* Middle: Room Category (Full Name) */}
                <div className="my-2 space-y-0.5">
                  <div className={`text-xs font-bold leading-snug line-clamp-2 ${isSelected ? 'text-white' : 'text-stone-800'}`}>
                    {room.category}
                  </div>
                  <div className={`text-[11px] font-semibold ${isSelected ? 'text-[#C6A15B]' : 'text-[#7A2438]'}`}>
                    ₹{room.pricePerNight} <span className="text-[10px] font-normal opacity-80">/ night</span>
                  </div>
                </div>

                {/* Bottom Row: Status Indicator Badge */}
                <div className="pt-2 border-t border-black/10 flex items-center justify-between">
                  <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full ${meta.badgeClass}`}>
                    {meta.badge}
                  </span>

                  {meta.canSelect ? (
                    <span className={`text-[10px] font-bold ${isSelected ? 'text-white' : 'text-[#7A2438]'} flex items-center space-x-0.5`}>
                      <span>{isSelected ? 'Selected' : 'Select'}</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-stone-500 flex items-center space-x-1">
                      <Lock className="w-3 h-3 text-[#C6A15B]" />
                      <span>Details</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Floor Footer schematic indicator */}
        <div className="w-full text-center py-2 bg-[#F6F1E8] text-stone-500 text-[11px] font-medium rounded-xl border border-[#E7DFD2]">
          {floorNum === 1
            ? 'Ground Floor Access • Reception Portico & Main Dining Hall Adjacent'
            : 'First Floor Elevation • Quiet Residential Wing overlooking Subarnarekha River greenery'}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Date Header & Stay Duration Calculator */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-[#E7DFD2] space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-[#E7DFD2] gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#7A2438]/10 text-[#7A2438] text-xs font-bold uppercase tracking-wider mb-2">
              <Calendar className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>Interactive Availability Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#262626] tracking-tight">
              Select Stay Dates to Check Live Room Availability
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Availability is dynamically calculated from actual database reservations. Rechecked immediately before booking confirmation.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefreshClick}
            disabled={isLoading}
            className="self-start md:self-auto px-4 py-2 rounded-xl bg-[#FAF6ED] hover:bg-[#F3EBD6] text-[#7A2438] border border-[#C6A15B] text-xs font-bold transition flex items-center space-x-1.5 shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#C6A15B] ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Updating...' : 'Refresh Availability'}</span>
          </button>
        </div>

        {/* Date Pickers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Check-In Date (from 12:00 PM) <span className="text-rose-600">*</span>
            </label>
            <input
              type="date"
              value={checkIn}
              min={getTodayString()}
              onChange={(e) => onDateChange && onDateChange({ checkIn: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7A2438]/20 focus:border-[#7A2438] text-sm font-semibold text-stone-800 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Check-Out Date (until 11:00 AM) <span className="text-rose-600">*</span>
            </label>
            <input
              type="date"
              value={checkOut}
              min={addDays(checkIn || getTodayString(), 1)}
              max={addDays(checkIn || getTodayString(), 7)} // Enforce max 7 nights in picker
              onChange={(e) => onDateChange && onDateChange({ checkOut: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7A2438]/20 focus:border-[#7A2438] text-sm font-semibold text-stone-800 shadow-2xs"
            />
          </div>

          <div className="bg-[#F6F1E8] p-3 rounded-xl border border-[#E7DFD2] flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Stay Duration</div>
              <div className="text-sm font-black text-[#7A2438]">
                {nights} {nights === 1 ? 'Night' : 'Nights'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Rule Limit</div>
              <div className="text-xs font-bold text-stone-800">Max 7 Nights</div>
            </div>
          </div>

          <div className="bg-[#FAF6ED] p-3 rounded-xl border border-[#C6A15B] flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Public Bookable</div>
              <div className="text-sm font-black text-emerald-700">29 Rooms</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Restricted</div>
              <div className="text-xs font-bold text-[#7A2438]">5 University Rooms</div>
            </div>
          </div>
        </div>

        {dateError && (
          <p className="text-xs text-rose-600 font-semibold flex items-center space-x-1.5 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{dateError}</span>
          </p>
        )}

        {refreshToast && (
          <p className="text-xs text-emerald-800 font-semibold flex items-center space-x-1.5 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>Room availability re-verified with database in real time.</span>
          </p>
        )}
      </div>

      {/* Visual Status Legend & Floor Tabs */}
      <div className="bg-white p-5 rounded-3xl shadow-xl border border-[#E7DFD2] space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Floor Switcher Tabs */}
          <div className="flex items-center space-x-2 bg-[#F6F1E8] p-1.5 rounded-2xl border border-[#E7DFD2]">
            <button
              type="button"
              onClick={() => setActiveFloorTab(1)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                activeFloorTab === 1
                  ? 'bg-[#7A2438] text-white shadow-md border-b-2 border-[#C6A15B]'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <span>First Floor (14 Rooms)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFloorTab(2)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                activeFloorTab === 2
                  ? 'bg-[#7A2438] text-white shadow-md border-b-2 border-[#C6A15B]'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <span>Second Floor (20 Rooms)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFloorTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                activeFloorTab === 'all'
                  ? 'bg-[#7A2438] text-white shadow-md border-b-2 border-[#C6A15B]'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <span>All 34 Rooms</span>
            </button>
          </div>

          {/* Color Status Legend */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-300">
              <span className="w-3 h-3 rounded-full bg-emerald-600 shadow-2xs" />
              <span className="font-bold text-emerald-950">AVAILABLE</span>
              <span className="text-[10px] text-stone-500 font-normal">(Bookable)</span>
            </div>

            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-300">
              <span className="w-3 h-3 rounded-full bg-stone-700 shadow-2xs" />
              <span className="font-bold text-stone-900">BOOKED</span>
              <span className="text-[10px] text-stone-500 font-normal">(Occupied)</span>
            </div>

            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#FAF6ED] border border-[#C6A15B]">
              <span className="w-3 h-3 rounded-full bg-[#C6A15B] shadow-2xs" />
              <span className="font-bold text-[#7A2438]">RESERVED</span>
              <span className="text-[10px] text-stone-600 font-normal">(University Staff/Guests)</span>
            </div>

            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-300">
              <span className="w-3 h-3 rounded-full bg-amber-500 shadow-2xs" />
              <span className="font-bold text-amber-950">UNDER MAINTENANCE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Render Active Floor View */}
      {(activeFloorTab === 1 || activeFloorTab === 'all') &&
        renderFloorGrid(floor1Rooms, 1, 'First Floor', 14)}

      {(activeFloorTab === 2 || activeFloorTab === 'all') &&
        renderFloorGrid(floor2Rooms, 2, 'Second Floor', 20)}

      {/* Room Details / Inspection Modal */}
      {inspectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-[#C6A15B] space-y-5 relative">
            <div className="flex items-start justify-between pb-3 border-b border-stone-200">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl sm:text-2xl font-black text-[#262626]">
                    Room {inspectedRoom.roomNumber}
                  </span>
                  <span className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full ${inspectedRoom.meta.badgeClass}`}>
                    {inspectedRoom.meta.badge}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-[#7A2438] mt-0.5">
                  {inspectedRoom.category} • Floor {inspectedRoom.floor}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setInspectedRoom(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-sm transition"
              >
                ✕
              </button>
            </div>

            {/* Room Category Highlights */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F6F1E8] border border-[#E7DFD2] space-y-1">
                <div className="text-[10px] font-bold text-stone-500 uppercase">Tariff for 1 Guest</div>
                <div className="text-sm font-black text-[#7A2438]">
                  ₹{inspectedRoom.category === 'Small Room' ? 1000 : inspectedRoom.category === 'Small Double-Bedded Regular Room' ? 1200 : inspectedRoom.category === 'Large Double-Bedded Room' ? 1500 : 2000}
                  <span className="text-[10px] font-normal text-stone-600"> / night</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F6F1E8] border border-[#E7DFD2] space-y-1">
                <div className="text-[10px] font-bold text-stone-500 uppercase">Tariff for 2 Guests</div>
                <div className="text-sm font-black text-[#7A2438]">
                  ₹{inspectedRoom.priceDouble || inspectedRoom.pricePerNight}
                  <span className="text-[10px] font-normal text-stone-600"> / night</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-stone-200 space-y-0.5">
                <div className="text-[10px] font-bold text-stone-500 uppercase">Maximum Occupancy</div>
                <div className="text-xs font-bold text-stone-800 flex items-center space-x-1">
                  <Users className="w-3.5 h-3.5 text-[#C6A15B]" />
                  <span>Max 2 Guests Allowed</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-stone-200 space-y-0.5">
                <div className="text-[10px] font-bold text-stone-500 uppercase">GST Applicable</div>
                <div className="text-xs font-bold text-stone-800">
                  5% Institutional GST
                </div>
              </div>
            </div>

            {/* Status Specific Message */}
            {inspectedRoom.meta.status === 'RESERVED' && (
              <div className="p-4 rounded-2xl bg-[#FAF6ED] border-2 border-[#C6A15B] text-xs space-y-2">
                <div className="flex items-center space-x-2 text-[#7A2438] font-black">
                  <ShieldCheck className="w-4 h-4 text-[#C6A15B]" />
                  <span>Official University Restricted Suite</span>
                </div>
                <p className="text-stone-700 leading-relaxed font-medium">
                  {inspectedRoom.meta.reason}
                </p>
                <p className="text-[11px] text-stone-500 italic">
                  Note: Restricted rooms cannot be reserved through public self-service booking. Allocation is managed exclusively through the Registrar Office & Guest House Warden.
                </p>
              </div>
            )}

            {inspectedRoom.meta.status === 'UNDER MAINTENANCE' && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs space-y-1">
                <div className="font-bold text-amber-900">Room Under Routine Maintenance</div>
                <p className="text-amber-800">{inspectedRoom.meta.reason}</p>
              </div>
            )}

            {inspectedRoom.meta.status === 'BOOKED' && (
              <div className="p-4 rounded-2xl bg-stone-100 border border-stone-300 text-xs space-y-1">
                <div className="font-bold text-stone-900">Room Occupied</div>
                <p className="text-stone-700">{inspectedRoom.meta.reason}</p>
              </div>
            )}

            {inspectedRoom.meta.status === 'AVAILABLE' && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs space-y-2">
                <div className="font-bold text-emerald-950 flex items-center space-x-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Room is 100% Available for Selected Dates</span>
                </div>
                <div className="text-stone-700">
                  Estimated stay total: <strong>{nights} night(s) × ₹{inspectedRoom.pricePerNight} = ₹{nights * inspectedRoom.pricePerNight}</strong> (+ 5% GST = ₹{(nights * inspectedRoom.pricePerNight * 1.05).toFixed(2)}).
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setInspectedRoom(null)}
                className="px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-xs font-bold text-stone-700 transition"
              >
                Close
              </button>

              {inspectedRoom.meta.canSelect && (
                <button
                  type="button"
                  onClick={() => handleProceedToBooking(inspectedRoom)}
                  className="px-6 py-2.5 rounded-xl bg-[#7A2438] hover:bg-[#661C2E] text-white text-xs font-black uppercase tracking-wider transition shadow-md flex items-center space-x-1.5"
                >
                  <span>Book Room {inspectedRoom.roomNumber}</span>
                  <ArrowRight className="w-4 h-4 text-[#C6A15B]" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}