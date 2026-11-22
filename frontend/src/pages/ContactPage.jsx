import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Building,
  Navigation,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Train,
  Plane,
  Car
} from 'lucide-react';

const CONTACT_DIRECTORY = [
  {
    role: 'Guest House Reception & Bookings',
    person: 'Front Desk Officer / Caretaker',
    phone: '+91 651 2275444 / Ext. 4432',
    mobile: '+91 94311 02444',
    email: 'guesthouse@bitmesra.ac.in',
    timings: '24 Hours Open',
  },
  {
    role: 'Registrar Office (Approvals)',
    person: 'Registrar & Hospitality Administration',
    phone: '+91 651 2275444 / Ext. 4402',
    mobile: '+91 94421 04206',
    email: 'registrar.gh@bitmesra.ac.in',
    timings: '9:00 AM – 5:30 PM (Mon – Fri)',
  },
  {
    role: 'Security & Campus Gate 1 Control Room',
    person: 'Chief Security Officer',
    phone: '+91 651 2275444 / Ext. 4499',
    mobile: '+91 94313 82726',
    email: 'security@bitmesra.ac.in',
    timings: '24/7 Gate Verification',
  },
  {
    role: 'Campus Health Centre (Emergency)',
    person: 'Resident Medical Officer on Duty',
    phone: '+91 651 2275444 / Ext. 4440',
    mobile: '+91 94311 09281',
    email: 'healthcentre@bitmesra.ac.in',
    timings: '24/7 Ambulance & Medical Care',
  },
];

const TRANSIT_OPTIONS = [
  {
    icon: Plane,
    mode: 'From Birsa Munda Airport, Ranchi (IXR)',
    distance: 'Approx. 20 km (35–45 minutes drive)',
    desc: 'Prepaid taxis and airport cabs (Ola, Uber) readily available. Take the Ranchi Ring Road or Booty More / NH-33 route directly to BIT Mesra Main Gate.',
  },
  {
    icon: Train,
    mode: 'From Ranchi Railway Station (RNC)',
    distance: 'Approx. 16 km (30–40 minutes drive)',
    desc: 'Regular autorickshaws and app cabs available at station entrance. Route passes via Kantatoli, Booty More, and Ranchi-Patna Highway.',
  },
  {
    icon: Train,
    mode: 'From Hatia Railway Station (HTE)',
    distance: 'Approx. 22 km (45–55 minutes drive)',
    desc: 'Cabs and autos take the Bypass Ring Road via Tupudana & Namkum directly to Mesra.',
  },
  {
    icon: Car,
    mode: 'By Road / Bus (NH-33 / NH-20)',
    distance: 'Direct Highway Connectivity',
    desc: 'Buses heading towards Patna, Hazaribagh, and Dhanbad stop directly at BIT Mesra More (Main Gate). The Guest House is 500m inside the campus.',
  },
];

export default function ContactPage({ t = {} }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'Student Parent',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-[#E7DFD2]">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#7A2438]/10 text-[#7A2438] text-xs font-bold uppercase tracking-wider mb-2">
          <Phone className="w-3.5 h-3.5 text-[#C6A15B]" />
          <span>University Hospitality Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
          Contact BIT Mesra Guest House
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-2xl leading-relaxed">
          Reach our round-the-clock reception desk, caretaker, and Registrar administration for allotment inquiries, conference lounge bookings, and transit guidance.
        </p>
      </div>

      {/* Main Grid: Contact Form + Campus Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Contact & Inquiry Form */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#E7DFD2] space-y-4">
          <div className="border-b border-stone-200 pb-3">
            <h2 className="text-xl font-black text-stone-900">
              Send an Allotment or Visit Inquiry
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Fill in your inquiry and our Guest House caretaker will respond promptly.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-300 text-center space-y-3 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-emerald-950">
                Inquiry Dispatched to Caretaker Desk!
              </h3>
              <p className="text-xs text-emerald-800 leading-relaxed max-w-sm mx-auto">
                Thank you, <strong>{formData.name}</strong>. Your message regarding <em>{formData.category}</em> has been registered. You may also contact reception directly at +91 651 2275444.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', phone: '', category: 'Student Parent', message: '' });
                }}
                className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Your Full Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dr. Rajesh Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#7A2438]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Email Address <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#7A2438]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Mobile Number <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#7A2438]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Visitor Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#7A2438]"
                >
                  <option value="Student Parent">BIT Student Parent / Family</option>
                  <option value="Alumni">BIT Mesra Alumni</option>
                  <option value="Conference Delegate">Conference / Examiner Delegate</option>
                  <option value="Placement Recruiter">Corporate / Placement Recruiter</option>
                  <option value="General Inquiry">Other University Guest</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Inquiry Details / Message <span className="text-rose-600">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Specify dates, number of suites required, or special assistance needed..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#7A2438]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#7A2438] hover:bg-[#661C2E] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4 text-[#C6A15B]" />
                <span>Submit Guest House Inquiry</span>
              </button>
            </form>
          )}
        </div>

        {/* Right: Departmental Contact Directory */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#E7DFD2] space-y-4">
            <h2 className="text-xl font-black text-stone-900 border-b border-stone-200 pb-3">
              Official Key Contacts Directory
            </h2>

            <div className="space-y-4">
              {CONTACT_DIRECTORY.map((contact, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#F6F1E8] border border-[#E7DFD2] hover:border-[#7A2438] transition space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#7A2438] uppercase tracking-wider">
                      {contact.role}
                    </span>
                    <span className="text-[10px] text-stone-500 font-semibold bg-white px-2 py-0.5 rounded-full border border-stone-200">
                      {contact.timings}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-stone-900">{contact.person}</div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-stone-600 pt-1">
                    <div className="flex items-center space-x-1">
                      <Phone className="w-3.5 h-3.5 text-[#7A2438]" />
                      <span>{contact.phone}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Phone className="w-3.5 h-3.5 text-[#C6A15B]" />
                      <span>{contact.mobile}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 text-xs text-[#7A2438] pt-0.5">
                    <Mail className="w-3.5 h-3.5" />
                    <a href={`mailto:${contact.email}`} className="hover:underline font-medium">
                      {contact.email}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Transit & How to Reach BIT Mesra Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#E7DFD2] space-y-6">
        <div className="border-b border-stone-200 pb-3">
          <div className="text-xs font-bold text-[#7A2438] uppercase tracking-wider">
            Travel Logistics
          </div>
          <h2 className="text-2xl font-black text-stone-900 mt-1">
            How to Reach BIT Mesra Guest House
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Located 16 km northeast of Ranchi city center along the Ranchi-Purulia / Patna highway (NH-33).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TRANSIT_OPTIONS.map((tr, idx) => {
            const Icon = tr.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#F6F1E8] border border-[#E7DFD2] space-y-2 flex items-start space-x-4"
              >
                <div className="w-10 h-10 rounded-xl bg-[#7A2438] text-[#C6A15B] flex items-center justify-center flex-shrink-0 shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">{tr.mode}</h3>
                  <div className="text-xs font-bold text-[#7A2438]">{tr.distance}</div>
                  <p className="text-xs text-stone-600 leading-relaxed mt-1">{tr.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Embedded Location Map with Directions */}
      <div className="bg-[#262626] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#C6A15B] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-black text-white flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-[#C6A15B]" />
              <span>Campus Map & Satellite Directions</span>
            </h3>
            <p className="text-xs text-stone-300 mt-0.5">
              BIT Mesra Guest House, Main Campus, Ranchi - 835215, Jharkhand, India.
            </p>
          </div>

          <a
            href="https://maps.google.com/?q=Birla+Institute+of+Technology+Mesra+Ranchi"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-[#C6A15B] hover:bg-[#B58F49] text-[#262626] font-extrabold text-xs uppercase tracking-wider transition flex items-center space-x-1.5 shadow-md flex-shrink-0"
          >
            <span>Open in Google Maps</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="rounded-2xl overflow-hidden border-2 border-[#C6A15B]/60 h-80 bg-stone-900">
          <iframe
            title="BIT Mesra Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3661.341490918731!2d85.43743047510168!3d23.417242278898124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f4e24ebc528f1b%3A0xc36a0d24bf5f284!2sBirla%20Institute%20of%20Technology%2C%20Mesra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            className="w-full h-full border-0"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
