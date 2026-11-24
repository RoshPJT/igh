import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  Award,
  Trees,
  Users,
  Compass,
  Sparkles,
  ArrowRight,
  Clock,
  Phone,
  Mail,
  CheckCircle2
} from 'lucide-react';
import guesthouseImg from '../assets/bit_guesthouse.jpg';

export default function AboutPage({ t = {} }) {
  const isHindi = t.portalName?.includes('बीआईटी');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 font-sans">
      {/* Hero Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-12 border border-[#E7DFD2] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#C6A15B]/15 via-transparent to-transparent pointer-events-none rounded-full blur-2xl" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-5">
            <span className="px-3.5 py-1.5 rounded-full bg-[#7A2438]/10 text-[#7A2438] text-xs font-bold uppercase tracking-wider inline-flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>Official University Hospitality</span>
            </span>

            <h1 className="text-3xl sm:text-5xl font-black text-[#262626] tracking-tight leading-tight">
              About <span className="text-[#7A2438]">BIT Mesra</span> <span className="text-[#C6A15B]">Guest House</span>
            </h1>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
              Birla Institute of Technology (BIT) Mesra Guest House serves as the premier campus hospitality residence for visiting dignitaries, academic examiners, research collaborators, alumni, and parents of enrolled students.
            </p>

            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
              Nestled within the institute's landmark 780-acre picturesque campus in Ranchi, Jharkhand, our guest house combines traditional academic dignity with contemporary residential comfort, high-speed 1 Gbps NKN optical fiber internet, round-the-clock power backup, and hygienic dining services.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/availability"
                className="px-6 py-3 rounded-xl bg-[#7A2438] hover:bg-[#661C2E] text-white font-black text-xs sm:text-sm uppercase tracking-wider transition shadow-md flex items-center space-x-2"
              >
                <span>Check Room Availability</span>
                <ArrowRight className="w-4 h-4 text-[#C6A15B]" />
              </Link>
              <Link
                to="/tariff"
                className="px-6 py-3 rounded-xl bg-[#FAF6ED] hover:bg-[#F3EBD6] text-[#7A2438] border border-[#C6A15B] font-bold text-xs sm:text-sm uppercase tracking-wider transition"
              >
                <span>Tariff & Guidelines</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-[#C6A15B] relative h-80 sm:h-96 group">
              <img
                src={guesthouseImg}
                alt="BIT Mesra Guest House Portico"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-5">
                <span className="text-xs font-bold text-[#C6A15B] uppercase tracking-wider">
                  Established Campus Landmark
                </span>
                <span className="text-base font-bold text-white">
                  Main Campus, Mesra, Ranchi - 835215
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7DFD2] shadow-xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#7A2438] text-[#C6A15B] flex items-center justify-center font-black shadow-md border border-[#C6A15B]">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-[#262626]">34 Air-Conditioned Rooms</h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Spanning two residential floors with 14 rooms on Floor 1 and 20 rooms on Floor 2. Features Small Rooms, Small Double Regular Rooms, Large Double-Bedded Master Rooms, and VIP University Guest Suites.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7DFD2] shadow-xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#7A2438] text-[#C6A15B] flex items-center justify-center font-black shadow-md border border-[#C6A15B]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-[#262626]">Official Governance</h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Supervised by the Registrar Office and Guest House Warden with transparent institutional tariffs, strict occupancy regulations (max 2 guests per room), and multi-tier identity verification.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7DFD2] shadow-xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#7A2438] text-[#C6A15B] flex items-center justify-center font-black shadow-md border border-[#C6A15B]">
            <Trees className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-[#262626]">780-Acre Campus Serenity</h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Nestled amid lush Sal tree canopies, bird sanctuaries, and the Subarnarekha and Jumar rivers, providing an oasis of peace for focused academic writing, family visits, and delegate conferences.
          </p>
        </div>
      </div>

      {/* Real Photos Grid from User Collection */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E7DFD2] shadow-xl space-y-6">
        <div className="border-b border-[#E7DFD2] pb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black text-[#262626] tracking-tight">
              Authentic Campus Guest House Gallery
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
              Photographs captured across guest rooms, inner corridors, reception, and landscaped surroundings.
            </p>
          </div>
          <Link
            to="/gallery"
            className="text-xs font-bold text-[#7A2438] hover:underline flex items-center space-x-1"
          >
            <span>View Full Gallery</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C6A15B]" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl overflow-hidden shadow-md border border-[#E7DFD2] h-44 group">
            <img
              src="/photos/large-room/IMG_20261123_152043.jpg"
              alt="Large Double-Bedded Room"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="rounded-2xl overflow-hidden shadow-md border border-[#E7DFD2] h-44 group">
            <img
              src="/photos/suite/IMG_20261123_152401.jpg"
              alt="University Guest Suite"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="rounded-2xl overflow-hidden shadow-md border border-[#E7DFD2] h-44 group">
            <img
              src="/photos/reception/IMG_20261123_153528.jpg"
              alt="Reception Desk"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="rounded-2xl overflow-hidden shadow-md border border-[#E7DFD2] h-44 group">
            <img
              src="/photos/dinning/IMG_20261123_154038.jpg"
              alt="Dining Hall"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>

      {/* Contact & Administrative Office */}
      <div className="bg-[#FAF6ED] rounded-3xl p-6 sm:p-8 border-2 border-[#C6A15B] shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="text-xl font-black text-[#7A2438]">
            Office of the Guest House Warden & In-Charge
          </h3>
          <p className="text-xs sm:text-sm text-stone-700 max-w-2xl leading-relaxed">
            Main Campus, Birla Institute of Technology, Mesra, Ranchi, Jharkhand - 835215, India. Reception operates 24/7 for guest check-in, key handover, and security passes.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-stone-800 pt-1">
            <span className="flex items-center space-x-1.5">
              <Phone className="w-3.5 h-3.5 text-[#7A2438]" />
              <span>+91 651 2275444 / Ext. 4432</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1.5">
              <Mail className="w-3.5 h-3.5 text-[#7A2438]" />
              <span>guesthouse@bitmesra.ac.in</span>
            </span>
          </div>
        </div>

        <Link
          to="/contact"
          className="px-6 py-3 rounded-xl bg-[#7A2438] hover:bg-[#661C2E] text-white text-xs font-black uppercase tracking-wider transition shadow-md whitespace-nowrap"
        >
          Contact Warden Office
        </Link>
      </div>
    </div>
  );
}