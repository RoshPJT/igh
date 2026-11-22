import React, { useState } from 'react';
import {
  Calendar,
  Users,
  MapPin,
  ChevronDown,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Building,
  GraduationCap
} from 'lucide-react';
import { formatDisplayDate, calculateNights, addDays, getTodayString } from '../utils/dateUtils';

const GUEST_TYPES = [
  { id: 'Student', label: 'BIT Student', desc: 'Roll number verification' },
  { id: 'Parent', label: 'Parent / Family', desc: 'Visiting student family' },
  { id: 'Alumni', label: 'Proud Alumni', desc: 'Degree / batch verification' },
  { id: 'Other College Guest', label: 'Academic Guest', desc: 'Official visitor / other colleges' },
];

export default function SearchWidget({
  checkIn,
  checkOut,
  onDateChange,
  guestCount = 2,
  onGuestCountChange,
  guestType = 'Student',
  onGuestTypeChange,
  floorPreference = 'all',
  onFloorPreferenceChange,
  onSearchRooms,
  t = {},
}) {
  const [activeDropdown, setActiveDropdown] = useState(null); // 'dates', 'guests', 'floor'

  const isHindi = t.portalName?.includes('बीआईटी');
  const today = getTodayString();
  const nights = calculateNights(checkIn, checkOut);
  const minCheckOut = addDays(checkIn || today, 1);

  const checkInDisplay = formatDisplayDate(checkIn, isHindi);
  const checkOutDisplay = formatDisplayDate(checkOut, isHindi);

  const handleCheckInInput = (e) => {
    const val = e.target.value;
    if (val && onDateChange) {
      onDateChange({ checkIn: val });
    }
  };

  const handleCheckOutInput = (e) => {
    const val = e.target.value;
    if (val && onDateChange) {
      onDateChange({ checkOut: val });
    }
  };

  return (
    <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8">
      {/* Top Header Tabs */}
      <div className="bg-[#262626] text-white rounded-t-2xl shadow-lg border border-[#E7DFD2] border-b-0 px-4 py-2.5 flex flex-wrap items-center justify-between text-xs font-semibold">
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#7A2438] text-white border border-[#C6A15B] font-bold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[#C6A15B] animate-pulse" />
            <span>{isHindi ? 'अधिकृत परिसर आरक्षण' : 'Official Campus Reservation'}</span>
          </span>
          <span className="hidden sm:inline-block text-[#F6F1E8] font-medium">
            {isHindi ? '33 एसी एग्जीक्यूटिव सुइट्स • 2 मंजिलें' : '33 AC Executive Suites • Floor 1 & Floor 2'}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[11px] text-[#C6A15B]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{isHindi ? 'कुलसचिव कार्यालय से मान्यता प्राप्त' : 'Registrar Office Approved'}</span>
        </div>
      </div>

      {/* Main Horizontal Search Card (Warm Ivory with Burgundy & Gold accents) */}
      <div className="bg-white rounded-b-2xl rounded-tr-none shadow-2xl border-2 border-[#7A2438] p-3 sm:p-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
        {/* 1. Property / Campus Destination */}
        <div className="md:col-span-3 p-3 rounded-xl bg-[#F6F1E8] border border-[#E7DFD2] hover:border-[#7A2438] transition cursor-default">
          <div className="flex items-center space-x-1.5 text-stone-600 text-[11px] font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-[#7A2438]" />
            <span>{isHindi ? 'स्थान / संपत्ति' : 'Location / Property'}</span>
          </div>
          <div className="text-sm sm:text-base font-black text-[#7A2438] mt-1 truncate">
            {isHindi ? 'बीआईटी मेसरा अतिथि गृह' : 'BIT Mesra Guest House'}
          </div>
          <div className="text-[11px] text-stone-600 truncate">
            Ranchi, Main Campus • 780-acre Green Sanctuary
          </div>
        </div>

        {/* 2. Check-In & Check-Out Date Block */}
        <div className="md:col-span-4 grid grid-cols-2 gap-2 relative">
          {/* Check-In */}
          <div
            onClick={() => setActiveDropdown(activeDropdown === 'dates' ? null : 'dates')}
            className={`p-3 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
              activeDropdown === 'dates'
                ? 'bg-[#FBF3F5] border-[#7A2438] ring-2 ring-[#7A2438]/20'
                : 'bg-[#F6F1E8] border-[#E7DFD2] hover:border-[#7A2438]'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-stone-600 uppercase tracking-wider">
              <span>{isHindi ? 'आगमन (Check-In)' : 'Check-In'}</span>
              <ChevronDown className="w-3 h-3 text-stone-500" />
            </div>
            <div className="mt-1">
              <div className="text-base sm:text-lg font-black text-stone-900">
                {checkInDisplay.shortText || checkIn}
              </div>
              <div className="text-[11px] text-stone-600 font-medium">
                {checkInDisplay.dayText}
              </div>
            </div>
          </div>

          {/* Check-Out */}
          <div
            onClick={() => setActiveDropdown(activeDropdown === 'dates' ? null : 'dates')}
            className={`p-3 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
              activeDropdown === 'dates'
                ? 'bg-[#FBF3F5] border-[#7A2438] ring-2 ring-[#7A2438]/20'
                : 'bg-[#F6F1E8] border-[#E7DFD2] hover:border-[#7A2438]'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-stone-600 uppercase tracking-wider">
              <span>{isHindi ? 'प्रस्थान (Check-Out)' : 'Check-Out'}</span>
              <span className="text-[10px] text-white font-bold bg-[#7A2438] px-1.5 py-0.2 rounded">
                {nights} {nights === 1 ? (isHindi ? 'रात' : 'Night') : (isHindi ? 'रातें' : 'Nights')}
              </span>
            </div>
            <div className="mt-1">
              <div className="text-base sm:text-lg font-black text-stone-900">
                {checkOutDisplay.shortText || checkOut}
              </div>
              <div className="text-[11px] text-stone-600 font-medium">
                {checkOutDisplay.dayText}
              </div>
            </div>
          </div>

          {/* Date Picker Dropdown Popover */}
          {activeDropdown === 'dates' && (
            <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-2xl shadow-2xl border-2 border-[#7A2438] p-4 w-[310px] sm:w-[380px] animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-3">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-[#7A2438]">
                  <Calendar className="w-4 h-4 text-[#7A2438]" />
                  <span>
                    {isHindi
                      ? `अवधि: ${nights} ${nights === 1 ? 'रात' : 'रातें'}`
                      : `Stay Duration: ${nights} Night${nights > 1 ? 's' : ''}`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveDropdown(null)}
                  className="text-xs font-bold text-[#7A2438] hover:underline"
                >
                  {isHindi ? 'सम्पन्न' : 'Done'}
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                    {isHindi ? 'चेक-इन तारीख (दोपहर 12:00 से)' : 'Check-In Date (From 12:00 PM)'}
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    min={today}
                    onChange={handleCheckInInput}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#7A2438]"
                  />
                  <span className="text-[10px] text-stone-500 mt-0.5 block">
                    {isHindi
                      ? 'चेक-इन बदलते ही चेक-आउट स्वतः अगले दिन पर सेट हो जाएगा।'
                      : 'Selecting check-in automatically sets check-out to next calendar day.'}
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                    {isHindi ? 'चेक-आउट तारीख (सुबह 11:00 तक)' : 'Check-Out Date (Until 11:00 AM)'}
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    min={minCheckOut}
                    onChange={handleCheckOutInput}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#7A2438]"
                  />
                  <span className="text-[10px] text-stone-500 mt-0.5 block">
                    {isHindi
                      ? 'लंबे प्रवास हेतु आप चेक-आउट बाद की तारीख चुन सकते हैं।'
                      : 'You can select later dates for multi-night stays.'}
                  </span>
                </div>

                <div className="pt-2 flex justify-between items-center text-xs text-stone-700 bg-[#F6F1E8] p-2.5 rounded-xl border border-[#E7DFD2]">
                  <span>Flat Rate: <strong>₹1,200 / night</strong></span>
                  <span className="font-bold text-[#7A2438]">Total: ₹{nights * 1200}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. Guests, Category & Floor Preference */}
        <div className="md:col-span-3 grid grid-cols-2 gap-2 relative">
          {/* Guests & Category */}
          <div
            onClick={() => setActiveDropdown(activeDropdown === 'guests' ? null : 'guests')}
            className={`p-3 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
              activeDropdown === 'guests'
                ? 'bg-[#FBF3F5] border-[#7A2438] ring-2 ring-[#7A2438]/20'
                : 'bg-[#F6F1E8] border-[#E7DFD2] hover:border-[#7A2438]'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-stone-600 uppercase tracking-wider">
              <span>{isHindi ? 'अतिथि' : 'Guests'}</span>
              <ChevronDown className="w-3 h-3 text-stone-500" />
            </div>
            <div className="mt-1">
              <div className="text-base sm:text-lg font-black text-stone-900 truncate">
                {guestCount} {isHindi ? 'अतिथि' : 'Guests'}
              </div>
              <div className="text-[11px] text-stone-600 truncate capitalize font-medium">
                {guestType}
              </div>
            </div>
          </div>

          {/* Floor Preference */}
          <div
            onClick={() => setActiveDropdown(activeDropdown === 'floor' ? null : 'floor')}
            className={`p-3 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
              activeDropdown === 'floor'
                ? 'bg-[#FBF3F5] border-[#7A2438] ring-2 ring-[#7A2438]/20'
                : 'bg-[#F6F1E8] border-[#E7DFD2] hover:border-[#7A2438]'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-stone-600 uppercase tracking-wider">
              <span>{isHindi ? 'मंजिल' : 'Floor'}</span>
              <ChevronDown className="w-3 h-3 text-stone-500" />
            </div>
            <div className="mt-1">
              <div className="text-base sm:text-lg font-black text-stone-900 truncate">
                {floorPreference === 'all'
                  ? (isHindi ? 'सभी' : 'Any')
                  : `Floor ${floorPreference}`}
              </div>
              <div className="text-[11px] text-stone-600 truncate font-medium">
                {floorPreference === 'all' ? '33 Suites' : floorPreference === 1 ? 'Suites 101-117' : 'Suites 201-216'}
              </div>
            </div>
          </div>

          {/* Guest Selector Dropdown */}
          {activeDropdown === 'guests' && (
            <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-2xl shadow-2xl border-2 border-[#7A2438] p-4 w-[280px] sm:w-[320px] animate-in fade-in zoom-in-95 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <span className="text-xs font-bold text-[#7A2438]">
                  {isHindi ? 'अतिथि संख्या एवं श्रेणी' : 'Guests & Category'}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveDropdown(null)}
                  className="text-xs font-bold text-[#7A2438] hover:underline"
                >
                  Done
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  Number of Guests
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => onGuestCountChange && onGuestCountChange(num)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition border ${
                        guestCount === num
                          ? 'bg-[#7A2438] text-white border-[#7A2438]'
                          : 'bg-[#F6F1E8] text-stone-700 border-[#E7DFD2] hover:bg-stone-200'
                      }`}
                    >
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  Category
                </label>
                <div className="grid grid-cols-1 gap-1">
                  {GUEST_TYPES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => onGuestTypeChange && onGuestTypeChange(cat.id)}
                      className={`w-full text-left p-2 rounded-lg text-xs transition border flex items-center justify-between ${
                        guestType === cat.id
                          ? 'bg-[#FBF3F5] border-[#7A2438] font-bold text-[#7A2438]'
                          : 'bg-white border-stone-200 text-stone-700 hover:bg-[#F6F1E8]'
                      }`}
                    >
                      <div>
                        <div>{cat.label}</div>
                        <div className="text-[10px] text-stone-400 font-normal">{cat.desc}</div>
                      </div>
                      {guestType === cat.id && <Check className="w-3.5 h-3.5 text-[#7A2438]" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Floor Selector Dropdown */}
          {activeDropdown === 'floor' && (
            <div className="absolute top-full right-0 mt-2 z-50 bg-white rounded-2xl shadow-2xl border-2 border-[#7A2438] p-4 w-[260px] animate-in fade-in zoom-in-95 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <span className="text-xs font-bold text-[#7A2438]">
                  {isHindi ? 'मंजिल प्राथमिकता' : 'Floor Preference'}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveDropdown(null)}
                  className="text-xs font-bold text-[#7A2438] hover:underline"
                >
                  Done
                </button>
              </div>

              {[
                { val: 'all', title: 'Any Floor', sub: '33 Suites (Floors 1 & 2)' },
                { val: 1, title: 'Floor 1', sub: '17 Suites (Rooms 101 - 117)' },
                { val: 2, title: 'Floor 2', sub: '16 Suites (Rooms 201 - 216)' },
              ].map((fl) => (
                <button
                  key={fl.val}
                  type="button"
                  onClick={() => {
                    if (onFloorPreferenceChange) onFloorPreferenceChange(fl.val);
                    setActiveDropdown(null);
                  }}
                  className={`w-full text-left p-2 rounded-lg text-xs transition border flex items-center justify-between ${
                    floorPreference === fl.val
                      ? 'bg-[#FBF3F5] border-[#7A2438] font-bold text-[#7A2438]'
                      : 'bg-white border-stone-200 text-stone-700 hover:bg-[#F6F1E8]'
                  }`}
                >
                  <div>
                    <div>{fl.title}</div>
                    <div className="text-[10px] text-stone-400 font-normal">{fl.sub}</div>
                  </div>
                  {floorPreference === fl.val && <Check className="w-3.5 h-3.5 text-[#7A2438]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 4. Action Button: Check Availability / Search Rooms */}
        <div className="md:col-span-2 flex items-center">
          <button
            type="button"
            onClick={onSearchRooms}
            className="w-full h-full min-h-[52px] bg-[#7A2438] hover:bg-[#661C2E] text-white rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg transition transform hover:-translate-y-0.5 border border-[#C6A15B]"
          >
            <span>{isHindi ? 'कमरे खोजें' : 'Check Rooms'}</span>
            <ArrowRight className="w-4 h-4 text-[#C6A15B]" />
          </button>
        </div>
      </div>
    </div>
  );
}
