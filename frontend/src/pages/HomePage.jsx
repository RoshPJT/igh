import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bed,
  Wifi,
  Coffee,
  Bath,
  Tv,
  Sparkles,
  Zap,
  UtensilsCrossed,
  Car,
  ShieldCheck,
  CalendarCheck,
  ChevronRight,
  ArrowRight,
  MapPin,
  Clock,
  Award,
  CheckCircle2
} from 'lucide-react';
import HeroSection from '../components/HeroSection';
import SearchWidget from '../components/SearchWidget';
import guesthouseImg from '../assets/bit_guesthouse.jpg';

const FEATURED_ROOMS = [
  {
    id: 'king-suite',
    title: 'AC Executive Suite (King Bed)',
    subtitle: 'Suites 101-110 & 201-210 • Floor 1 & Floor 2',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    tariff: '₹1,200',
    capacity: '2 Adults + 1 Child',
    amenities: ['1.5 Ton Split AC', 'High-Speed Wi-Fi', 'Attached Geyser Bath', '43" LED TV', 'Work Desk'],
    description: 'Spacious air-conditioned master suite featuring a plush King-size bed, study desk with lamp, quiet courtyard view, and modern attached bathroom with 24/7 hot water.',
  },
  {
    id: 'twin-suite',
    title: 'AC Executive Suite (Twin Beds)',
    subtitle: 'Suites 111-117 & 211-216 • Floor 1 & Floor 2',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
    tariff: '₹1,200',
    capacity: '2 Delegates / Colleagues',
    amenities: ['Twin Spring Beds', '1.5 Ton Split AC', 'High-Speed Wi-Fi', 'Wardrobe', 'Tea Kettle'],
    description: 'Ideal for visiting academic delegates, alumni friends, and seminar participants. Features two separate beds, ample wardrobe space, and campus Wi-Fi access.',
  },
];

const QUICK_FACILITIES = [
  {
    icon: Wind,
    name: 'Climate Controlled AC',
    desc: 'All 33 suites equipped with 1.5 ton split air conditioners.',
  },
  {
    icon: Wifi,
    name: '1 Gbps Academic Wi-Fi',
    desc: 'High-speed internet powered by the National Knowledge Network.',
  },
  {
    icon: Bath,
    name: '24/7 Geyser Hot Water',
    desc: 'Attached private modern bathrooms with fresh toiletries.',
  },
  {
    icon: UtensilsCrossed,
    name: 'Guest House Dining Hall',
    desc: 'Hygienic vegetarian and non-vegetarian campus meals.',
  },
  {
    icon: Zap,
    name: '100% Power Backup',
    desc: 'Dedicated campus generators for uninterrupted electricity.',
  },
  {
    icon: Car,
    name: 'Visitor Secure Parking',
    desc: 'Round-the-clock guarded parking within guest house premises.',
  },
];

const GALLERY_PREVIEWS = [
  {
    url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80',
    title: 'Executive Bedroom',
    cat: 'Suites',
  },
  {
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    title: 'Dining Hall',
    cat: 'Dining',
  },
  {
    url: guesthouseImg,
    title: 'Guest House Exterior',
    cat: 'Campus',
  },
  {
    url: 'https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?auto=format&fit=crop&w=600&q=80',
    title: 'Meeting Lounge',
    cat: 'Facilities',
  },
];

// Fallback icon for Wind
function Wind(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" />
    </svg>
  );
}

export default function HomePage({
  checkIn,
  checkOut,
  onDateChange,
  guestCount,
  onGuestCountChange,
  guestType,
  onGuestTypeChange,
  floorPreference,
  onFloorPreferenceChange,
  t = {},
}) {
  const navigate = useNavigate();
  const isHindi = t.portalName?.includes('बीआईटी');

  const handleSearchAction = () => {
    navigate('/booking');
  };

  return (
    <div className="space-y-16">
      {/* 1. Photographic Hero Section */}
      <HeroSection t={t} />

      {/* 2. Horizontal Search Widget */}
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
        onSearchRooms={handleSearchAction}
        t={t}
      />

      {/* 3. Welcome / About BIT Mesra Guest House (Layout inspired by user reference screenshot) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#E7DFD2]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Building Photo with gold border */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-[#C6A15B] relative h-72 sm:h-80 group">
                <img
                  src={guesthouseImg}
                  alt="BIT Mesra Guest House Portico"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-4">
                  <div className="text-white">
                    <span className="text-[10px] font-bold text-[#C6A15B] uppercase tracking-wider block">
                      Main Campus Facility
                    </span>
                    <span className="text-sm font-bold">BIT Mesra Guest House Building</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Welcoming Text */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-block border-b-2 border-[#7A2438] pb-1">
                <h2 className="text-2xl sm:text-3xl font-black text-[#7A2438] tracking-tight">
                  {isHindi ? 'अतिथि गृह में स्वागत है' : 'BIT Mesra Guest House'}
                </h2>
              </div>

              <div className="text-sm font-bold text-stone-600">
                {isHindi ? 'सादर नमस्कार!' : 'Greetings & Warm Welcome!'}
              </div>

              <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
                {isHindi
                  ? 'हम बिड़ला प्रौद्योगिकी संस्थान (बीआईटी), मेसरा के अतिथि गृह में आपका हार्दिक स्वागत करते हैं। यह अतिथि गृह हमारे विश्वविद्यालय के आधिकारिक आगंतुकों, सम्मानीय अभिभावकों, शोधकर्ताओं और पूर्व छात्रों को एक शांत और सुरम्य वातावरण में आरामदायक आवास प्रदान करने के उद्देश्य से स्थापित किया गया है।'
                  : 'We warmly welcome you to experience the comfort and tranquil charm of the BIT Mesra Guest House, your premier residence on campus. It is designed to host visiting family members of students, distinguished academic scholars, recruitment executives, and official delegates of the University.'}
              </p>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {isHindi
                  ? 'यह अतिथि गृह 2 मंजिलों पर 33 सुसज्जित एसी कार्यकारी सुइट्स, डाइनिंग हॉल, उच्च गति वाई-फाई और 24/7 सुरक्षा से सुसज्जित है। संस्थान के मुख्य द्वार और प्रशासनिक भवनों के निकट स्थित होने के कारण यह अतिथियों के लिए अत्यंत सुविधाजनक है।'
                  : 'The Guest House combines classic university hospitality with contemporary residential amenities across 33 Executive AC Suites on two floors, surrounded by scenic lawns, riverside forest tracks, and our landmark 780-acre green canopy.'}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to="/rooms"
                  className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#7A2438] hover:bg-[#661C2E] text-white text-xs font-bold transition shadow-sm"
                >
                  <span>{isHindi ? 'सभी 33 सुइट्स देखें' : 'Explore All 33 Suites'}</span>
                  <ArrowRight className="w-4 h-4 text-[#C6A15B]" />
                </Link>

                <Link
                  to="/facilities"
                  className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#F6F1E8] hover:bg-[#EDE3D3] text-[#7A2438] border border-[#E7DFD2] text-xs font-bold transition"
                >
                  <span>{isHindi ? 'परिसर सुविधाएं' : 'Campus Facilities'}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Room Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-[#7A2438]/10 text-[#7A2438] text-xs font-bold uppercase tracking-wider">
            <Bed className="w-3.5 h-3.5 text-[#C6A15B]" />
            <span>{isHindi ? 'कमरे एवं श्रेणियां' : 'Accommodation'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            {isHindi ? 'सुसज्जित एग्जीक्यूटिव सुइट्स' : 'Executive AC Guest Suites'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            {isHindi
              ? 'सभी 33 कमरे वातानुकूलित हैं और समान संस्थागत फ्लैट दर ₹1,200/रात पर उपलब्ध हैं।'
              : 'All 33 suites offer state-of-the-art climate control at an inclusive institutional flat rate of ₹1,200 / night.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {FEATURED_ROOMS.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-3xl overflow-hidden shadow-xl border border-[#E7DFD2] hover:border-[#7A2438] transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={room.image}
                  alt={room.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-[#7A2438] text-white px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-md border border-[#C6A15B]">
                  {room.tariff} <span className="text-[10px] font-normal">/ night</span>
                </div>
                <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-xs text-white px-3 py-1 rounded-lg text-xs font-semibold">
                  Capacity: {room.capacity}
                </div>
              </div>

              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-black text-[#7A2438]">
                    {room.title}
                  </h3>
                  <div className="text-xs text-[#C6A15B] font-bold">
                    {room.subtitle}
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {room.description}
                  </p>
                </div>

                {/* Amenity tags */}
                <div className="pt-2 border-t border-stone-100">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
                    Key Suite Features
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {room.amenities.map((am, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-[#F6F1E8] text-stone-700 text-[11px] font-semibold border border-[#E7DFD2]"
                      >
                        {am}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-2">
                  <Link
                    to="/booking"
                    className="w-full py-3 rounded-xl bg-[#7A2438] hover:bg-[#661C2E] text-white font-extrabold text-xs uppercase tracking-wider transition flex items-center justify-center space-x-2 shadow-md"
                  >
                    <CalendarCheck className="w-4 h-4 text-[#C6A15B]" />
                    <span>Book This Suite Category</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-6">
          <Link
            to="/rooms"
            className="text-xs font-bold text-[#7A2438] hover:underline inline-flex items-center space-x-1"
          >
            <span>View complete 33-room allocation and floor plan</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 5. Facilities Overview Section */}
      <section className="bg-white py-14 border-y border-[#E7DFD2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-[#C6A15B]/20 text-[#7A2438] text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
                <span>Hospitality Inclusions</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                Guest House Facilities & Comforts
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Designed to ensure an effortless, productive, and peaceful stay on campus.
              </p>
            </div>

            <Link
              to="/facilities"
              className="text-xs font-bold text-[#7A2438] hover:underline flex items-center space-x-1 whitespace-nowrap"
            >
              <span>See all facilities & services</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {QUICK_FACILITIES.map((fac, idx) => {
              const Icon = fac.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#F6F1E8] border border-[#E7DFD2] hover:border-[#7A2438] transition flex items-start space-x-4 group"
                >
                  <div className="w-11 h-11 rounded-xl bg-white border border-[#E7DFD2] group-hover:bg-[#7A2438] group-hover:text-white transition flex items-center justify-center text-[#7A2438] flex-shrink-0 shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 group-hover:text-[#7A2438] transition">
                      {fac.name}
                    </h4>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {fac.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Dining Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#262626] text-white rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-[#C6A15B] relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#C6A15B] text-[#262626] font-black text-xs uppercase tracking-wider">
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>Campus Dining Experience</span>
              </span>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Guest House Dining Hall & Refreshments
              </h2>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Enjoy home-style nutritious meals prepared fresh inside our dedicated Guest House Dining Hall. Serving wholesome vegetarian and non-vegetarian thalis, traditional breakfast combinations, and all-day tea/coffee service.
              </p>

              <div className="grid grid-cols-3 gap-3 pt-2 text-center">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-[10px] text-[#C6A15B] uppercase font-bold">Breakfast</div>
                  <div className="text-xs font-bold text-white mt-0.5">7:30 - 9:30 AM</div>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-[10px] text-[#C6A15B] uppercase font-bold">Lunch</div>
                  <div className="text-xs font-bold text-white mt-0.5">12:30 - 2:30 PM</div>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-[10px] text-[#C6A15B] uppercase font-bold">Dinner</div>
                  <div className="text-xs font-bold text-white mt-0.5">7:30 - 9:30 PM</div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/dining"
                  className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-[#C6A15B] hover:bg-[#B58F49] text-[#262626] text-xs font-black uppercase tracking-wider transition"
                >
                  <span>Explore Dining Menus & Timings</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden border-2 border-[#C6A15B] shadow-xl h-64 sm:h-72">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
                  alt="Guest House Dining Setup"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Campus Introduction & Heritage Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F6F1E8] rounded-3xl p-6 sm:p-10 border border-[#E7DFD2] grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-3">
            <span className="text-xs font-bold text-[#7A2438] uppercase tracking-wider block">
              Birla Institute of Technology, Mesra • Established 1955
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              A 780-Acre Scenic Academic Sanctuary
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Founded by visionary industrialist Shri B. M. Birla in 1955, BIT Mesra stands among India’s premier institutions of technical education and research. Nestled by the confluence of the Subarnarekha and Jumar rivers, the campus offers lush canopies, sports complexes, research centers, and a landmark clock tower.
            </p>
            <div className="pt-2">
              <Link
                to="/things-to-do"
                className="text-xs font-bold text-[#7A2438] hover:underline inline-flex items-center space-x-1"
              >
                <span>Discover campus landmarks and nearby Ranchi attractions</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="md:col-span-5 grid grid-cols-2 gap-3 text-center">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#E7DFD2]">
              <div className="text-2xl font-black text-[#7A2438]">780</div>
              <div className="text-[11px] text-stone-600 font-semibold">Green Campus Acres</div>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#E7DFD2]">
              <div className="text-2xl font-black text-[#7A2438]">33</div>
              <div className="text-[11px] text-stone-600 font-semibold">Executive AC Suites</div>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#E7DFD2]">
              <div className="text-2xl font-black text-[#7A2438]">1955</div>
              <div className="text-[11px] text-stone-600 font-semibold">Legacy of Excellence</div>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#E7DFD2]">
              <div className="text-2xl font-black text-[#7A2438]">24/7</div>
              <div className="text-[11px] text-stone-600 font-semibold">Campus Security</div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Photographic Gallery Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Guest House Photo Gallery
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
              Authentic glimpses of our rooms, dining facility, conference lounge, and campus surroundings.
            </p>
          </div>
          <Link
            to="/gallery"
            className="hidden sm:inline-flex items-center space-x-1 text-xs font-bold text-[#7A2438] hover:underline"
          >
            <span>View Full Gallery (9 Categories)</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {GALLERY_PREVIEWS.map((pic, idx) => (
            <Link
              key={idx}
              to="/gallery"
              className="relative rounded-2xl overflow-hidden shadow-md border border-[#E7DFD2] group h-44 sm:h-52 block"
            >
              <img
                src={pic.url}
                alt={pic.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3 text-white">
                <span className="text-[10px] text-[#C6A15B] font-bold uppercase tracking-wider">
                  {pic.cat}
                </span>
                <span className="text-xs font-bold truncate">{pic.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 9. Final Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#7A2438] to-[#581827] text-white rounded-3xl p-8 sm:p-12 shadow-2xl border-2 border-[#C6A15B] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Plan Your Visit to BIT Mesra Campus
            </h2>
            <p className="text-xs sm:text-sm text-[#F6F1E8] max-w-xl">
              Book your Executive Suite in advance. Direct online allotment verification by the Registrar Office with simulated payment & instant confirmation pass.
            </p>
          </div>

          <div className="flex-shrink-0 flex flex-wrap gap-3">
            <Link
              to="/booking"
              className="px-6 py-3.5 rounded-xl bg-[#C6A15B] hover:bg-[#B58F49] text-[#262626] font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg transition transform hover:-translate-y-0.5"
            >
              Book Your Room Now
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-[#C6A15B] font-bold text-xs sm:text-sm uppercase tracking-wider transition"
            >
              Contact Guest House
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
