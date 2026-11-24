import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bed,
  ShieldCheck,
  Award,
  Sparkles,
  Building2,
  CalendarCheck,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import guesthouseImg from '../assets/bit_guesthouse.jpg';
import bitLogo from '../assets/bit_mesra_logo.png';

export default function HeroSection({ t = {} }) {
  const isHindi = t.portalName?.includes('बीआईटी');

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#42111D] via-[#7A2438] to-[#262626] text-white py-14 px-4 sm:px-6 lg:px-8 border-b-4 border-[#C6A15B] shadow-2xl min-h-[500px]">
      {/* Decorative background grid pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C6A15B_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white p-1 border-2 border-[#C6A15B] shadow-lg flex-shrink-0 flex items-center justify-center">
                <img
                  src={bitLogo}
                  alt="BIT Mesra Official Seal"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div className="inline-flex items-center space-x-2 bg-black/40 backdrop-blur-md border border-[#C6A15B]/60 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#F6F1E8] shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
                <span>
                  {isHindi
                    ? 'आधिकारिक बीआईटी मेसरा आतिथ्य पोर्टल • रांची'
                    : 'Official University Guest Accommodation • Ranchi'}
                </span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-md">
              {isHindi ? 'बीआईटी मेसरा' : 'BIT Mesra'}{' '}
              <span className="text-[#C6A15B]">{isHindi ? 'अतिथि गृह' : 'Guest House'}</span>
            </h1>

            <p className="text-sm sm:text-base text-[#F6F1E8] max-w-2xl leading-relaxed font-normal">
              {isHindi
                ? 'बिड़ला प्रौद्योगिकी संस्थान (बीआईटी), मेसरा की आधिकारिक अतिथि आवास सुविधा में आपका स्वागत है। हमारे 780 एकड़ के प्राकृतिक व हरित परिसर में भ्रमणकारी अभिभावकों, पूर्व छात्रों, शोधकर्ताओं और प्रतिनिधियों के लिए 2 मंजिलों पर 34 वातानुकूलित सुइट्स (29 सार्वजनिक बुकिंग हेतु उपलब्ध) उपलब्ध हैं।'
                : 'Welcome to the official guest house of Birla Institute of Technology, Mesra. Providing 34 fully air-conditioned Executive Suites across 2 residential floors (29 available for public booking, 5 university reserved) for visiting parents, proud alumni, guest researchers, and conference delegates nestled amidst our serene 780-acre green campus.'}
            </p>

            {/* Quick Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/booking"
                className="px-6 py-3 rounded-xl bg-[#C6A15B] hover:bg-[#B58F49] text-[#262626] font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg transition transform hover:-translate-y-0.5 flex items-center space-x-2"
              >
                <CalendarCheck className="w-4 h-4 text-[#7A2438]" />
                <span>{isHindi ? 'कमरा बुक करें' : 'Book Now'}</span>
              </Link>

              <Link
                to="/availability"
                className="px-6 py-3 rounded-xl bg-[#7A2438] hover:bg-[#581827] text-white border-2 border-[#C6A15B] font-bold text-xs sm:text-sm uppercase tracking-wider transition shadow-lg flex items-center space-x-2"
              >
                <span>{isHindi ? 'कमरों का तल मानचित्र देखें' : 'View Room Floor Map'}</span>
                <ChevronRight className="w-4 h-4 text-[#C6A15B]" />
              </Link>

              <Link
                to="/rooms"
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-[#C6A15B]/80 font-bold text-xs sm:text-sm uppercase tracking-wider transition backdrop-blur-xs flex items-center space-x-1.5"
              >
                <span>{isHindi ? 'कमरे एवं किराया' : 'Suites & Tariff'}</span>
              </Link>
            </div>

            {/* Quick Features Chips */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="flex items-center space-x-2.5 bg-black/30 backdrop-blur-md rounded-xl p-3 border border-white/10">
                <Bed className="w-5 h-5 text-[#C6A15B] flex-shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">34 Executive Suites</div>
                  <div className="text-[11px] text-[#F6F1E8]">Floor 1 (14) & Floor 2 (20)</div>
                </div>
              </div>

              <div className="flex items-center space-x-2.5 bg-black/30 backdrop-blur-md rounded-xl p-3 border border-white/10">
                <Award className="w-5 h-5 text-[#C6A15B] flex-shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">29 Public Bookable</div>
                  <div className="text-[11px] text-[#F6F1E8]">5 University Reserved</div>
                </div>
              </div>

              <div className="flex items-center space-x-2.5 bg-black/30 backdrop-blur-md rounded-xl p-3 border border-white/10 col-span-2 sm:col-span-1">
                <ShieldCheck className="w-5 h-5 text-[#C6A15B] flex-shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">Registrar Verified</div>
                  <div className="text-[11px] text-[#F6F1E8]">Authorized Campus Stay</div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Showcase: Real Guest House Building & Google Drive / Local MP4 Video Player */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-3.5 relative">
              {/* Card 1: Authentic Guest House Building Photo */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-[#C6A15B] group bg-stone-900 col-span-2 sm:col-span-1 h-64 sm:h-72">
                <img
                  src={guesthouseImg}
                  alt="BIT Mesra Official Guest House Building"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-3 pointer-events-none">
                  <div className="flex items-center space-x-1 text-[#C6A15B] text-[10px] font-bold uppercase tracking-wider">
                    <Building2 className="w-3 h-3" />
                    <span>Official Building</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white leading-tight mt-0.5">
                    BIT Mesra Guest House
                  </h4>
                  <p className="text-[10px] text-stone-300">Main Campus, Ranchi</p>
                </div>
              </div>

              {/* Card 2: Dedicated Guest House Video Player (Supplied by User) */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-[#C6A15B] group bg-black col-span-2 sm:col-span-1 h-64 sm:h-72 flex flex-col">
                <div className="absolute top-2 left-2 z-10 pointer-events-none flex items-center space-x-1.5 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-[#C6A15B]/70 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-[#C6A15B] animate-pulse" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">Guest House Video</span>
                </div>

                <video
                  src="/bit_guesthouse_video.mp4"
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />

                <div className="absolute bottom-2 right-2 z-10">
                  <a
                    href="https://drive.google.com/file/d/1IeTI_dLk0b53Z02I3DZQbcz9LSGlqqL2/view?usp=drivesdk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 rounded bg-black/80 hover:bg-black text-[10px] text-[#C6A15B] font-bold border border-[#C6A15B]/80 flex items-center space-x-1 backdrop-blur-xs transition"
                    title="Open on Google Drive"
                  >
                    <span>Drive HD</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>

              {/* Floating Verified Badge */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#262626] text-[#C6A15B] px-4 py-1.5 rounded-full text-[11px] font-bold border-2 border-[#C6A15B] shadow-2xl flex items-center space-x-1.5 whitespace-nowrap z-20">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Govt ID & Institute Clearance Required</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
