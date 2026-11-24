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
    id: 'large-double',
    title: 'Large Double-Bedded Room',
    roomNumbers: 'Suites 102, 103, 105, 106, 109, 110, 112, 113 (Floor 1) & 202, 203, 205, 206, 215, 216, 218, 219 (Floor 2)',
    count: '16 Rooms Available',
    tariff: '₹1,500',
    frequency: 'per night (+ 5% GST)',
    capacity: 'Max 2 Guests Allowed',
    bedType: 'Comfortable Double Bedding with Plush Mattress',
    description: 'Our most spacious accommodation, designed for visiting parents, scholars, examiners, and delegates. Features a generous climate-controlled bedroom with an ergonomic study workstation, large window overlooking campus greenery, and attached modern bathroom with 24/7 hot water geyser.',
    photos: [
      '/photos/large-room/IMG_20261123_152043.jpg',
      '/photos/large-room/IMG_20261123_152106.jpg',
      '/photos/large-room/IMG_20261123_152215.jpg',
    ],
    amenities: [
      '1.5 Ton Split Air Conditioner with Remote',
      '1 Gbps High-Speed Campus Academic Wi-Fi',
      'Attached Bathroom with 24/7 Geyser Hot Water',
      '43-inch Smart LED TV with Satellite Channels',
      'Ergonomic Work Desk with Reading Lamp',
      'Electric Tea Kettle with Daily Tea & Coffee Kit',
      'Spacious Wardrobe with Luggage Rack & Hangers',
      'Fresh Linen, Bath Towels & University Toiletries',
    ],
  },
  {
    id: 'small-double',
    title: 'Small Double-Bedded Regular Room',
    roomNumbers: 'Suites 208, 209, 210, 211, 212, 213 (Floor 2)',
    count: '6 Rooms Available',
    tariff: '₹1,200',
    frequency: 'per night (+ 5% GST)',
    capacity: 'Max 2 Guests Allowed',
    bedType: 'Double Bedding / Twin Configuration',
    description: 'Tailored for visiting alumni, conference delegates, and academic colleagues seeking comfort and functionality on the quieter second residential floor.',
    photos: [
      '/photos/regular/IMG_20261123_153147.jpg',
      '/photos/regular/IMG_20261123_153342.jpg',
      '/photos/regular/IMG_20261123_153353.jpg',
    ],
    amenities: [
      'Climate-Controlled Split Air Conditioning',
      'High-Speed Campus Academic Wi-Fi',
      'Attached Modern Bathroom with Geyser',
      'Smart LED Satellite Television',
      'Bedside Power Sockets & Reading Lights',
      'Secure Wardrobe with Hangers',
      'Daily Housekeeping & Trash Clearance',
      'Complimentary Packaged Mineral Water',
    ],
  },
  {
    id: 'small-room',
    title: 'Small Room',
    roomNumbers: 'Suites 101, 107, 108, 114 (Floor 1) & 201, 207, 214, 220 (Floor 2)',
    count: '8 Rooms (7 Publicly Bookable, 101 Staff-Reserved)',
    tariff: '₹1,000',
    frequency: 'per night (+ 5% GST)',
    capacity: 'Max 2 Guests Allowed',
    bedType: 'Cozy Single / Compact Bedding',
    description: 'Efficient, well-appointed climate-controlled rooms ideal for visiting researchers, solo attendees, and examiners requiring quiet, practical campus lodging.',
    photos: [
      '/photos/small/IMG_20261123_151839.jpg',
      '/photos/small/IMG_20261123_152004.jpg',
      '/photos/inner spaces/IMG_20261123_153011.jpg',
    ],
    amenities: [
      'Split Air Conditioner with Remote Control',
      'High-Speed Wi-Fi Connection',
      'Attached Private Bathroom with Hot Water',
      'Dedicated Workstation Table & Chair',
      'Electric Tea Kettle & Cups',
      'Clean Linens & Daily Housekeeping',
      '24/7 DG Generator Power Backup',
    ],
  },
  {
    id: 'guest-suite',
    title: 'University Guest Suite',
    roomNumbers: 'Suites 104, 111 (Floor 1) & 204, 217 (Floor 2)',
    count: '4 Suites (Permanently Reserved)',
    tariff: 'Institutional Rate',
    frequency: 'Reserved for University Dignitaries',
    capacity: 'Official Dignitary Allocation',
    bedType: 'Premium King Master Suite',
    description: 'Designated executive suites reserved permanently for external council members, PhD viva examiners, visiting Chancellors, and official university dignitaries. Public self-service booking is restricted.',
    photos: [
      '/photos/suite/IMG_20261123_152401.jpg',
      '/photos/suite/IMG_20261123_152523.jpg',
      '/photos/suite/IMG_20261123_152626.jpg',
    ],
    amenities: [
      'VIP Living Area & King Master Bedroom',
      'Attached Luxury Bathroom with Premium Amenities',
      'Direct Intercom to Warden & Security Reception',
      'VIP Dining Table Reservation in Dining Hall',
      'Quiet River & Forest Frontage',
      'Priority Campus Transport Assistance',
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
