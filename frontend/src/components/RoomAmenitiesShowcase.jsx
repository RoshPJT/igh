import React, { useState } from 'react';
import {
  Bed,
  Wifi,
  Tv,
  Coffee,
  Bath,
  Sparkles,
  Zap,
  UtensilsCrossed,
  Car,
  ShieldCheck,
  CheckCircle2,
  Wind
} from 'lucide-react';

const PHOTO_URLS = [
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
];

const DEFAULT_PHOTOS = [
  {
    title: 'AC Executive Suite Bedroom',
    desc: 'Plush King-size bed with crisp 300-thread linen and acoustic soundproofing.',
  },
  {
    title: 'Executive Workstation & Lounge',
    desc: 'High-speed Wi-Fi, ergonomic desk chair, and scenic campus greenery view.',
  },
  {
    title: 'Attached Private Washroom',
    desc: '24/7 geyser hot water, premium fittings, and fresh daily sanitization.',
  },
  {
    title: 'Twin Executive Suite Option',
    desc: 'Comfortable twin beds for visiting student delegates and alumni colleagues.',
  },
];

const AMENITY_ICONS = [
  Wind,
  Wifi,
  Bath,
  Coffee,
  Tv,
  Bed,
  Sparkles,
  Zap,
  UtensilsCrossed,
  Car,
];

const DEFAULT_AMENITIES = [
  { name: 'Split Air Conditioner', desc: '1.5 Ton remote-controlled AC in all 33 rooms' },
  { name: 'High-Speed Wi-Fi', desc: '1 Gbps BIT Campus Academic Network' },
  { name: '24/7 Geyser Hot Water', desc: 'Attached modern bathroom with fresh toiletries' },
  { name: 'Electric Kettle & Tea Kit', desc: 'Complimentary tea, coffee, and daily mineral water' },
  { name: '43-inch Smart LED TV', desc: 'Satellite news, sports, and entertainment channels' },
  { name: 'Ergonomic Work Desk', desc: 'Study lamp, power sockets, and quiet workspace' },
  { name: 'Daily Housekeeping', desc: 'Fresh towels, linen change, and trash clearance' },
  { name: '100% Power Backup', desc: 'Campus diesel generators for uninterrupted stay' },
  { name: 'Campus Dining Hall', desc: 'Nutritious breakfast, lunch, and dinner thalis' },
  { name: 'Free Secure Parking', desc: '24/7 security monitored parking for guests' },
];

export default function RoomAmenitiesShowcase({ t = {} }) {
  const [activePhoto, setActivePhoto] = useState(0);

  const photosList = t.photos || DEFAULT_PHOTOS;
  const amenities = t.amenitiesList || DEFAULT_AMENITIES;

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-[#0B254A] to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#FF9A00]">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#FBA17E]/20 text-[#F7D794] text-xs font-bold uppercase tracking-wider mb-2 border border-[#FBA17E]/50">
            <Sparkles className="w-3.5 h-3.5 text-[#FF9A00]" />
            <span>{t.amenitiesBadge || 'Campus Hospitality Amenities'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {t.suiteShowcaseTitle || 'Executive Suite Amenities & Room Gallery'}
          </h2>
          <p className="text-xs sm:text-sm text-blue-200 mt-1 max-w-2xl">
            {t.suiteShowcaseSubtitle ||
              'All 33 guest rooms are fully furnished Executive AC Suites offering residential comfort and academic serenity for visiting guests.'}
          </p>
        </div>

        <div className="flex-shrink-0 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-[#FF9A00]/40 text-center">
          <div className="text-[11px] uppercase tracking-wider text-[#F7D794] font-bold">
            {t.standardTariff || 'Standard Tariff'}
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#FF9A00]">₹1,200</div>
          <div className="text-[10px] text-blue-200">{t.tariffPerNight || 'per room / night (all utilities incl.)'}</div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        {/* Photo Gallery Grid */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center space-x-2">
            <Bed className="w-4 h-4 text-[#EE6200]" />
            <span>{t.roomPhotosTitle || 'Room Photographs (Click to Preview)'}</span>
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Featured Big Photo */}
            <div className="lg:col-span-8 rounded-2xl overflow-hidden shadow-lg border-2 border-[#F7D794] relative group h-64 sm:h-80 md:h-96">
              <img
                src={PHOTO_URLS[activePhoto] || PHOTO_URLS[0]}
                alt={photosList[activePhoto]?.title || 'Room view'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-end p-4 sm:p-6 text-white">
                <span className="text-xs font-bold text-[#F7D794] uppercase tracking-wider">
                  {t.photoDetailLabel || 'Executive Suite Detail'}
                </span>
                <h4 className="text-lg sm:text-xl font-bold mt-0.5">
                  {photosList[activePhoto]?.title}
                </h4>
                <p className="text-xs text-blue-100 mt-1">
                  {photosList[activePhoto]?.desc}
                </p>
              </div>
            </div>

            {/* Thumbnail Selectors */}
            <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-3">
              {photosList.map((photo, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActivePhoto(idx)}
                  className={`rounded-xl overflow-hidden border-2 text-left transition relative flex flex-col justify-end h-20 sm:h-24 lg:h-[84px] group ${
                    activePhoto === idx
                      ? 'border-[#FF9A00] ring-2 ring-[#F7D794] shadow-md scale-[1.02]'
                      : 'border-slate-200 opacity-80 hover:opacity-100 hover:border-[#FBA17E]'
                  }`}
                >
                  <img
                    src={PHOTO_URLS[idx]}
                    alt={photo.title}
                    className="w-full h-full object-cover absolute inset-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="relative p-2 z-10 text-[11px] font-bold text-white truncate">
                    {photo.title}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 10 Amenities Grid */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#FF9A00]" />
            <span>{t.amenitiesIncludedTitle || 'Room Amenities & Services Included'}</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
            {amenities.map((item, idx) => {
              const IconComp = AMENITY_ICONS[idx] || Sparkles;
              return (
                <div
                  key={idx}
                  className="bg-slate-50 hover:bg-[#F7D794]/20 p-3.5 rounded-2xl border border-slate-200 hover:border-[#FF9A00]/60 transition duration-200 flex flex-col justify-between group"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#FBA17E]/20 text-[#EE6200] group-hover:bg-[#FF9A00] group-hover:text-white transition-colors flex items-center justify-center mb-2">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 leading-tight">
                      {item.name}
                    </h5>
                    <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
