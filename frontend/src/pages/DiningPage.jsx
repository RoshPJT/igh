import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  Clock,
  Coffee,
  CheckCircle2,
  CalendarCheck,
  ShieldCheck,
  Sparkles,
  Info,
  Users,
  AlertCircle,
  Calendar,
  Check
} from 'lucide-react';
import { api } from '../services/api';
import { getTodayString } from '../utils/dateUtils';

const DINING_TIMINGS = [
  {
    meal: 'Breakfast',
    time: '7:30 AM – 9:30 AM',
    desc: 'Nutritious morning spread with South & North Indian hot preparations, tea, coffee, and fruit.',
    highlight: 'Included or à la carte token',
  },
  {
    meal: 'Lunch',
    time: '12:30 PM – 2:30 PM',
    desc: 'Wholesome campus thali featuring fresh local produce, lentils, regional preparations, and curd.',
    highlight: 'Standard & Special Thalis',
  },
  {
    meal: 'Evening High Tea & Snacks',
    time: '4:30 PM – 6:00 PM',
    desc: 'Freshly brewed masala tea, South Indian filter coffee, vegetable pakoras, and biscuits.',
    highlight: 'Tea & Coffee Lounge',
  },
  {
    meal: 'Dinner',
    time: '7:30 PM – 9:30 PM',
    desc: 'Light, digestive evening meals with vegetarian and non-vegetarian selections.',
    highlight: 'Dinner Thali Service',
  },
];

const MENU_CATEGORIES = [
  {
    title: 'Standard Vegetarian Thali',
    price: '₹120 / thali',
    image: '/photos/dinning/IMG_20261123_154038.jpg',
    description: 'Traditional home-cooked vegetarian meal prepared daily with authentic North Indian spices in clean campus kitchens.',
    items: [
      'Seasonal Vegetable Subzi (Paneer / Mix Veg)',
      'Slow-cooked Yellow Dal Tadka',
      'Steamed Basmati / Jeera Rice',
      '4 Fresh Tawa Phulkas / Rotis with Ghee',
      'Fresh Cucumber, Onion & Lemon Salad',
      'Roasted Papad & Homemade Pickle',
      'Sweet Dessert (Gulab Jamun / Kheer / Rasgulla)',
    ],
  },
  {
    title: 'Special Non-Vegetarian Thali',
    price: '₹180 / thali',
    image: '/photos/dinning/IMG_20261123_154140.jpg',
    description: 'Hearty homestyle chicken or fresh fish curry paired with rice and warm breads.',
    items: [
      'Classic Home-style Chicken Curry or Fish Curry',
      'Dal Fry / Dal Makhani',
      'Steamed Basmati Rice',
      '4 Fresh Tawa Phulkas / Rotis',
      'Green Garden Salad with Lemon Wedge',
      'Papad & Traditional Chutney',
      'Dessert of the Day',
    ],
  },
  {
    title: 'Morning Breakfast Platters',
    price: '₹70 – ₹90 / item',
    image: '/photos/dinning/IMG_20261123_154214.jpg',
    description: 'Hot, freshly cooked breakfast to start your academic and campus schedule.',
    items: [
      'Steamed Idli (3 pcs) & Medu Vada with Sambhar & Coconut Chutney',
      'Crisp Plain / Masala Dosa with Chutneys',
      'Warm Poori Bhaji (4 pcs) with Aloo Masala',
      'Stuffed Aloo / Paneer Parathas with Curd & Pickle',
      '2 Boiled Eggs or Masala Omelette with Butter Toast',
      'Fresh Cornflakes with Hot Milk',
    ],
  },
  {
    title: 'All-Day Hot Beverages & In-Room Kits',
    price: 'Complimentary in Suite',
    image: '/photos/dinning/IMG_20261123_154223.jpg',
    description: 'Electric kettle and refreshment supplies replenished daily in all 34 Executive Suites.',
    items: [
      'Electric Tea Kettle in every suite',
      'Assorted Taj Mahal & Green Tea Bags',
      'Nescafé Instant Coffee Sachets',
      'Dairy Whitener & Sugar Free Pouches',
      'Two 1-Litre Packaged Mineral Water Bottles Daily',
      'Masala Chai available from Dining Hall on order',
    ],
  },
];

export default function DiningPage({ t = {} }) {
  const isHindi = t.portalName?.includes('बीआईटी');
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [capacity, setCapacity] = useState(null);
  const [isLoadingCapacity, setIsLoadingCapacity] = useState(false);
  const [reserveModalOpen, setReserveModalOpen] = useState(false);
  const [reserveSession, setReserveSession] = useState('lunch');
  const [guestName, setGuestName] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [diet, setDiet] = useState('Veg');
  const [reserveSuccess, setReserveSuccess] = useState('');
  const [reserveError, setReserveError] = useState('');

  const fetchCapacity = async (date) => {
    try {
      setIsLoadingCapacity(true);
      const res = await api.getDiningCapacity(date);
      if (res.success) {
        setCapacity(res.data);
      }
      setIsLoadingCapacity(false);
    } catch {
      setIsLoadingCapacity(false);
    }
  };

  useEffect(() => {
    fetchCapacity(selectedDate);
  }, [selectedDate]);

  const handleOpenReserve = (session) => {
    setReserveSession(session);
    setReserveSuccess('');
    setReserveError('');
    setReserveModalOpen(true);
  };

  const handleSubmitReservation = async (e) => {
    e.preventDefault();
    setReserveError('');
    setReserveSuccess('');
    try {
      const res = await api.reserveDining({
        date: selectedDate,
        mealSession: reserveSession,
        guests: Number(guestCount),
        guestName: guestName || 'Resident Guest',
        diet,
      });
      if (res.success) {
        setReserveSuccess(`Dining session confirmed for ${guestCount} guest(s) (${reserveSession.toUpperCase()})!`);
        fetchCapacity(selectedDate);
        setTimeout(() => setReserveModalOpen(false), 2000);
      }
    } catch (err) {
      setReserveError(err.message || 'Capacity exceeded for selected meal session.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 font-sans">
      {/* Header */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-[#E7DFD2] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#7A2438]/10 text-[#7A2438] text-xs font-bold uppercase tracking-wider mb-2">
            <UtensilsCrossed className="w-3.5 h-3.5 text-[#C6A15B]" />
            <span>Campus Hospitality Dining</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Guest House Dining Hall & Cuisine
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-2xl leading-relaxed">
            The BIT Mesra Guest House operates an exclusive, hygienic on-premise dining hall providing wholesome vegetarian and non-vegetarian meals prepared fresh daily for resident guests, visiting faculties, and parents.
          </p>
        </div>

        <Link
          to="/booking"
          className="px-6 py-3 rounded-xl bg-[#7A2438] hover:bg-[#661C2E] text-white font-black text-xs uppercase tracking-wider transition flex items-center justify-center space-x-2 shadow-md flex-shrink-0"
        >
          <CalendarCheck className="w-4 h-4 text-[#C6A15B]" />
          <span>Book a Stay & Dine</span>
        </Link>
      </div>

      {/* Part 8: Real-Time Dining Capacity Tracker (Max 56 Per Session) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-[#C6A15B] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-[#E7DFD2] gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-black text-[#262626]">
                Dining Hall Real-Time Capacity Tracker
              </h2>
              <span className="px-2 py-0.5 rounded bg-[#FAF6ED] text-[#7A2438] border border-[#C6A15B] text-[10px] font-bold">
                Max 56 Seats / Meal Session
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-0.5">
              Strict capacity management ensures unhurried, comfortable dining service for resident guests.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-[#7A2438]" />
            <input
              type="date"
              value={selectedDate}
              min={getTodayString()}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-800 bg-[#F6F1E8]"
            />
          </div>
        </div>

        {/* 3 Meal Session Capacity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Breakfast */}
          <div className="p-5 rounded-2xl bg-[#F6F1E8] border border-[#E7DFD2] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-[#7A2438] tracking-wider">Breakfast</span>
              <span className="text-[10px] font-mono text-stone-600 bg-white px-2 py-0.5 rounded border border-stone-200">7:30 – 9:30 AM</span>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-black text-stone-900">
                {capacity?.breakfast?.remaining ?? 42} <span className="text-xs font-normal text-stone-500">seats left</span>
              </div>
              <div className="text-xs text-stone-500">
                {capacity?.breakfast?.booked ?? 14} / 56 Booked
              </div>
            </div>
            <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#7A2438] h-full transition-all"
                style={{ width: `${((capacity?.breakfast?.booked ?? 14) / 56) * 100}%` }}
              />
            </div>
            <button
              type="button"
              onClick={() => handleOpenReserve('breakfast')}
              className="w-full py-2 rounded-xl bg-white hover:bg-[#FAF6ED] text-[#7A2438] border border-[#C6A15B] text-xs font-bold transition shadow-2xs"
            >
              Reserve Breakfast Token
            </button>
          </div>

          {/* Lunch */}
          <div className="p-5 rounded-2xl bg-[#F6F1E8] border border-[#E7DFD2] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-[#7A2438] tracking-wider">Lunch</span>
              <span className="text-[10px] font-mono text-stone-600 bg-white px-2 py-0.5 rounded border border-stone-200">12:30 – 2:30 PM</span>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-black text-stone-900">
                {capacity?.lunch?.remaining ?? 28} <span className="text-xs font-normal text-stone-500">seats left</span>
              </div>
              <div className="text-xs text-stone-500">
                {capacity?.lunch?.booked ?? 28} / 56 Booked
              </div>
            </div>
            <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#C6A15B] h-full transition-all"
                style={{ width: `${((capacity?.lunch?.booked ?? 28) / 56) * 100}%` }}
              />
            </div>
            <button
              type="button"
              onClick={() => handleOpenReserve('lunch')}
              className="w-full py-2 rounded-xl bg-[#7A2438] hover:bg-[#661C2E] text-white text-xs font-bold transition shadow-sm"
            >
              Reserve Lunch Thali
            </button>
          </div>

          {/* Dinner */}
          <div className="p-5 rounded-2xl bg-[#F6F1E8] border border-[#E7DFD2] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-[#7A2438] tracking-wider">Dinner</span>
              <span className="text-[10px] font-mono text-stone-600 bg-white px-2 py-0.5 rounded border border-stone-200">7:30 – 9:30 PM</span>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-black text-stone-900">
                {capacity?.dinner?.remaining ?? 34} <span className="text-xs font-normal text-stone-500">seats left</span>
              </div>
              <div className="text-xs text-stone-500">
                {capacity?.dinner?.booked ?? 22} / 56 Booked
              </div>
            </div>
            <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#7A2438] h-full transition-all"
                style={{ width: `${((capacity?.dinner?.booked ?? 22) / 56) * 100}%` }}
              />
            </div>
            <button
              type="button"
              onClick={() => handleOpenReserve('dinner')}
              className="w-full py-2 rounded-xl bg-white hover:bg-[#FAF6ED] text-[#7A2438] border border-[#C6A15B] text-xs font-bold transition shadow-2xs"
            >
              Reserve Dinner Thali
            </button>
          </div>
        </div>
      </div>

      {/* Dining Timings Schedule */}
      <div className="bg-[#262626] text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-[#C6A15B] space-y-6">
        <div className="border-b border-stone-700 pb-3">
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
            <Clock className="w-5 h-5 text-[#C6A15B]" />
            <span>Official Dining Timings</span>
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Meals are served hot in the ground-floor Guest House Dining Hall.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DINING_TIMINGS.map((slot, i) => (
            <div
              key={i}
              className="bg-stone-900 p-5 rounded-2xl border border-stone-800 hover:border-[#C6A15B] transition space-y-2"
            >
              <div className="text-[10px] font-bold text-[#C6A15B] uppercase tracking-wider">
                {slot.highlight}
              </div>
              <h3 className="text-base font-bold text-white">{slot.meal}</h3>
              <div className="text-xs font-mono font-bold text-white bg-[#7A2438] px-2.5 py-1 rounded-md inline-block">
                {slot.time}
              </div>
              <p className="text-xs text-stone-400 leading-relaxed pt-1">
                {slot.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Menus & Food Categories with Real Photos */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-stone-900 tracking-tight">
            Available Meal Options & Thali Menus
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Pure ingredients, multi-stage RO purified drinking water, and strict food safety compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {MENU_CATEGORIES.map((menu, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl overflow-hidden shadow-xl border border-[#E7DFD2] hover:border-[#7A2438] transition flex flex-col group"
            >
              <div className="relative h-60 overflow-hidden bg-stone-900">
                <img
                  src={menu.image}
                  alt={menu.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-[#7A2438] text-white px-3.5 py-1 rounded-full text-xs font-extrabold shadow-md border border-[#C6A15B]">
                  {menu.price}
                </div>
              </div>

              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-stone-900">{menu.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {menu.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 space-y-2">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                    Menu Items Included:
                  </span>
                  <ul className="space-y-1 text-xs text-stone-700">
                    {menu.items.map((it, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Meal Reservation Modal */}
      {reserveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border-2 border-[#C6A15B] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="text-lg font-black text-[#262626]">
                Reserve {reserveSession.toUpperCase()} ({selectedDate})
              </h3>
              <button
                type="button"
                onClick={() => setReserveModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitReservation} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-stone-700 mb-1">Guest Name</label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Dr. A. Sharma"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7A2438]"
                />
              </div>

              <div>
                <label className="block text-stone-700 mb-1">Number of Guests (Max 2)</label>
                <select
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7A2438]"
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 mb-1">Diet Preference</label>
                <select
                  value={diet}
                  onChange={(e) => setDiet(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7A2438]"
                >
                  <option value="Vegetarian">Pure Vegetarian Thali (₹120)</option>
                  <option value="Non-Vegetarian">Special Non-Vegetarian Thali (₹180)</option>
                </select>
              </div>

              {reserveError && (
                <p className="text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
                  {reserveError}
                </p>
              )}

              {reserveSuccess && (
                <p className="text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                  {reserveSuccess}
                </p>
              )}

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setReserveModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 hover:bg-stone-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#7A2438] hover:bg-[#661C2E] text-white font-black uppercase tracking-wider shadow-sm"
                >
                  Confirm Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}