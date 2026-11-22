import React from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  CheckCircle2,
  CalendarCheck,
  CreditCard,
  Clock,
  ShieldCheck,
  HelpCircle,
  FileText,
  AlertCircle
} from 'lucide-react';

const TARIFF_PLANS = [
  {
    category: 'BIT Student Parents & Families',
    type: 'Executive AC Suite (King / Twin)',
    rate: '₹1,200',
    frequency: 'per suite / night',
    badge: 'Institutional Rate',
    badgeColor: 'bg-[#7A2438] text-white',
    eligibility: 'Parents & guardians visiting enrolled BIT Mesra students (Roll No. verified).',
    inclusions: [
      '1.5 Ton Split AC',
      'High-Speed Campus Wi-Fi',
      '24/7 Geyser Hot Water & Toiletries',
      'Bed Linen & Towels changed daily',
      'Electric Tea/Coffee Kit in room',
      'Access to Guest House Dining Hall',
      'Free Guarded Campus Parking',
    ],
  },
  {
    category: 'BIT Mesra Alumni',
    type: 'Executive AC Suite (King / Twin)',
    rate: '₹1,200',
    frequency: 'per suite / night',
    badge: 'Alumni Priority',
    badgeColor: 'bg-[#C6A15B] text-[#262626]',
    eligibility: 'Graduated alumni visiting alma mater for reunions, recruitment, or campus events.',
    inclusions: [
      'King or Twin Executive Suite allotment',
      '1 Gbps NKN Campus Academic Wi-Fi',
      'Workstation Desk with Power Sockets',
      'Smart 43-inch LED Satellite TV',
      'Attached Bathroom with Geyser',
      'Complimentary Mineral Water daily',
      'Campus Library & Sports Area access',
    ],
  },
  {
    category: 'Institute Guests & Researchers',
    type: 'Executive AC Suite (Delegates)',
    rate: '₹1,200',
    frequency: 'per suite / night',
    badge: 'Official Stay',
    badgeColor: 'bg-[#748575] text-white',
    eligibility: 'Guest lecturers, PhD external examiners, conference speakers, and university delegates.',
    inclusions: [
      'Priority Floor 1 / Floor 2 suite allotment',
      'Quiet acoustic courtyard view',
      'Executive Conference Lounge booking access',
      'Direct billing to Department / Project if authorized',
      'VIP Dining table reservation in dining hall',
      'Campus transport & shuttle assistance',
    ],
  },
  {
    category: 'Other University & External Guests',
    type: 'Executive AC Suite (General)',
    rate: '₹1,200',
    frequency: 'per suite / night',
    badge: 'Standard Tariff',
    badgeColor: 'bg-stone-800 text-white',
    eligibility: 'Delegates from other universities, government officials, and approved campus visitors.',
    inclusions: [
      'Fully furnished Executive AC Suite',
      'High-speed Wi-Fi access code',
      'Attached Geyser Bath with hot water',
      'Dining hall meal services on thali charges',
      '24/7 security surveillance and parking',
      'Registrar Office verification required',
    ],
  },
];

const RULES_TABLE = [
  { item: 'Standard Check-In Time', detail: '12:00 PM (Noon)' },
  { item: 'Standard Check-Out Time', detail: '11:00 AM' },
  { item: 'Early Check-In / Late Check-Out', detail: 'Subject to suite availability and prior Registrar approval' },
  { item: 'Security Deposit', detail: 'Nil for students/alumni; valid Government Photo ID required at reception' },
  { item: 'Payment Modes', detail: 'Instant UPI, Debit/Credit Cards, Net Banking (Razorpay gateway) or Campus Cash counter' },
  { item: 'Cancellation Policy', detail: 'Free cancellation up to 24 hours prior to check-in time' },
  { item: 'Extra Bed / Mattress', detail: 'Available upon request at ₹300 / night (max 1 extra person per suite)' },
];

export default function TariffPage({ t = {} }) {
  const isHindi = t.portalName?.includes('बीआईटी');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-[#E7DFD2] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#7A2438]/10 text-[#7A2438] text-xs font-bold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5 text-[#C6A15B]" />
            <span>{isHindi ? 'संस्थानिक शुल्क तालिका' : 'Institutional Tariff Schedule'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            {isHindi ? 'कमरा किराया एवं नीतियां' : 'Guest House Tariff & Rates'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-2xl leading-relaxed">
            BIT Mesra operates its guest house on a non-profit university service basis. All 33 Executive Suites across both floors are offered at a flat, transparent, inclusive rate of ₹1,200 per night.
          </p>
        </div>

        <div className="bg-[#F6F1E8] border-2 border-[#C6A15B] rounded-2xl p-5 text-center flex-shrink-0 min-w-[200px]">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
            Flat University Rate
          </span>
          <div className="text-3xl sm:text-4xl font-black text-[#7A2438] mt-0.5">
            ₹1,200
          </div>
          <span className="text-xs text-stone-600 block mt-1">per suite / night</span>
          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full mt-2 inline-block">
            All Utilities & Wi-Fi Included
          </span>
        </div>
      </div>

      {/* 4 Category Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {TARIFF_PLANS.map((plan, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#E7DFD2] hover:border-[#7A2438] transition flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${plan.badgeColor}`}>
                  {plan.badge}
                </span>
                <div className="text-right">
                  <div className="text-2xl font-black text-[#7A2438]">{plan.rate}</div>
                  <div className="text-[10px] text-stone-500">{plan.frequency}</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-black text-stone-900">{plan.category}</h3>
                <div className="text-xs text-[#C6A15B] font-bold mt-0.5">{plan.type}</div>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed bg-[#F6F1E8] p-3 rounded-xl border border-[#E7DFD2]">
                  <strong>Eligibility:</strong> {plan.eligibility}
                </p>
              </div>

              {/* Inclusions list */}
              <div>
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-2">
                  Included Amenities & Privileges:
                </span>
                <ul className="space-y-1.5 text-xs text-stone-600">
                  {plan.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Link
              to="/booking"
              className="w-full py-3 rounded-xl bg-[#7A2438] hover:bg-[#661C2E] text-white font-extrabold text-xs uppercase tracking-wider transition text-center shadow-md flex items-center justify-center space-x-2"
            >
              <CalendarCheck className="w-4 h-4 text-[#C6A15B]" />
              <span>Book Under This Category</span>
            </Link>
          </div>
        ))}
      </div>

      {/* Rules & Policies Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#E7DFD2] space-y-6">
        <div className="border-b border-stone-200 pb-4">
          <div className="flex items-center space-x-2 text-[#7A2438] text-xs font-bold uppercase tracking-wider">
            <FileText className="w-4 h-4 text-[#C6A15B]" />
            <span>Important Terms</span>
          </div>
          <h2 className="text-2xl font-black text-stone-900 mt-1">
            Stay Regulations, Check-In & Cancellation Guidelines
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-stone-700">
            <tbody>
              {RULES_TABLE.map((row, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-stone-100 ${idx % 2 === 0 ? 'bg-[#F6F1E8]/50' : 'bg-white'}`}
                >
                  <td className="py-3.5 px-4 font-bold text-stone-900 w-1/3">
                    {row.item}
                  </td>
                  <td className="py-3.5 px-4 text-stone-600">
                    {row.detail}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 rounded-2xl bg-[#7A2438]/5 border border-[#7A2438]/20 flex items-start space-x-3 text-xs text-[#7A2438]">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#7A2438]" />
          <div>
            <strong>Identity Verification Note:</strong> Per BIT Mesra campus security protocol, guests are required to carry an original Government Photo ID (Aadhaar, Passport, Voter ID) and institution endorsement (Student Roll Number / Department invitation) for verification at Main Gate 1 and the Guest House Reception.
          </div>
        </div>
      </div>
    </div>
  );
}
