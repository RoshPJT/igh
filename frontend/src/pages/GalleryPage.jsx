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
  'Guest Rooms & Suites',
  'Dining Hall',
  'Reception & Lobby',
  'Inner Spaces & Lounges',
  'Campus Gardens & Greenery',
];

const GALLERY_PHOTOS = [
  // Exterior & Building
  {
    url: guesthouseImg,
    title: 'BIT Mesra Guest House Portico & Entrance',
    category: 'Guest House Exterior',
    description: 'The front entrance and portico of the official BIT Mesra Guest House with visitor parking and lawn surrounds.',
  },
  {
    url: '/photos/greenery/IMG_20261123_153902.jpg',
    title: 'Guest House Front Lawns & Pathway',
    category: 'Guest House Exterior',
    description: 'Paved tree-lined access walkway leading up to the Guest House portico.',
  },

  // Rooms & Suites (From user photoshoot)
  {
    url: '/photos/large-room/IMG_20261123_152043.jpg',
    title: 'Large Double-Bedded Room (Master Bedding)',
    category: 'Guest Rooms & Suites',
    description: 'Spacious master suite with premium double mattress, split AC, and courtyard greenery views.',
  },
  {
    url: '/photos/large-room/IMG_20261123_152106.jpg',
    title: 'Large Double-Bedded Room (Workstation Angle)',
    category: 'Guest Rooms & Suites',
    description: 'Ergonomic study desk, reading lamp, and ambient climate control for academic visitors.',
  },
  {
    url: '/photos/suite/IMG_20261123_152401.jpg',
    title: 'University Guest Suite (VIP Master Wing)',
    category: 'Guest Rooms & Suites',
    description: 'Restricted executive suite reserved for university dignitaries, examiners, and external council guests.',
  },
  {
    url: '/photos/suite/IMG_20261123_152523.jpg',
    title: 'University Guest Suite (Lounge Seating)',
    category: 'Guest Rooms & Suites',
    description: 'Plush executive seating and quiet river view windows in the university dignitary suite.',
  },
  {
    url: '/photos/regular/IMG_20261123_153147.jpg',
    title: 'Small Double-Bedded Regular Room',
    category: 'Guest Rooms & Suites',
    description: 'Comfortable double bedding, wardrobe, and high-speed Wi-Fi on residential Floor 2.',
  },
  {
    url: '/photos/small/IMG_20261123_151839.jpg',
    title: 'Small Room Accommodation',
    category: 'Guest Rooms & Suites',
    description: 'Compact air-conditioned room with attached geyser bathroom for solo researchers.',
  },

  // Dining Area (From user photoshoot)
  {
    url: '/photos/dinning/IMG_20261123_154038.jpg',
    title: 'Guest House Dining Hall (Wide Layout)',
    category: 'Dining Hall',
    description: 'Formal dining tables and hygienic service counter for resident breakfast, lunch, and dinner.',
  },
  {
    url: '/photos/dinning/IMG_20261123_154140.jpg',
    title: 'Guest House Dining Hall (Table Settings)',
    category: 'Dining Hall',
    description: 'Strict 56-seat independent capacity layout ensuring unhurried dining comfort.',
  },
  {
    url: '/photos/dinning/IMG_20261123_154214.jpg',
    title: 'Dining Hall Service Counter',
    category: 'Dining Hall',
    description: 'Daily freshly prepared vegetarian and non-vegetarian thali service area.',
  },
  {
    url: '/photos/dinning/IMG_20261123_154223.jpg',
    title: 'Tea & Beverage Service Corner',
    category: 'Dining Hall',
    description: 'Morning and evening high-tea counter with freshly brewed tea and refreshments.',
  },

  // Reception & Lobby (From user photoshoot)
  {
    url: '/photos/reception/IMG_20261123_153528.jpg',
    title: 'Official Guest House Reception & Registration Desk',
    category: 'Reception & Lobby',
    description: '24/7 reception desk for guest registration, verification of identity documents, and room key handover.',
  },

  // Inner Spaces & Corridors (From user photoshoot)
  {
    url: '/photos/inner spaces/IMG_20261123_153011.jpg',
    title: 'Residential Floor Corridor & Foyer',
    category: 'Inner Spaces & Lounges',
    description: 'Well-lit central corridor connecting suites with quiet acoustic insulation.',
  },
  {
    url: '/photos/inner spaces/IMG_20261123_153047.jpg',
    title: 'Floor Corridor & Elevator Access',
    category: 'Inner Spaces & Lounges',
    description: 'Polished granite flooring and elevator access linking Floor 1 and Floor 2 suites.',
  },
  {
    url: '/photos/inner spaces/IMG_20261123_153523.jpg',
    title: 'Waiting Foyer & Lounge Seating',
    category: 'Inner Spaces & Lounges',
    description: 'Visitor seating area adjacent to the reception portico.',
  },
  {
    url: '/photos/inner spaces/IMG_20261123_153605.jpg',
    title: 'Courtyard Stairwell & Window Vista',
    category: 'Inner Spaces & Lounges',
    description: 'Natural daylight atrium overlooking campus canopy and flower gardens.',
  },

  // Campus Gardens & Greenery (From user photoshoot)
  {
    url: '/photos/greenery/IMG_20261123_154747.jpg',
    title: 'Guest House Surrounding Sal Tree Canopy',
    category: 'Campus Gardens & Greenery',
    description: 'Lush greenery surrounding the guest house perimeter in the 780-acre Mesra campus.',
  },
  {
    url: '/photos/greenery/IMG_20261123_154802.jpg',
    title: 'Campus Garden Pathway & Foliage',
    category: 'Campus Gardens & Greenery',
    description: 'Serene stone pathway for morning walks along the river bank.',
  },
  {
    url: '/photos/greenery/IMG_20261123_155007.jpg',
    title: 'Riverfront Greenery & Bamboo Groves',
    category: 'Campus Gardens & Greenery',
    description: 'Subarnarekha and Jumar riverbank forest cover near the guest house wing.',
  },
  {
    url: '/photos/greenery/IMG_20261123_155138.jpg',
    title: 'Landscaped Lawns & Shaded Trees',
    category: 'Campus Gardens & Greenery',
    description: 'Tranquil natural setting offering peace and quiet for academic visitors.',
  },
  {
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
    title: 'Subarnarekha Riverfront Vista',
    category: 'Campus Gardens & Greenery',
    description: 'Scenic riverbank scenery along the northern perimeter of the 780-acre BIT Mesra campus.',
  },
  {
    url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1000&q=80',
    title: 'Guest House Landscaped Lawns',
    category: 'Campus Gardens & Greenery',
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
