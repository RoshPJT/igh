import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bed,
  Wifi,
  Wind,
  Bath,
  Tv,
  Users,
  Award,
  Layers,
  CalendarCheck,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import FloorMap from '../components/FloorMap';

const ROOM_CATEGORIES = [
  {
    id: 'executive-king',
    title: 'AC Executive Suite — King Bed',
    roomNumbers: 'Suites 101 – 110 (Floor 1) & 201 – 210 (Floor 2)',
    count: '20 Suites Available',
    tariff: '₹1,200',
    frequency: 'per night',
    capacity: '2 Adults (+ 1 Child under 10)',
    bedType: 'Plush King-Size Bed (6.5 ft × 6 ft)',
    description: 'Designed for visiting parents, scholars, and university examiners seeking residential serenity. Features a spacious climate-controlled bedroom with an ergonomic study workstation, large window overlooking campus greenery, and an attached private bathroom with 24/7 hot water geyser.',
    photos: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: [
      '1.5 Ton Split Air Conditioner with Remote',
      '1 Gbps High-Speed Campus Academic Wi-Fi',
      'Attached Bathroom with 25L Instant Geyser',
      '43-inch Smart LED TV with Satellite Channels',
      'Ergonomic Work Desk with Reading Lamp',
      'Electric Tea Kettle with Daily Tea & Coffee Sachets',
      'Wardrobe with Luggage Rack & Hangers',
      'Fresh 300-thread count Linen & Bath Towels',
    ],
  },
  {
    id: 'executive-twin',
    title: 'AC Executive Suite — Twin Beds',
    roomNumbers: 'Suites 111 – 117 (Floor 1) & 211 – 216 (Floor 2)',
    count: '13 Suites Available',
    tariff: '₹1,200',
    frequency: 'per night',
    capacity: '2 Adults (Separate Individual Beds)',
    bedType: 'Twin Single Spring Beds (3 ft × 6.5 ft each)',
    description: 'Specifically tailored for visiting student delegates, alumni colleagues, recruitment panel executives, and academic co-authors traveling together. Configured with two separate comfortable spring beds, dual reading lights, dedicated wardrobe storage, and high-speed Wi-Fi.',
    photos: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: [
      'Two Separate Twin Spring Beds',
      '1.5 Ton Split Air Conditioner',
      'High-Speed Wi-Fi for Multiple Devices',
      'Attached Modern Bathroom with Geyser',
      'Dual Bedside Tables & Power Outlets',
      'Wardrobe with Secure Storage Lockers',
      'Daily Room Housekeeping & Trash Clearance',
      'Complimentary Packaged Mineral Water',
    ],
  },
];

export default function RoomsPage({
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
  const [activePhotoMap, setActivePhotoMap] = useState({
    'executive-king': 0,
    'executive-twin': 0,
  });
  const [showFloorMap, setShowFloorMap] = useState(false);
  const navigate = useNavigate();

  const handleBookCategory = (category) => {
    navigate('/booking');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-[#E7DFD2] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#7A2438]/10 text-[#7A2438] text-xs font-bold uppercase tracking-wider mb-2">
            <Bed className="w-3.5 h-3.5 text-[#C6A15B]" />
            <span>33 Executive Suites Inventory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Guest House Rooms & Accommodations
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-2xl leading-relaxed">
            All 33 guest suites at the BIT Mesra Guest House are fully air-conditioned, acoustically quiet Executive Suites spread over Floor 1 (Rooms 101–117) and Floor 2 (Rooms 201–216).
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => setShowFloorMap(!showFloorMap)}
            className="px-5 py-3 rounded-xl bg-[#F6F1E8] hover:bg-[#EDE3D3] text-[#7A2438] border border-[#E7DFD2] font-bold text-xs uppercase tracking-wider transition flex items-center justify-center space-x-2"
          >
            <Layers className="w-4 h-4 text-[#C6A15B]" />
            <span>{showFloorMap ? 'Hide Floor Plan' : 'View Interactive Floor Map'}</span>
          </button>

          <Link
            to="/booking"
            className="px-6 py-3 rounded-xl bg-[#7A2438] hover:bg-[#661C2E] text-white font-black text-xs uppercase tracking-wider transition flex items-center justify-center space-x-2 shadow-md"
          >
            <CalendarCheck className="w-4 h-4 text-[#C6A15B]" />
            <span>Book Now</span>
          </Link>
        </div>
      </div>

      {/* Interactive Floor Map Accordion / Section */}
      {showFloorMap && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-[#7A2438] animate-in fade-in space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <h3 className="text-lg font-black text-stone-900">
                Interactive Room Floor Plan (33 Executive Suites)
              </h3>
              <p className="text-xs text-stone-500">
                Inspect room layout on Floor 1 and Floor 2. Green squares indicate availability.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowFloorMap(false)}
              className="text-xs font-bold text-[#7A2438] hover:underline"
            >
              Close Map
            </button>
          </div>

          <FloorMap
            rooms={rooms}
            selectedRoom={selectedRoom}
            onSelectRoom={(r) => {
              if (onSelectRoom) onSelectRoom(r);
              navigate('/booking');
            }}
            checkIn={checkIn}
            checkOut={checkOut}
            onDateChange={onDateChange}
            dateError={dateError}
            floorPreference={floorPreference}
            onRefreshData={onRefreshData}
            isLoading={isLoading}
            t={t}
          />
        </div>
      )}

      {/* Detailed Room Cards (King Suite & Twin Suite) */}
      <div className="space-y-10">
        {ROOM_CATEGORIES.map((cat) => {
          const currentPhotoIdx = activePhotoMap[cat.id] || 0;

          return (
            <div
              key={cat.id}
              className="bg-white rounded-3xl overflow-hidden shadow-xl border border-[#E7DFD2] hover:border-[#7A2438] transition-all duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Left: Room Gallery Carousel */}
                <div className="lg:col-span-5 bg-stone-900 p-4 sm:p-6 flex flex-col justify-between">
                  <div className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-[#C6A15B] h-64 sm:h-72">
                    <img
                      src={cat.photos[currentPhotoIdx]}
                      alt={cat.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-xs text-[#C6A15B] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md">
                      {cat.count}
                    </div>
                  </div>

                  {/* Thumbnail selectors */}
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {cat.photos.map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() =>
                          setActivePhotoMap((prev) => ({ ...prev, [cat.id]: i }))
                        }
                        className={`rounded-xl overflow-hidden h-16 border-2 transition ${
                          currentPhotoIdx === i
                            ? 'border-[#C6A15B] ring-2 ring-[#C6A15B]/50'
                            : 'border-white/20 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={p} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right: Room Details & Amenities */}
                <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-black text-[#7A2438]">
                          {cat.title}
                        </h2>
                        <div className="text-xs text-[#C6A15B] font-bold">
                          {cat.roomNumbers}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-black text-[#7A2438]">{cat.tariff}</div>
                        <div className="text-[11px] text-stone-500">{cat.frequency}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs text-stone-700 bg-[#F6F1E8] p-3 rounded-xl border border-[#E7DFD2]">
                      <span className="flex items-center space-x-1 font-semibold">
                        <Users className="w-4 h-4 text-[#7A2438]" />
                        <span>Capacity: <strong>{cat.capacity}</strong></span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1 font-semibold">
                        <Bed className="w-4 h-4 text-[#7A2438]" />
                        <span>Bedding: <strong>{cat.bedType}</strong></span>
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {cat.description}
                    </p>

                    {/* Amenities Checklist */}
                    <div className="pt-2">
                      <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                        Included Suite Amenities:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {cat.amenities.map((am, idx) => (
                          <div key={idx} className="flex items-start space-x-2 text-xs text-stone-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>{am}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-stone-500">
                      Standard Check-In: 12:00 PM • Check-Out: 11:00 AM
                    </div>

                    <Link
                      to="/booking"
                      className="px-6 py-3 rounded-xl bg-[#7A2438] hover:bg-[#661C2E] text-white font-extrabold text-xs uppercase tracking-wider transition shadow-md flex items-center space-x-2"
                    >
                      <CalendarCheck className="w-4 h-4 text-[#C6A15B]" />
                      <span>Book This Category Now</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
