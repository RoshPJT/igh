import React, { useState } from 'react';
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
  RefreshCw
} from 'lucide-react';
import { addDays, calculateNights, getTodayString } from '../utils/dateUtils';

export default function FloorMap({
  rooms,
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
  const [activeFloorTab, setActiveFloorTab] = useState(floorPreference); // 'all', 1, 2
  const [hoveredRoom, setHoveredRoom] = useState(null);
  const [refreshToast, setRefreshToast] = useState(false);

  // Sync when floor preference changes from top search widget
  React.useEffect(() => {
    if (floorPreference !== undefined) {
      setActiveFloorTab(floorPreference);
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

  // Filter rooms by floor
  const floor1Rooms = rooms.filter((r) => r.floor === 1);
  const floor2Rooms = rooms.filter((r) => r.floor === 2);

  const handleRoomClick = (room) => {
    if (!hasDatesSelected) {
      if (onDateChange) {
        onDateChange({ triggerPrompt: true });
      }
      return;
    }

    if (room.status === 'Booked') {
      return; // Disabled
    }
    if (room.status === 'Maintenance' || room.isMaintenance) {
      return; // Disabled
    }
    if (room.status === 'Pending Approval') {
      return; // Pending review
    }

    // Toggle or select room
    if (selectedRoom && selectedRoom.roomNumber === room.roomNumber) {
      onSelectRoom(null);
    } else {
      onSelectRoom(room);
    }
  };

  // Helper to get room button styling based on status & selection
  const getRoomStyles = (room) => {
    const isSelected = selectedRoom && selectedRoom.roomNumber === room.roomNumber;
    const isMaint = room.status === 'Maintenance' || room.isMaintenance;
    const isBooked = room.status === 'Booked';
    const isPending = room.status === 'Pending Approval';
    const isAvailable = !isMaint && !isBooked && !isPending;

    if (isSelected) {
      return {
        buttonClass:
          'bg-gradient-to-br from-[#FF9A00] to-[#EE6200] text-white border-2 border-[#F7D794] ring-4 ring-[#F7D794]/80 shadow-xl scale-105 z-20 animate-pulse-subtle',
        badge: t.selected || 'Selected',
        badgeColor: 'bg-[#F7D794] text-slate-950 font-bold',
      };
    }

    if (isMaint) {
      return {
        buttonClass:
          'bg-slate-200 text-slate-500 border border-slate-300 cursor-not-allowed opacity-80 bg-[repeating-linear-gradient(45deg,#f1f5f9,#f1f5f9_8px,#e2e8f0_8px,#e2e8f0_16px)]',
        badge: t.maintenance || 'Maintenance',
        badgeColor: 'bg-slate-300 text-slate-700',
      };
    }

    if (isBooked) {
      return {
        buttonClass:
          'bg-rose-100 text-rose-800 border-2 border-rose-300 cursor-not-allowed opacity-85 hover:bg-rose-100',
        badge: t.booked || 'Booked',
        badgeColor: 'bg-rose-600 text-white',
      };
    }

    if (isPending) {
      return {
        buttonClass:
          'bg-amber-50 text-amber-900 border-2 border-amber-400 cursor-not-allowed opacity-90',
        badge: t.pending || 'Pending',
        badgeColor: 'bg-amber-500 text-white',
      };
    }

    // Available
    return {
      buttonClass: hasDatesSelected
        ? 'bg-emerald-50 text-emerald-900 border-2 border-emerald-500 hover:bg-emerald-100 hover:border-emerald-600 hover:scale-105 hover:shadow-md cursor-pointer transition-all'
        : 'bg-white text-slate-700 border border-slate-300 hover:border-[#FF9A00] cursor-pointer',
      badge: t.available || 'Available',
      badgeColor: 'bg-emerald-500 text-white',
    };
  };

  const renderRoomGrid = (roomList, floorNumber) => {
    return (
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
        {/* Floor Header */}
        <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-lg bg-bit-maroon text-white flex items-center justify-center font-bold text-sm shadow-sm">
              F{floorNumber}
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Floor {floorNumber} Floor Plan
              </h3>
              <p className="text-xs text-slate-500">
                {floorNumber === 1 ? '17 Suites (Rooms 101 – 117)' : '16 Suites (Rooms 201 – 216)'} • All AC Executive Suites
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md">
            Flat Rate: ₹1,200/night
          </span>
        </div>

        {/* Corridor Indicator (Movie theater style layout) */}
        <div className="w-full text-center py-1 bg-slate-100 text-slate-500 text-[11px] font-semibold tracking-wider uppercase rounded border border-dashed border-slate-300">
          ── Main Corridor & Garden View Balcony ──
        </div>

        {/* Interactive Seats / Room Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5 pt-1">
          {roomList.map((room) => {
            const styling = getRoomStyles(room);
            const isSelected = selectedRoom && selectedRoom.roomNumber === room.roomNumber;

            return (
              <div
                key={room.roomNumber}
                className="relative group"
                onMouseEnter={() => setHoveredRoom(room)}
                onMouseLeave={() => setHoveredRoom(null)}
              >
                <button
                  type="button"
                  onClick={() => handleRoomClick(room)}
                  disabled={
                    hasDatesSelected &&
                    (room.status === 'Booked' ||
                      room.status === 'Maintenance' ||
                      room.isMaintenance ||
                      room.status === 'Pending Approval')
                  }
                  className={`w-full aspect-[1/1] rounded-xl flex flex-col items-center justify-center p-2 text-center transition duration-200 select-none relative ${styling.buttonClass}`}
                >
                  <DoorClosed
                    className={`w-4 h-4 mb-1 ${
                      isSelected
                        ? 'text-amber-300'
                        : room.status === 'Available'
                        ? 'text-emerald-600'
                        : 'text-current opacity-70'
                    }`}
                  />
                  <span className="text-sm font-extrabold tracking-tight">
                    {room.roomNumber}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-1 leading-none ${styling.badgeColor}`}
                  >
                    {styling.badge}
                  </span>

                  {/* Selected Tick Indicator */}
                  {isSelected && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-400 text-blue-950 rounded-full flex items-center justify-center shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div className="w-full text-center py-1 bg-slate-50 text-slate-400 text-[10px] tracking-wider rounded">
          Ground Level Reception & Elevators (Near Rooms {floorNumber}01 - {floorNumber}04)
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Date Requirement Warning Banner */}
      {!hasDatesSelected ? (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-sm flex items-start space-x-3">
          <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-bold text-amber-900">
              Step 1: Select Check-In and Check-Out dates first
            </p>
            <p className="text-amber-800 text-xs mt-0.5">
              The visual room selector requires your stay duration to check live room availability across all 33 rooms. Please set your dates below to unlock room selection.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-3.5 rounded-r-xl shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-emerald-900">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              Dates Active: <strong>{checkIn}</strong> to <strong>{checkOut}</strong> • Click any <strong>Available</strong> room to select it.
            </span>
          </div>
          {selectedRoom && (
            <span className="hidden sm:inline-block px-3 py-1 bg-blue-600 text-white font-bold text-xs rounded-full shadow-sm animate-pulse-subtle">
              Selected: Room {selectedRoom.roomNumber}
            </span>
          )}
        </div>
      )}

      {/* Date Selection Box */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-base font-bold text-stone-900 flex items-center space-x-2 mb-4">
          <Calendar className="w-5 h-5 text-[#7A2438]" />
          <span>Stay Dates & Tariff Calculator</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
          {/* Check-In */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Check-In Date (from 12:00 PM) <span className="text-rose-600">*</span>
            </label>
            <input
              type="date"
              value={checkIn}
              min={getTodayString()}
              onChange={(e) => onDateChange({ checkIn: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7A2438]/20 focus:border-[#7A2438] text-sm font-medium text-stone-800 shadow-sm"
            />
          </div>

          {/* Check-Out */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Check-Out Date (until 11:00 AM) <span className="text-rose-600">*</span>
            </label>
            <input
              type="date"
              value={checkOut}
              min={addDays(checkIn || getTodayString(), 1)}
              onChange={(e) => onDateChange({ checkOut: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7A2438]/20 focus:border-[#7A2438] text-sm font-medium text-stone-800 shadow-sm"
            />
          </div>

          {/* Tariff Pill */}
          <div className="bg-[#F6F1E8] p-3 rounded-xl border border-[#E7DFD2] flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold text-stone-500 uppercase">
                {calculateNights(checkIn, checkOut)} {calculateNights(checkIn, checkOut) === 1 ? 'Night' : 'Nights'}
              </div>
              <div className="text-sm font-black text-[#7A2438]">
                ₹{calculateNights(checkIn, checkOut) * 1200}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold text-stone-500 uppercase">Tariff Rate</div>
              <div className="text-xs font-bold text-stone-800">₹1,200 / night</div>
            </div>
          </div>
        </div>

        {dateError && (
          <p className="text-xs text-rose-600 font-semibold mt-2.5 flex items-center space-x-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{dateError}</span>
          </p>
        )}
      </div>

      {/* Floor Filter Tabs & Status Legend */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Floor tabs */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveFloorTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeFloorTab === 'all'
                  ? 'bg-gradient-to-r from-[#FF9A00] to-[#EE6200] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.anyFloor || 'All Floors (33 Rooms)'}
            </button>
            <button
              type="button"
              onClick={() => setActiveFloorTab(1)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeFloorTab === 1
                  ? 'bg-gradient-to-r from-[#FF9A00] to-[#EE6200] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.floor1 || 'Floor 1 (101-117)'}
            </button>
            <button
              type="button"
              onClick={() => setActiveFloorTab(2)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeFloorTab === 2
                  ? 'bg-gradient-to-r from-[#FF9A00] to-[#EE6200] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.floor2 || 'Floor 2 (201-216)'}
            </button>
          </div>

          {/* Quick Counter & Refresh Button */}
          <div className="flex items-center space-x-2.5">
            {refreshToast && (
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-300 animate-in fade-in">
                ✓ 33 Rooms Synchronized!
              </span>
            )}
            <button
              type="button"
              onClick={handleRefreshClick}
              className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{t.refreshAvailability || 'Refresh Availability'}</span>
            </button>
            <div className="text-xs text-slate-500 hidden sm:block">
              Showing{' '}
              <span className="font-bold text-slate-900">
                {activeFloorTab === 'all' ? 33 : activeFloorTab === 1 ? 17 : 16}
              </span>{' '}
              rooms
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded bg-emerald-50 border-2 border-emerald-500" />
            <span className="text-slate-700 font-medium">Available</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded bg-blue-600 border-2 border-amber-400" />
            <span className="text-slate-700 font-medium">Selected (You)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded bg-amber-100 border-2 border-amber-500" />
            <span className="text-slate-700 font-medium">Pending Approval</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded bg-rose-100 border-2 border-rose-400" />
            <span className="text-slate-700 font-medium">Booked (Disabled)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded bg-slate-200 border border-slate-400 bg-[repeating-linear-gradient(45deg,#f1f5f9,#f1f5f9_4px,#e2e8f0_4px,#e2e8f0_8px)]" />
            <span className="text-slate-700 font-medium">Maintenance</span>
          </div>
        </div>
      </div>

      {/* Render Floor Grids */}
      {(activeFloorTab === 'all' || activeFloorTab === 1) && renderRoomGrid(floor1Rooms, 1)}
      {(activeFloorTab === 'all' || activeFloorTab === 2) && renderRoomGrid(floor2Rooms, 2)}

      {/* Selected Room Confirmation Bar */}
      {selectedRoom && (
        <div className="sticky bottom-4 z-30 bg-bit-maroon text-white p-4 rounded-2xl shadow-2xl border-2 border-bit-gold flex flex-col sm:flex-row items-center justify-between gap-3 animate-bounce-subtle">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-bit-gold text-bit-maroon flex items-center justify-center font-black text-lg shadow">
              {selectedRoom.roomNumber}
            </div>
            <div>
              <div className="text-sm font-bold flex items-center space-x-2">
                <span>Room {selectedRoom.roomNumber} Selected</span>
                <span className="text-[11px] bg-rose-950 px-2 py-0.5 rounded-full text-bit-gold">
                  Floor {selectedRoom.floor}
                </span>
              </div>
              <div className="text-xs text-rose-200">
                {selectedRoom.category || 'AC Executive Suite'} • ₹1,200 per night
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onSelectRoom(null)}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-200 hover:text-white hover:bg-rose-950 transition"
            >
              Change Room
            </button>
            <a
              href="#guest-verification-form"
              className="w-full sm:w-auto flex items-center justify-center space-x-1.5 px-4 py-2 bg-bit-gold hover:bg-amber-400 text-bit-maroon-dark font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition"
            >
              <span>Continue to Verification Form</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
