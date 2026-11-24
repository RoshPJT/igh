import React from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  DoorClosed,
  CheckCircle2,
  Lock,
  Wrench,
  ShieldCheck,
  Calendar,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import FloorMap from '../components/FloorMap';

export default function RoomAvailabilityPage({
  rooms = [],
  selectedRoom,
  onSelectRoom,
  checkIn,
  checkOut,
  onDateChange,
  dateError,
  floorPreference,
  onRefreshData,
  isLoading,
  t = {},
}) {
  const isHindi = t.portalName?.includes('बीआईटी');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E7DFD2] shadow-xl space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-[#7A2438]/10 text-[#7A2438] text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-[#C6A15B]" />
            <span>Interactive Floor Plan & Live Status</span>
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-[#FAF6ED] text-[#262626] border border-[#C6A15B] text-xs font-bold">
            34 Registered Rooms • 2 Residential Floors
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-[#262626] tracking-tight">
          {isHindi ? 'कमरों की उपलब्धता एवं तल मानचित्र' : 'Room Availability & Interactive Floor Map'}
        </h1>

        <p className="text-sm sm:text-base text-stone-600 max-w-3xl leading-relaxed">
          {isHindi
            ? 'अतिथि गृह के दोनों आवासीय तलों के सभी 34 कमरों की वास्तविक स्थिति देखें। उपलब्ध कमरों को सीधे मानचित्र से चुनें और आरक्षण प्रक्रिया को सुगमता से आगे बढ़ाएं।'
            : 'Explore real-time room availability across both residential floors of BIT Mesra Guest House. Choose your desired stay dates to inspect actual database availability, review room categories and tariffs, and select an available room directly from the schematic floor map.'}
        </p>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-[#F6F1E8] border border-[#E7DFD2] text-xs">
            <div className="text-[10px] font-bold text-stone-500 uppercase">First Floor</div>
            <div className="text-sm font-black text-[#7A2438] mt-0.5">14 Rooms (101–114)</div>
            <div className="text-[10px] text-stone-600 mt-0.5">Near Dining & Reception</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F6F1E8] border border-[#E7DFD2] text-xs">
            <div className="text-[10px] font-bold text-stone-500 uppercase">Second Floor</div>
            <div className="text-sm font-black text-[#7A2438] mt-0.5">20 Rooms (201–220)</div>
            <div className="text-[10px] text-stone-600 mt-0.5">River & Garden Frontage</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
            <div className="text-[10px] font-bold text-emerald-800 uppercase">Public Bookable</div>
            <div className="text-sm font-black text-emerald-950 mt-0.5">29 Suites Available</div>
            <div className="text-[10px] text-emerald-700 mt-0.5">Instant Self-Service</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF6ED] border border-[#C6A15B] text-xs">
            <div className="text-[10px] font-bold text-stone-600 uppercase">Restricted Allocation</div>
            <div className="text-sm font-black text-[#7A2438] mt-0.5">5 Reserved Rooms</div>
            <div className="text-[10px] text-stone-600 mt-0.5">Staff (101) & VIP Guests</div>
          </div>
        </div>
      </div>

      {/* Interactive Floor Map Component */}
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

      {/* Guidelines & Category Breakdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E7DFD2] shadow-xl space-y-6">
        <h2 className="text-xl sm:text-2xl font-black text-[#262626] tracking-tight flex items-center space-x-2">
          <Info className="w-5 h-5 text-[#7A2438]" />
          <span>Room Category Guide & Institutional Regulations</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#F6F1E8] border border-[#E7DFD2] space-y-2">
            <span className="text-xs font-black uppercase text-[#7A2438] block tracking-wider">
              Small Rooms (8 Rooms)
            </span>
            <p className="text-xs text-stone-700 leading-relaxed">
              <strong>Rooms 101, 107, 108, 114</strong> on Floor 1 & <strong>Rooms 201, 207, 214, 220</strong> on Floor 2. Compact single/twin air-conditioned accommodation with attached geyser bathroom.
            </p>
            <div className="text-xs font-black text-[#7A2438]">₹1,000 / night</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F6F1E8] border border-[#E7DFD2] space-y-2">
            <span className="text-xs font-black uppercase text-[#7A2438] block tracking-wider">
              Small Double Regular (6 Rooms)
            </span>
            <p className="text-xs text-stone-700 leading-relaxed">
              <strong>Rooms 208, 209, 210, 211, 212, 213</strong> on Floor 2. Equipped with double bedding, work desk, 43" Smart TV, and campus Wi-Fi.
            </p>
            <div className="text-xs font-black text-[#7A2438]">₹1,200 / night</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F6F1E8] border border-[#E7DFD2] space-y-2">
            <span className="text-xs font-black uppercase text-[#7A2438] block tracking-wider">
              Large Double-Bedded (16 Rooms)
            </span>
            <p className="text-xs text-stone-700 leading-relaxed">
              <strong>Rooms 102, 103, 105, 106, 109, 110, 112, 113</strong> (Floor 1) & <strong>Rooms 202, 203, 205, 206, 215, 216, 218, 219</strong> (Floor 2). Spacious master suite for visiting parents & scholars.
            </p>
            <div className="text-xs font-black text-[#7A2438]">₹1,500 / night</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF6ED] border-2 border-[#C6A15B] space-y-2">
            <span className="text-xs font-black uppercase text-[#7A2438] block tracking-wider">
              University Guest Suites (4 Rooms)
            </span>
            <p className="text-xs text-stone-700 leading-relaxed">
              <strong>Rooms 104, 111</strong> (Floor 1) & <strong>Rooms 204, 217</strong> (Floor 2). Reserved for visiting university VIP dignitaries, council members & external examiners.
            </p>
            <div className="text-xs font-black text-[#7A2438]">Institutional Allocation</div>
          </div>
        </div>

        <div className="pt-2 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-600">
          <div>
            Check-In: <strong>12:00 PM (Noon)</strong> • Check-Out: <strong>11:00 AM</strong> • Maximum Occupancy: <strong>2 Guests / Room</strong>
          </div>
          <Link
            to="/tariff"
            className="text-xs font-bold text-[#7A2438] hover:underline flex items-center space-x-1"
          >
            <span>View Complete Institutional Tariff & Rules</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}