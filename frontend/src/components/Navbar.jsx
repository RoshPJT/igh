import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Shield,
  Menu,
  X,
  Globe,
  Bell,
  User,
  LogOut,
  Calendar,
  Sparkles,
  BedDouble,
  Search
} from 'lucide-react';
import bitLogo from '../assets/bit_mesra_logo.png';

const NAV_ITEMS = [
  { path: '/', label: 'Home', hiLabel: 'होम' },
  { path: '/tariff', label: 'Tariff', hiLabel: 'किराया' },
  { path: '/rooms', label: 'Rooms', hiLabel: 'कमरे' },
  { path: '/dining', label: 'Dining', hiLabel: 'भोजन' },
  { path: '/facilities', label: 'Facilities', hiLabel: 'सुविधाएं' },
  { path: '/gallery', label: 'Gallery', hiLabel: 'गैलरी' },
  { path: '/things-to-do', label: 'Things to do', hiLabel: 'आसपास के दर्शनीय स्थल' },
  { path: '/booking', label: 'Booking', hiLabel: 'आरक्षण' },
  { path: '/contact', label: 'Contact Us', hiLabel: 'संपर्क करें' },
];

export default function Navbar({
  onOpenTrackModal,
  currentUser,
  onOpenGuestLogin,
  onLogoutGuest,
  onOpenMyBookings,
  isWardenAuthenticated,
  onOpenWardenLogin,
  lang = 'en',
  onToggleLang,
  notifications = [],
  onOpenNotifications,
  t = {},
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isHindi = lang === 'hi' || t.portalName?.includes('बीआईटी');

  const handleLogoClick = () => {
    // User requested: "when i click bitmesra icon at top whole page should be refreshed"
    window.location.reload();
  };

  const handleRegistrarClick = () => {
    if (!isWardenAuthenticated) {
      onOpenWardenLogin();
    } else {
      navigate('/registrar');
    }
  };

  return (
    <header className="sticky top-0 z-50 shadow-xl font-sans">
      {/* 1. Golden Top Bar */}
      <div className="bg-[#C6A15B] text-[#262626] text-[11px] font-semibold py-1.5 px-4 sm:px-6 lg:px-8 border-b border-[#A68442]/40">
        <div className="max-w-7xl mx-auto flex items-center justify-end gap-2">
          {/* Right: Language Switch, Track, & Profile Actions */}
          <div className="flex items-center space-x-2">
            {/* Language Toggle */}
            <button
              type="button"
              onClick={onToggleLang}
              className="px-2 py-0.5 rounded bg-white/70 hover:bg-white text-stone-900 text-[10px] font-bold flex items-center space-x-1 transition shadow-2xs"
            >
              <Globe className="w-3 h-3 text-[#7A2438]" />
              <span>{lang === 'en' ? 'हिन्दी (HI)' : 'English (EN)'}</span>
            </button>

            {/* Track Booking Button */}
            <button
              type="button"
              onClick={onOpenTrackModal}
              className="px-2 py-0.5 rounded bg-[#7A2438] hover:bg-[#661C2E] text-white text-[10px] font-bold transition shadow-2xs"
            >
              {isHindi ? 'बुकिंग ट्रैक करें' : 'Track Booking'}
            </button>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={onOpenNotifications}
              className="relative p-1 rounded hover:bg-black/10 text-stone-900 transition"
              title="Notifications"
            >
              <Bell className="w-3.5 h-3.5 text-[#7A2438]" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#7A2438] text-white text-[8px] font-bold flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Guest Login / Profile */}
            {currentUser ? (
              <div className="flex items-center space-x-1 bg-white/80 rounded px-1.5 py-0.5">
                <button
                  type="button"
                  onClick={onOpenMyBookings}
                  className="font-bold text-[#7A2438] text-[10px] hover:underline"
                >
                  {currentUser.name?.split(' ')[0]}
                </button>
                <button
                  type="button"
                  onClick={onLogoutGuest}
                  className="text-stone-600 hover:text-red-700 ml-1"
                  title="Logout"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenGuestLogin}
                className="px-2 py-0.5 rounded bg-white hover:bg-stone-100 text-[#7A2438] text-[10px] font-bold transition shadow-2xs flex items-center space-x-1"
              >
                <User className="w-2.5 h-2.5" />
                <span>{isHindi ? 'लॉगिन' : 'Login'}</span>
              </button>
            )}

            {/* Registrar Protected View Switcher */}
            <button
              type="button"
              onClick={handleRegistrarClick}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition flex items-center space-x-1 ${
                location.pathname === '/registrar'
                  ? 'bg-[#7A2438] text-white shadow-xs'
                  : 'bg-stone-900 text-[#C6A15B] hover:bg-black'
              }`}
            >
              <Shield className="w-3 h-3 text-[#C6A15B]" />
              <span>{isHindi ? 'कुलसचिव' : 'Registrar'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar (Charcoal #262626 with Burgundy & Gold accents) */}
      <div className="bg-[#262626] text-white border-b-2 border-[#C6A15B]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Institute Branding (Clicking refreshes whole page) */}
            <div
              onClick={handleLogoClick}
              className="flex items-center space-x-3 cursor-pointer group select-none py-1"
              title="Click to Refresh Portal"
            >
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center p-1 shadow-md border-2 border-[#C6A15B] flex-shrink-0 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                <img
                  src={bitLogo}
                  alt="BIT Mesra Official Crest"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg sm:text-xl font-black tracking-tight text-white group-hover:text-[#C6A15B] transition-colors">
                    BIT Mesra <span className="text-[#C6A15B]">Guest House</span>
                  </span>
                </div>
                <p className="text-[11px] text-stone-300 tracking-wide">
                  Birla Institute of Technology, Mesra • Ranchi
                </p>
              </div>
            </div>

            {/* Desktop Navigation Menu (9 items) */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 uppercase tracking-wider whitespace-nowrap ${
                      isActive
                        ? 'bg-[#7A2438] text-white shadow-md border-b-2 border-[#C6A15B]'
                        : 'text-stone-300 hover:text-white hover:bg-stone-800'
                    }`
                  }
                >
                  {isHindi ? item.hiLabel : item.label}
                </NavLink>
              ))}

              {/* Prominent Quick Book Button */}
              <Link
                to="/booking"
                className="ml-2 px-3.5 py-2 rounded-lg bg-[#7A2438] hover:bg-[#661C2E] text-white border border-[#C6A15B] text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
              >
                {isHindi ? 'कमरा बुक करें' : 'Book Now'}
              </Link>
            </nav>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center space-x-2 lg:hidden">
              <Link
                to="/booking"
                className="px-2.5 py-1.5 rounded-lg bg-[#7A2438] text-white text-xs font-bold uppercase tracking-wider"
              >
                Book
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-stone-800 text-stone-200 hover:text-white hover:bg-stone-700 transition"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* 3. Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#1A1A1A] border-t border-stone-800 px-4 pt-3 pb-6 space-y-2 animate-in fade-in slide-in-from-top-2">
            <div className="grid grid-cols-1 gap-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-2.5 rounded-lg text-xs font-bold transition uppercase tracking-wider flex items-center justify-between ${
                      isActive
                        ? 'bg-[#7A2438] text-white border-l-4 border-[#C6A15B]'
                        : 'text-stone-300 hover:text-white hover:bg-stone-800'
                    }`
                  }
                >
                  <span>{isHindi ? item.hiLabel : item.label}</span>
                  <span className="text-[#C6A15B]">›</span>
                </NavLink>
              ))}
            </div>

            {/* Mobile Quick Actions */}
            <div className="pt-3 border-t border-stone-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-stone-400 text-[11px] pt-1">
                <span>Reception: +91 651 2275444</span>
                <span>Mobile: +91 94311 02444</span>
              </div>
              <div className="text-stone-400 text-[11px]">
                guesthouse@bitmesra.ac.in
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
