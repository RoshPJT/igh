import React from 'react';
import {
  Compass,
  MapPin,
  ExternalLink,
  Navigation,
  Clock,
  Sparkles,
  TreePine,
  Building,
  Waves
} from 'lucide-react';
import { Link } from 'react-router-dom';
import bitLogo from '../assets/bit_mesra_logo.png';

const CAMPUS_LANDMARKS = [
  {
    title: 'Iconic Main Building & Clock Tower',
    type: 'Historic Campus Monument',
    distance: 'On Campus • 400m from Guest House',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
    description: 'The architectural centerpiece of BIT Mesra established in 1955. Houses central administrative offices, seminar halls, and the iconic clock tower visible across the campus skyline.',
    mapQuery: 'BIT+Mesra+Main+Building+Ranchi',
  },
  {
    title: 'Subarnarekha & Jumar River Confluence',
    type: 'Natural Riverfront Landmark',
    distance: 'On Campus • 800m north walk',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    description: 'The natural confluence where the Subarnarekha and Jumar rivers wrap around the 780-acre BIT Mesra campus. A tranquil spot for morning walks and bird watching.',
    mapQuery: 'Subarnarekha+River+BIT+Mesra+Ranchi',
  },
  {
    title: 'Department of Space Engineering & Rocketry',
    type: 'Pioneering Research Complex',
    distance: 'On Campus • 600m west',
    image: 'https://images.unsplash.com/photo-1517976487588-0f04c643fb80?auto=format&fit=crop&w=800&q=80',
    description: 'Established in 1964 as India’s first academic department for space engineering and rocketry. Features propulsion test facilities, aerodynamic tunnels, and missile research labs.',
    mapQuery: 'Department+of+Space+Engineering+BIT+Mesra',
  },
  {
    title: 'G. P. Birla Auditorium & Cultural Complex',
    type: 'Cultural & Convocation Venue',
    distance: 'On Campus • 350m east',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    description: 'A modern 2,500-seat acoustic auditorium hosting annual institute convocations, research conferences, national symposia, and university cultural festivals.',
    mapQuery: 'GP+Birla+Auditorium+BIT+Mesra',
  },
  {
    title: 'Campus Central Temple (Shiv Mandir)',
    type: 'Spiritual Sanctuary',
    distance: 'On Campus • 500m walk',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    description: 'A serene marble temple complex situated amidst lush sal trees, offering a quiet contemplative environment for morning meditation and campus worship.',
    mapQuery: 'Shiv+Mandir+BIT+Mesra',
  },
];

const NEARBY_ATTRACTIONS = [
  {
    title: 'Hundru Falls (सुवर्णरेखा जलप्रपात)',
    type: 'Scenic Waterfall & Geosite',
    distance: 'Approx. 35 km from Guest House',
    driveTime: '55 mins drive via NH-20 / Ormanjhi',
    image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80',
    description: 'One of Jharkhand’s most famous waterfalls, where the Subarnarekha River plunges 98 meters (320 feet) down sheer basalt rocks into a foaming natural pool.',
    mapQuery: 'Hundru+Falls+Ranchi',
  },
  {
    title: 'Jonha Falls (Gautamdhara)',
    type: 'Cascading Waterfalls & Shrine',
    distance: 'Approx. 30 km from Guest House',
    driveTime: '45 mins drive via Purulia Road',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    description: 'Edge-of-the-plateau waterfall named after Lord Gautam Buddha, who according to legend meditated here. A 722-step stairway offers sweeping river valley vistas.',
    mapQuery: 'Jonha+Falls+Gautamdhara+Ranchi',
  },
  {
    title: 'Tagore Hill (Morabadi, Ranchi)',
    type: 'Historical Literary Retreat',
    distance: 'Approx. 14 km from Guest House',
    driveTime: '25 mins drive towards Central Ranchi',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    description: 'A peaceful 300-foot hilltop where Jyotirindranath Tagore (brother of Rabindranath Tagore) built a stone hermitage and composed poetry overlooking Ranchi city.',
    mapQuery: 'Tagore+Hill+Morabadi+Ranchi',
  },
  {
    title: 'Rock Garden & Kanke Dam',
    type: 'Lakefront Park & Sculptures',
    distance: 'Approx. 18 km from Guest House',
    driveTime: '30 mins drive via Ring Road',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    description: 'Constructed using rocks from Gonda Hill with views over the expanse of Kanke Lake. Features hanging bridges, waterfalls, and peaceful sunset viewpoints.',
    mapQuery: 'Rock+Garden+Kanke+Dam+Ranchi',
  },
  {
    title: 'Bhagwan Birsa Biological Park (Ormanjhi Zoo)',
    type: 'Wildlife & Safari Park',
    distance: 'Approx. 10 km from Guest House',
    driveTime: '15 mins drive along NH-33',
    image: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=800&q=80',
    description: 'Sprawling natural zoological park sheltering Royal Bengal tigers, leopards, Asiatic lions, Himalayan black bears, and a diverse aviary along Sapahi river.',
    mapQuery: 'Bhagwan+Birsa+Biological+Park+Ormanjhi',
  },
  {
    title: 'Jagannath Temple, Ranchi',
    type: '17th-Century Heritage Temple',
    distance: 'Approx. 22 km from Guest House',
    driveTime: '40 mins drive via HEC / Dhurwa',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    description: 'Historical hill-fort temple built in 1691 by King Ani Nath Shahdeo, mirroring the Puri Jagannath architecture and commanding panoramic views of Ranchi.',
    mapQuery: 'Jagannath+Temple+Dhurwa+Ranchi',
  },
];

export default function ThingsToDoPage({ t = {} }) {
  const isHindi = t.portalName?.includes('बीआईटी');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-[#E7DFD2] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#7A2438]/10 text-[#7A2438] text-xs font-bold uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5 text-[#C6A15B]" />
            <span>Campus Exploration & Regional Tourism</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Things to Do: BIT Mesra Campus & Ranchi
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-2xl leading-relaxed">
            From the 780-acre serene academic woodlands and confluence of rivers on our campus to famous Jharkhand waterfalls and historic Ranchi hills, discover verified places to visit during your stay.
          </p>
        </div>

        <Link
          to="/booking"
          className="px-6 py-3 rounded-xl bg-[#7A2438] hover:bg-[#661C2E] text-white font-black text-xs uppercase tracking-wider transition flex items-center justify-center space-x-2 shadow-md flex-shrink-0"
        >
          <span>Book Guest House</span>
        </Link>
      </div>

      {/* Part 1: Campus Landmarks & Walkable Spots */}
      <section className="space-y-6">
        <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-[#7A2438] uppercase tracking-wider">
              Walkable From Guest House
            </div>
            <h2 className="text-2xl font-black text-stone-900 mt-0.5">
              BIT Mesra Campus Landmarks
            </h2>
          </div>
          <span className="text-xs text-stone-500 hidden sm:block">
            Within the 780-acre secure campus perimeter
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CAMPUS_LANDMARKS.map((landmark, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl overflow-hidden shadow-lg border border-[#E7DFD2] hover:border-[#7A2438] transition flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={landmark.image}
                    alt={landmark.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#7A2438] text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-md border border-[#C6A15B]">
                    {landmark.type}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center space-x-1 text-[11px] font-bold text-[#C6A15B]">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{landmark.distance}</span>
                  </div>
                  <h3 className="text-base font-black text-stone-900 group-hover:text-[#7A2438] transition">
                    {landmark.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {landmark.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <a
                  href={`https://maps.google.com/?q=${landmark.mapQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 rounded-xl bg-[#F6F1E8] hover:bg-[#EDE3D3] text-[#7A2438] text-xs font-bold transition flex items-center justify-center space-x-1.5 border border-[#E7DFD2]"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Campus Directions</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Part 2: Nearby Ranchi Regional Attractions */}
      <section className="space-y-6">
        <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-[#7A2438] uppercase tracking-wider">
              Short Drive from Campus
            </div>
            <h2 className="text-2xl font-black text-stone-900 mt-0.5">
              Nearby Ranchi Tourist Attractions
            </h2>
          </div>
          <span className="text-xs text-stone-500 hidden sm:block">
            Taxis and auto services can be booked via Reception
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {NEARBY_ATTRACTIONS.map((spot, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl overflow-hidden shadow-lg border border-[#E7DFD2] hover:border-[#7A2438] transition flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={spot.image}
                    alt={spot.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#262626] text-[#C6A15B] text-[10px] font-bold uppercase px-2.5 py-1 rounded-md border border-[#C6A15B]/50">
                    {spot.type}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-stone-500">
                    <span className="flex items-center space-x-1 text-[#7A2438]">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{spot.distance}</span>
                    </span>
                    <span>{spot.driveTime}</span>
                  </div>
                  <h3 className="text-base font-black text-stone-900 group-hover:text-[#7A2438] transition">
                    {spot.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {spot.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <a
                  href={`https://maps.google.com/?q=${spot.mapQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 rounded-xl bg-[#7A2438] hover:bg-[#661C2E] text-white text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#C6A15B]" />
                  <span>Open in Google Maps</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Travel Assistance Callout */}
      <div className="bg-[#F6F1E8] rounded-3xl p-6 sm:p-8 border border-[#E7DFD2] flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-stone-900">
            Need Local Taxi or Campus Vehicle Assistance?
          </h3>
          <p className="text-xs text-stone-600 mt-1">
            The Guest House front desk maintains contact numbers for verified Ranchi prepaid taxis and autorickshaws for sightseeing and airport transfers.
          </p>
        </div>
        <Link
          to="/contact"
          className="px-5 py-2.5 rounded-xl bg-[#7A2438] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#661C2E] transition whitespace-nowrap shadow-sm"
        >
          Contact Travel Desk
        </Link>
      </div>
    </div>
  );
}
