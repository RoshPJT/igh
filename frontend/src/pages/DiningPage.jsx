import React from 'react';
import { Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  Clock,
  Coffee,
  CheckCircle2,
  CalendarCheck,
  ShieldCheck,
  Sparkles,
  Info
} from 'lucide-react';

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
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    description: 'Traditional home-cooked vegetarian meal prepared daily with authentic North Indian spices.',
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
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    description: 'Electric kettle and refreshment supplies replenished daily in all 33 Executive Suites.',
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
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

      {/* Dining Timings Schedule */}
      <div className="bg-[#262626] text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-[#C6A15B] space-y-6">
        <div className="border-b border-stone-700 pb-3">
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
            <Clock className="w-5 h-5 text-[#C6A15B]" />
            <span>Official Dining Timings</span>
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Meals are served hot in the ground-floor Guest House Dining Hall. Room delivery can be coordinated for infirm guests.
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

      {/* Menus & Food Categories */}
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
              <div className="relative h-56 overflow-hidden">
                <img
                  src={menu.image}
                  alt={menu.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-[#7A2438] text-white px-3 py-1 rounded-full text-xs font-bold shadow-md border border-[#C6A15B]">
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

      {/* Hygiene and Campus Dining Guidelines */}
      <div className="bg-[#F6F1E8] rounded-3xl p-6 sm:p-8 border border-[#E7DFD2] space-y-4">
        <div className="flex items-center space-x-2 text-[#7A2438]">
          <ShieldCheck className="w-5 h-5 text-[#C6A15B]" />
          <h3 className="text-base font-bold uppercase tracking-wider">
            Dining Hygiene, Water & Quality Assurance
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-stone-700">
          <div className="bg-white p-4 rounded-xl border border-[#E7DFD2]">
            <strong className="block text-stone-900 mb-1">RO Purified Water</strong>
            Equipped with multi-stage Reverse Osmosis (RO) water purification units with UV treatment for cooking and drinking.
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#E7DFD2]">
            <strong className="block text-stone-900 mb-1">Dietary Preferences</strong>
            Dedicated preparation utensils for pure vegetarian guests. Special low-spice meal requests accommodated for senior citizens.
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#E7DFD2]">
            <strong className="block text-stone-900 mb-1">Payment & Billing</strong>
            Direct meal tokens available at the Guest House reception or added to your consolidated room allotment folio.
          </div>
        </div>
      </div>
    </div>
  );
}
