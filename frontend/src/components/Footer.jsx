import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  ChevronRight,
  Shield,
  ArrowUp
} from 'lucide-react';
import bitLogo from '../assets/bit_mesra_logo.png';
import guesthouseImg from '../assets/bit_guesthouse.jpg';

// Pre-footer gallery strip photos (inspired by VIT reference screenshot)
const PRE_FOOTER_STRIP = [
  {
    url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80',
    title: 'AC Executive Suite',
    category: 'Rooms',
  },
  {
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    title: 'Guest House Dining Hall',
    category: 'Dining',
  },
  {
    url: guesthouseImg,
    title: 'BIT Mesra Guest House Building',
    category: 'Exterior',
  },
  {
    url: 'https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?auto=format&fit=crop&w=600&q=80',
    title: 'Executive Conference Room',
    category: 'Facilities',
  },
  {
    url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
    title: 'Work Lounge & Green View',
    category: 'Suites',
  },
  {
    url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80',
    title: 'Twin Executive Suite',
    category: 'Rooms',
  },
];

export default function Footer({ t = {} }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isHindi = t.portalName?.includes('बीआईटी');

  return (
    <footer className="relative bg-[#262626] text-white overflow-hidden mt-16 border-t-4 border-[#C6A15B]">
      {/* 1. Pre-Footer Full-Width Image Strip (matching user reference screenshot) */}
      <div className="w-full bg-[#1A1A1A] border-b border-[#333333]">
        <div className="grid grid-cols-3 sm:grid-cols-6 h-28 sm:h-36 md:h-40 overflow-hidden">
          {PRE_FOOTER_STRIP.map((img, idx) => (
            <Link
              key={idx}
              to="/gallery"
              className="relative group h-full overflow-hidden block border-r border-[#333333] last:border-r-0"
              title={`${img.title} - View Gallery`}
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 sm:p-2.5">
                <span className="text-[10px] text-[#C6A15B] font-bold uppercase tracking-wider hidden sm:block">
                  {img.category}
                </span>
                <span className="text-[11px] sm:text-xs font-semibold text-white truncate">
                  {img.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 2. Main 3-Column Footer Section (matching user reference screenshot) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10">
          {/* Column 1: Get in Touch With Us */}
          <div className="md:col-span-4 space-y-4">
            <div className="border-b-2 border-[#C6A15B] pb-2 inline-block">
              <h3 className="text-base sm:text-lg font-black tracking-wide uppercase text-white">
                {isHindi ? 'हमसे संपर्क करें' : 'Get in Touch With us'}
              </h3>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <div className="w-14 h-14 rounded-full bg-white p-1 flex items-center justify-center border-2 border-[#C6A15B] shadow-md flex-shrink-0">
                <img
                  src={bitLogo}
                  alt="BIT Mesra Crest"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">
                  {isHindi ? 'बीआईटी मेसरा अतिथि गृह' : 'BIT Mesra Guest House'}
                </h4>
                <p className="text-xs text-[#C6A15B]">
                  {isHindi
                    ? 'बिड़ला प्रौद्योगिकी संस्थान, मेसरा'
                    : 'Birla Institute of Technology, Mesra'}
                </p>
                <span className="text-[10px] text-stone-400">Ranchi, Jharkhand - 835215</span>
              </div>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed pt-1">
              {isHindi
                ? 'बिड़ला प्रौद्योगिकी संस्थान (मेसरा) की आधिकारिक अतिथि आवास सुविधा। शैक्षणिक प्रतिनिधियों, पूर्व छात्रों और अभिभावकों के लिए शांत व सुंदर 780 एकड़ परिसर में आधुनिक आतिथ्य।'
                : 'Official campus guest accommodation facility of Birla Institute of Technology, Mesra. Providing warm hospitality to visiting professors, alumni, research delegates, and student families since 1955.'}
            </p>

            {/* Social Media Icons */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-stone-400 block mb-2 uppercase tracking-wider">
                {isHindi ? 'सोशल मीडिया' : 'Follow Campus Updates'}
              </span>
              <div className="flex items-center space-x-2.5">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/BITMesraRanchiOfficial/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-[#1877F2] hover:brightness-110 flex items-center justify-center text-white transition shadow-sm"
                  title="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/bitmesra/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#C13584] hover:brightness-110 flex items-center justify-center text-white transition shadow-sm"
                  title="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                {/* Twitter / X */}
                <a
                  href="https://twitter.com/BITMesra_Ranchi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-[#1DA1F2] hover:brightness-110 flex items-center justify-center text-white transition shadow-sm"
                  title="Twitter"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://www.youtube.com/@bitmesra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-[#CD201F] hover:brightness-110 flex items-center justify-center text-white transition shadow-sm"
                  title="YouTube"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Contact Information */}
          <div className="md:col-span-4 space-y-3.5">
            <div className="border-b-2 border-[#C6A15B] pb-2 inline-block">
              <h3 className="text-base sm:text-lg font-black tracking-wide uppercase text-white">
                {isHindi ? 'संपर्क सूत्र' : 'Contacts:'}
              </h3>
            </div>

            <div className="space-y-3 text-xs text-stone-300">
              <div>
                <span className="font-bold text-white block">
                  {isHindi ? 'पता (Address):' : 'Address:'}
                </span>
                <span className="text-stone-300 leading-relaxed block">
                  BIT Main Guest House, Mesra Campus,<br />
                  Ranchi - 835215, Jharkhand, India.
                </span>
              </div>

              <div>
                <span className="font-bold text-white block">
                  {isHindi ? 'ईमेल (Email):' : 'Email:'}
                </span>
                <a
                  href="mailto:guesthouse@bitmesra.ac.in"
                  className="text-[#C6A15B] hover:underline"
                >
                  guesthouse@bitmesra.ac.in
                </a>
                <span className="text-stone-400 block text-[11px]">
                  registrar.gh@bitmesra.ac.in
                </span>
              </div>

              <div>
                <span className="font-bold text-white block">
                  {isHindi ? 'लैंडलाइन (Landline):' : 'Land line:'}
                </span>
                <span className="text-stone-300">+91-0651-2275444 / Ext. 4432</span>
              </div>

              <div>
                <span className="font-bold text-white block">
                  {isHindi ? 'मोबाइल (Mobile / Caretaker):' : 'Mobile:'}
                </span>
                <span className="text-stone-300">+91-9431102444 / +91-9442104206</span>
              </div>

              <div className="pt-1">
                <span className="font-bold text-white block">
                  {isHindi ? 'समय (Timings):' : 'Check-In / Out:'}
                </span>
                <span className="text-stone-400 text-[11px]">
                  Check-In: 12:00 PM • Check-Out: 11:00 AM
                </span>
              </div>
            </div>
          </div>

          {/* Column 3: Location Map (matching user reference screenshot) */}
          <div className="md:col-span-4 space-y-3">
            <div className="border-b-2 border-[#C6A15B] pb-2 inline-block">
              <h3 className="text-base sm:text-lg font-black tracking-wide uppercase text-white">
                {isHindi ? 'स्थान (Location):' : 'Location:'}
              </h3>
            </div>

            {/* Embedded Responsive Google Map */}
            <div className="rounded-xl overflow-hidden border-2 border-[#C6A15B]/70 shadow-lg relative h-48 bg-stone-900 group">
              <iframe
                title="BIT Mesra Guest House Google Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3661.341490918731!2d85.43743047510168!3d23.417242278898124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f4e24ebc528f1b%3A0xc36a0d24bf5f284!2sBirla%20Institute%20of%20Technology%2C%20Mesra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-xs px-2 py-1 rounded text-[10px] font-bold text-white flex items-center space-x-1 pointer-events-none">
                <MapPin className="w-3 h-3 text-[#C6A15B]" />
                <span>BIT Mesra, Ranchi</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <a
                href="https://maps.google.com/?q=Birla+Institute+of+Technology+Mesra+Ranchi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#7A2438] hover:bg-[#661C2E] text-white text-xs font-bold transition shadow-sm"
              >
                <span>{isHindi ? 'दिशानिर्देश देखें' : 'Get Directions'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <Link
                to="/contact"
                className="text-xs text-[#C6A15B] hover:underline font-semibold"
              >
                {isHindi ? 'संपूर्ण संपर्क पृष्ठ' : 'Full Contact Details →'}
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Page Links Strip */}
        <div className="mt-10 pt-6 border-t border-[#3D3D3D] flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-stone-400">
          <Link to="/" className="hover:text-[#C6A15B] transition">Home</Link>
          <span className="text-stone-600">•</span>
          <Link to="/tariff" className="hover:text-[#C6A15B] transition">Tariff</Link>
          <span className="text-stone-600">•</span>
          <Link to="/rooms" className="hover:text-[#C6A15B] transition">Rooms</Link>
          <span className="text-stone-600">•</span>
          <Link to="/dining" className="hover:text-[#C6A15B] transition">Dining</Link>
          <span className="text-stone-600">•</span>
          <Link to="/facilities" className="hover:text-[#C6A15B] transition">Facilities</Link>
          <span className="text-stone-600">•</span>
          <Link to="/gallery" className="hover:text-[#C6A15B] transition">Gallery</Link>
          <span className="text-stone-600">•</span>
          <Link to="/things-to-do" className="hover:text-[#C6A15B] transition">Things to Do</Link>
          <span className="text-stone-600">•</span>
          <Link to="/booking" className="hover:text-[#C6A15B] transition">Booking</Link>
          <span className="text-stone-600">•</span>
          <Link to="/contact" className="hover:text-[#C6A15B] transition">Contact Us</Link>
        </div>

        {/* Copyright notice & Scroll to Top */}
        <div className="mt-6 pt-4 border-t border-[#333333] flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-3">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} Birla Institute of Technology, Mesra. All Rights Reserved.
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="w-8 h-8 rounded-full bg-[#C6A15B] hover:bg-[#A68442] text-[#262626] font-bold flex items-center justify-center shadow-lg transition transform hover:-translate-y-0.5"
            title="Scroll to Top"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
