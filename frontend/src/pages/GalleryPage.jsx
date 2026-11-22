import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  CalendarCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import guesthouseImg from '../assets/bit_guesthouse.jpg';
import bitLogo from '../assets/bit_mesra_logo.png';

const CATEGORIES = [
  'All',
  'Guest House Exterior',
  'Guest House Interior',
  'Rooms',
  'Bathrooms',
  'Dining Area',
  'Conference and Meeting Rooms',
  'Reception and Lobby',
  'BIT Mesra Campus',
  'Gardens and Surroundings',
];

const GALLERY_PHOTOS = [
  // Exterior
  {
    url: guesthouseImg,
    title: 'BIT Mesra Guest House Main Façade',
    category: 'Guest House Exterior',
    description: 'The front entrance and portico of the official BIT Mesra Guest House with green lawns and visitor parking.',
  },
  {
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=1000&q=80',
    title: 'Guest House Courtyard Architecture',
    category: 'Guest House Exterior',
    description: 'Quiet central residential courtyard surrounded by 2 floors of Executive AC Suites.',
  },
  // Interior
  {
    url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
    title: 'Executive Corridor & Lounge Area',
    category: 'Guest House Interior',
    description: 'Well-lit corridors, carpeted lounge seating, and quiet academic ambiance on Floor 1.',
  },
  {
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
    title: 'Guest House Foyer & Staircase',
    category: 'Guest House Interior',
    description: 'Polished granite staircases and accessibility corridors connecting Floor 1 and Floor 2.',
  },
  // Rooms
  {
    url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
    title: 'Executive Suite Master Bedroom',
    category: 'Rooms',
    description: 'King-size spring bed, climate control split AC, 300-thread count linen, and reading lamp.',
  },
  {
    url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80',
    title: 'Executive Twin Beds Suite',
    category: 'Rooms',
    description: 'Dual single beds arrangement ideal for visiting student delegates and alumni colleagues.',
  },
  {
    url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80',
    title: 'Study Workstation & Desk',
    category: 'Rooms',
    description: 'Dedicated ergonomic work desk with universal power outlets, high-speed Wi-Fi, and natural daylight.',
  },
  // Bathrooms
  {
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80',
    title: 'Attached Private Bathroom',
    category: 'Bathrooms',
    description: 'Clean ceramic tiles, 25L instant electric geyser hot water, large mirror, and sanitization.',
  },
  {
    url: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1000&q=80',
    title: 'Shower & Premium Toiletries',
    category: 'Bathrooms',
    description: 'High pressure hot/cold water shower, fresh towels, soaps, and sanitary fittings.',
  },
  // Dining Area
  {
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
    title: 'Guest House Dining Hall',
    category: 'Dining Area',
    description: 'Spacious ground-floor dining hall with formal table settings for breakfast, lunch, and dinner.',
  },
  {
    url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1000&q=80',
    title: 'Fresh Traditional Campus Thali',
    category: 'Dining Area',
    description: 'Nutritious homestyle vegetarian thali prepared daily with seasonal vegetables and basmati rice.',
  },
  // Conference and Meeting Rooms
  {
    url: 'https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?auto=format&fit=crop&w=1000&q=80',
    title: 'Executive Conference Room',
    category: 'Conference and Meeting Rooms',
    description: 'Air-conditioned conference table with executive chairs for academic discussions and examiners.',
  },
  {
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
    title: 'Academic Delegation Boardroom',
    category: 'Conference and Meeting Rooms',
    description: 'Meeting setup with high-speed internet connectivity, whiteboard, and presentation facilities.',
  },
  // Reception and Lobby
  {
    url: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1000&q=80',
    title: '24/7 Guest House Reception Desk',
    category: 'Reception and Lobby',
    description: 'Welcoming front desk for check-in, key collection, campus guidance, and taxi arrangements.',
  },
  {
    url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
    title: 'Visitor Waiting Lounge',
    category: 'Reception and Lobby',
    description: 'Plush sofas and institutional display boards in the ground-floor air-conditioned waiting lobby.',
  },
  // BIT Mesra Campus
  {
    url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1000&q=80',
    title: 'BIT Mesra Iconic Clock Tower',
    category: 'BIT Mesra Campus',
    description: 'The historic Main Academic Building and clock tower, the central architectural landmark of BIT Mesra.',
  },
  {
    url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1000&q=80',
    title: 'Departmental Complex & Tree Canopy',
    category: 'BIT Mesra Campus',
    description: 'Serene tree-lined avenues connecting engineering departments, lecture halls, and laboratories.',
  },
  // Gardens and Surroundings
  {
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
    title: 'Subarnarekha Riverfront Vista',
    category: 'Gardens and Surroundings',
    description: 'Scenic riverbank scenery along the northern perimeter of the 780-acre BIT Mesra campus.',
  },
  {
    url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1000&q=80',
    title: 'Guest House Landscaped Lawns',
    category: 'Gardens and Surroundings',
    description: 'Manicured flower beds and shady palm trees in the guest house front garden.',
  },
];

export default function GalleryPage({ t = {} }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filteredPhotos =
    selectedCategory === 'All'
      ? GALLERY_PHOTOS
      : GALLERY_PHOTOS.filter((p) => p.category === selectedCategory);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev + 1) % filteredPhotos.length);
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredPhotos.length]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-[#E7DFD2] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#7A2438]/10 text-[#7A2438] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
            <span>Visual Showcase • 9 Curated Categories</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            BIT Mesra Guest House Photo Gallery
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-2xl leading-relaxed">
            Explore authentic photographs of our guest house exterior, AC Executive Suites, private washrooms, dining hall, meeting rooms, and 780-acre green campus surroundings.
          </p>
        </div>

        <Link
          to="/booking"
          className="px-6 py-3 rounded-xl bg-[#7A2438] hover:bg-[#661C2E] text-white font-black text-xs uppercase tracking-wider transition flex items-center justify-center space-x-2 shadow-md flex-shrink-0"
        >
          <CalendarCheck className="w-4 h-4 text-[#C6A15B]" />
          <span>Book Your Stay</span>
        </Link>
      </div>

      {/* Category Filter Tabs */}
      <div className="bg-white rounded-2xl p-3 shadow-md border border-[#E7DFD2]">
        <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-1">
          <div className="flex items-center space-x-1 text-xs font-bold text-stone-500 px-3 uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-[#7A2438]" />
            <span>Filter:</span>
          </div>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
                setLightboxIndex(null);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap uppercase tracking-wider ${
                selectedCategory === cat
                  ? 'bg-[#7A2438] text-white shadow-md border-b-2 border-[#C6A15B]'
                  : 'bg-[#F6F1E8] text-stone-700 hover:bg-stone-200 border border-[#E7DFD2]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Responsive Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPhotos.map((photo, idx) => (
          <div
            key={idx}
            onClick={() => setLightboxIndex(idx)}
            className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl border border-[#E7DFD2] hover:border-[#7A2438] bg-stone-900 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 h-64 flex flex-col justify-end"
          >
            <img
              src={photo.url}
              alt={photo.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

            {/* Hover expand icon */}
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-[#C6A15B] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-4 h-4" />
            </div>

            {/* Details */}
            <div className="relative z-10 p-4 text-white">
              <span className="text-[10px] text-[#C6A15B] font-bold uppercase tracking-wider block">
                {photo.category}
              </span>
              <h3 className="text-sm font-bold leading-tight mt-0.5">
                {photo.title}
              </h3>
              <p className="text-[11px] text-stone-300 line-clamp-2 mt-1">
                {photo.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal (Fullscreen Image Viewer) */}
      {lightboxIndex !== null && filteredPhotos[lightboxIndex] && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          {/* Close button */}
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition z-50"
            title="Close Lightbox (Esc)"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex(
                (prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length
              );
            }}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition z-50"
            title="Previous Photo (Left Arrow)"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>

          {/* Next Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) => (prev + 1) % filteredPhotos.length);
            }}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition z-50"
            title="Next Photo (Right Arrow)"
          >
            <ChevronRight className="w-7 h-7" />
          </button>

          {/* Center Content Card */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full bg-[#262626] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#C6A15B] flex flex-col max-h-[90vh]"
          >
            <div className="relative bg-black flex items-center justify-center min-h-[300px] sm:min-h-[460px] max-h-[65vh] overflow-hidden">
              <img
                src={filteredPhotos[lightboxIndex].url}
                alt={filteredPhotos[lightboxIndex].title}
                className="max-h-[65vh] w-auto max-w-full object-contain mx-auto"
              />
            </div>

            <div className="p-5 sm:p-6 bg-[#262626] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-stone-800">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold text-[#C6A15B] uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded">
                    {filteredPhotos[lightboxIndex].category}
                  </span>
                  <span className="text-xs text-stone-400">
                    Photo {lightboxIndex + 1} of {filteredPhotos.length}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                  {filteredPhotos[lightboxIndex].title}
                </h3>
                <p className="text-xs text-stone-300 mt-0.5">
                  {filteredPhotos[lightboxIndex].description}
                </p>
              </div>

              <Link
                to="/booking"
                onClick={() => setLightboxIndex(null)}
                className="px-5 py-2.5 rounded-xl bg-[#7A2438] hover:bg-[#661C2E] text-white font-bold text-xs uppercase tracking-wider transition whitespace-nowrap shadow-md"
              >
                Book This Room
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
