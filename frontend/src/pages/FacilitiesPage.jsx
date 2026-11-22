import React from 'react';
import { Link } from 'react-router-dom';
import {
  Wifi,
  Wind,
  Bath,
  Zap,
  Users,
  ShieldCheck,
  Car,
  HeartPulse,
  Sparkles,
  UtensilsCrossed,
  Clock,
  CalendarCheck,
  PhoneCall,
  CheckCircle2
} from 'lucide-react';
import guesthouseImg from '../assets/bit_guesthouse.jpg';

const FACILITIES = [
  {
    icon: Wind,
    title: '33 AC Executive Suites',
    category: 'Accommodation',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80',
    description: 'Every suite is individually climate-controlled with remote-operated 1.5 Ton split air conditioners, soundproof double-glazed windows, and comfortable spring beds across Floor 1 & 2.',
  },
  {
    icon: Wifi,
    title: '1 Gbps Academic Wi-Fi Network',
    category: 'Connectivity',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
    description: 'Direct high-speed internet link via the National Knowledge Network (NKN) BIT Mesra campus backbone, enabling video conferencing, research work, and seamless streaming.',
  },
  {
    icon: Bath,
    title: '24/7 Geyser Hot Water & Toiletries',
    category: 'Sanitation',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    description: 'Attached modern private bathrooms equipped with instant electric geysers, clean ceramic fittings, high-pressure shower heads, fresh towels, and sanitized toiletries.',
  },
  {
    icon: Zap,
    title: '100% Diesel Generator Power Backup',
    category: 'Utilities',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    description: 'Zero interruption to lighting, air conditioning, and internet services backed by automatic campus diesel generator sets and substation stabilizers.',
  },
  {
    icon: Users,
    title: 'Executive Conference & Meeting Lounge',
    category: 'Business & Academic',
    image: 'https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?auto=format&fit=crop&w=600&q=80',
    description: 'Air-conditioned conference lounge for visiting examiners, research collaborations, placement panels, and academic delegation discussions on campus.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Guest House Dining Hall',
    category: 'Dining',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    description: 'On-premise dining facility serving hot home-style vegetarian and non-vegetarian thalis, breakfast platters, and tea/coffee for residents and campus guests.',
  },
  {
    icon: ShieldCheck,
    title: '24/7 Reception & Campus Security',
    category: 'Safety & Security',
    image: guesthouseImg,
    description: 'Round-the-clock front desk assistance, CCTV surveillance in public corridors, and integrated security clearance coordination with BIT Mesra Gate 1 control room.',
  },
  {
    icon: Car,
    title: 'Ample Secure Visitor Parking',
    category: 'Convenience',
    image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80',
    description: 'Dedicated paved parking lot inside the gated guest house perimeter for personal cars, university taxis, and visiting delegate transport.',
  },
  {
    icon: HeartPulse,
    title: 'Campus Health Centre & Ambulance Support',
    category: 'Medical Assistance',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80',
    description: '24/7 medical assistance available via the nearby BIT Mesra Health Centre, with on-duty resident medical officers and campus emergency ambulance service.',
  },
];

export default function FacilitiesPage({ t = {} }) {
  const isHindi = t.portalName?.includes('बीआईटी');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-[#E7DFD2] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#7A2438]/10 text-[#7A2438] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
            <span>Campus Hospitality Infrastructure</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Guest House Facilities & Services
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-2xl leading-relaxed">
            Every facility at the BIT Mesra Guest House is maintained to institutional standards to ensure that academic delegates, scholars, alumni, and parents enjoy comfortable, stress-free hospitality.
          </p>
        </div>

        <Link
          to="/booking"
          className="px-6 py-3 rounded-xl bg-[#7A2438] hover:bg-[#661C2E] text-white font-black text-xs uppercase tracking-wider transition flex items-center justify-center space-x-2 shadow-md flex-shrink-0"
        >
          <CalendarCheck className="w-4 h-4 text-[#C6A15B]" />
          <span>Book an Executive Suite</span>
        </Link>
      </div>

      {/* Facilities Grid with Images & Icons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {FACILITIES.map((fac, idx) => {
          const Icon = fac.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl overflow-hidden shadow-xl border border-[#E7DFD2] hover:border-[#7A2438] transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={fac.image}
                  alt={fac.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#7A2438] text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md border border-[#C6A15B]">
                  {fac.category}
                </div>
                <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#7A2438] shadow-md">
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-stone-900 group-hover:text-[#7A2438] transition">
                    {fac.title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    {fac.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center space-x-1.5 text-xs text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified Campus Facility</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Help Banner */}
      <div className="bg-[#262626] text-white rounded-3xl p-8 shadow-2xl border-2 border-[#C6A15B] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-xl font-black text-white">
            Need Special Assistance or Conference Facility?
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
            For academic delegations requiring conference lounge setup, audiovisual projectors, or group dining arrangements, contact the Guest House Caretaker in advance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="tel:+916512275444"
            className="px-5 py-3 rounded-xl bg-[#C6A15B] hover:bg-[#B58F49] text-[#262626] font-bold text-xs uppercase tracking-wider transition flex items-center space-x-1.5"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call Reception</span>
          </a>
          <Link
            to="/contact"
            className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-[#C6A15B] font-bold text-xs uppercase tracking-wider transition"
          >
            Contact Officials
          </Link>
        </div>
      </div>
    </div>
  );
}
