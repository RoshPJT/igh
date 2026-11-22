import React, { useState, useMemo } from 'react';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Users,
  Building,
  CreditCard,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { api } from '../services/api';
import { calculateNights } from '../utils/dateUtils';

export default function BookingForm({
  selectedRoom,
  checkIn,
  checkOut,
  onBookingSuccess,
  onOpenTrackModal,
  currentUser = null,
  t = {},
}) {
  const [guestType, setGuestType] = useState('Student');

  // Universal fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');

  // Sync logged in user profile
  React.useEffect(() => {
    if (currentUser) {
      if (currentUser.name) setName(currentUser.name);
      if (currentUser.phone) {
        const parts = currentUser.phone.trim().split(' ');
        if (parts.length > 1 && parts[0].startsWith('+')) {
          setCountryCode(parts[0]);
          setPhone(parts.slice(1).join(' '));
        } else {
          setPhone(currentUser.phone);
        }
      }
      if (currentUser.guestType) setGuestType(currentUser.guestType);
      if (currentUser.rollNumber) setRollNumber(currentUser.rollNumber);
    }
  }, [currentUser]);

  // Student fields
  const [rollNumber, setRollNumber] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [yearOfStudy, setYearOfStudy] = useState('3rd Year');

  // Parent fields
  const [studentName, setStudentName] = useState('');
  const [studentRollNumber, setStudentRollNumber] = useState('');
  const [relationship, setRelationship] = useState('Father');
  const [govtIdType, setGovtIdType] = useState('Aadhaar Card');
  const [govtIdNumber, setGovtIdNumber] = useState('');

  // Alumni fields
  const [passoutYear, setPassoutYear] = useState('2020');
  const [branch, setBranch] = useState('Computer Science & Engineering');

  // Other College Guest fields
  const [homeCollege, setHomeCollege] = useState('');
  const [sponsoringFaculty, setSponsoringFaculty] = useState('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successBooking, setSuccessBooking] = useState(null);

  // Nights and amount calculation
  const nights = useMemo(() => {
    return calculateNights(checkIn, checkOut);
  }, [checkIn, checkOut]);

  const tariffPerNight = 1200;
  const totalAmount = nights * tariffPerNight;

  // Demo auto-fill presets for quick testing
  const autofillDemo = (type) => {
    setGuestType(type);
    setError('');

    if (type === 'Student') {
      setName('Rohan Verma');
      setEmail('rohan.verma@bitmesra.ac.in');
      setPhone('+91 98351 98765');
      setRollNumber('BTECH/10189/22');
      setDepartment('Electronics & Communication Engg');
      setYearOfStudy('3rd Year');
    } else if (type === 'Parent') {
      setName('Sunil Kumar Verma');
      setEmail('sunil.verma.parent@gmail.com');
      setPhone('+91 94311 88990');
      setStudentName('Rohan Verma');
      setStudentRollNumber('BTECH/10189/22');
      setRelationship('Father');
      setGovtIdType('Aadhaar Card');
      setGovtIdNumber('5432-8901-2345');
    } else if (type === 'Alumni') {
      setName('Ananya Mukherjee');
      setEmail('ananya.alumni.mukherjee@alumni.bitmesra.ac.in');
      setPhone('+91 98112 34567');
      setPassoutYear('2019');
      setBranch('Information Technology');
      setGovtIdType('Passport');
      setGovtIdNumber('M4892104');
    } else if (type === 'Other College Guest') {
      setName('Dr. K. Srinivas Rao');
      setEmail('ks.rao@iitkgp.ac.in');
      setPhone('+91 97480 11223');
      setHomeCollege('IIT Kharagpur');
      setSponsoringFaculty('Prof. S. Dutta (Dept of CSE, BIT Mesra)');
      setGovtIdType('Faculty Institute ID');
      setGovtIdNumber('IITKGP-FAC-8812');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedRoom) {
      setError('Please select a room from the Floor Map before submitting.');
      return;
    }

    if (!checkIn || !checkOut) {
      setError('Please select both Check-In and Check-Out dates.');
      return;
    }

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('Please provide your Full Name, Email Address, and Phone Number.');
      return;
    }

    // Assemble guestDetails based on guestType
    const fullPhone = `${countryCode} ${phone.trim()}`;
    const guestDetails = {
      name: name.trim(),
      email: email.trim(),
      phone: fullPhone,
    };

    if (guestType === 'Student') {
      if (!rollNumber.trim()) {
        setError('Please enter your BIT Roll Number.');
        return;
      }
      guestDetails.rollNumber = rollNumber.trim();
      guestDetails.department = department;
      guestDetails.yearOfStudy = yearOfStudy;
    } else if (guestType === 'Parent') {
      if (!studentName.trim() || !studentRollNumber.trim() || !govtIdNumber.trim()) {
        setError('Please fill in Student Name, Student Roll Number, and Govt ID.');
        return;
      }
      guestDetails.studentName = studentName.trim();
      guestDetails.studentRollNumber = studentRollNumber.trim();
      guestDetails.relationship = relationship;
      guestDetails.govtIdType = govtIdType;
      guestDetails.govtIdNumber = govtIdNumber.trim();
    } else if (guestType === 'Alumni') {
      if (!passoutYear || !govtIdNumber.trim()) {
        setError('Please enter your Passout Year, Branch, and Govt ID Number.');
        return;
      }
      guestDetails.passoutYear = passoutYear;
      guestDetails.branch = branch;
      guestDetails.govtIdType = govtIdType;
      guestDetails.govtIdNumber = govtIdNumber.trim();
    } else if (guestType === 'Other College Guest') {
      if (!homeCollege.trim() || !sponsoringFaculty.trim() || !govtIdNumber.trim()) {
        setError('Please fill Home College, Sponsoring Faculty/Department, and Govt ID.');
        return;
      }
      guestDetails.homeCollege = homeCollege.trim();
      guestDetails.sponsoringFaculty = sponsoringFaculty.trim();
      guestDetails.govtIdType = govtIdType;
      guestDetails.govtIdNumber = govtIdNumber.trim();
    }

    try {
      setIsSubmitting(true);
      const payload = {
        guestType,
        guestDetails,
        roomNumber: selectedRoom.roomNumber,
        checkIn,
        checkOut,
        nights,
        amount: totalAmount,
      };

      const res = await api.createBooking(payload);
      setIsSubmitting(false);

      if (res.success && res.data) {
        setSuccessBooking(res.data);
        if (onBookingSuccess) {
          onBookingSuccess(res.data);
        }
      } else {
        setError(res.message || 'Failed to submit booking request.');
      }
    } catch (err) {
      setIsSubmitting(false);
      setError(err.message || 'Error communicating with booking server.');
    }
  };

  return (
    <div id="guest-verification-form" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Form Header */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0B254A] to-slate-900 p-6 text-white border-b-2 border-[#FF9A00]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#FBA17E]/20 text-[#F7D794] text-xs font-bold uppercase tracking-wider mb-2 border border-[#FBA17E]/50">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF9A00]" />
              <span>{t.wardenVerified || 'Institutional Clearance'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {t.guestBooking ? `${t.guestBooking} - फॉर्म` : 'Guest Verification & Booking Form'}
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 mt-1">
              {t.portalName?.includes('बीआईटी')
                ? 'कुलसचिव अनुमोदन और कमरा आवंटन हेतु विवरण प्रदान करें।'
                : 'Provide institutional identification details for Registrar approval & guest house allotment.'}
            </p>
          </div>

          {/* Quick Preset Buttons for Evaluation */}
          <div className="flex flex-col items-start sm:items-end">
            <span className="text-[11px] font-semibold text-bit-gold mb-1 flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>Quick Test Fill:</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => autofillDemo('Student')}
                className="px-2 py-1 bg-white/15 hover:bg-white/25 rounded-md text-[11px] font-semibold transition"
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => autofillDemo('Parent')}
                className="px-2 py-1 bg-white/15 hover:bg-white/25 rounded-md text-[11px] font-semibold transition"
              >
                Parent
              </button>
              <button
                type="button"
                onClick={() => autofillDemo('Alumni')}
                className="px-2 py-1 bg-white/15 hover:bg-white/25 rounded-md text-[11px] font-semibold transition"
              >
                Alumni
              </button>
              <button
                type="button"
                onClick={() => autofillDemo('Other College Guest')}
                className="px-2 py-1 bg-white/15 hover:bg-white/25 rounded-md text-[11px] font-semibold transition"
              >
                Guest
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification View */}
      {successBooking ? (
        <div className="p-8 text-center space-y-5">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-2xl font-extrabold text-slate-900">
              Booking Request Submitted!
            </h3>
            <p className="text-sm text-slate-600">
              Your room reservation request has been dispatched to the BIT Mesra Guest House Warden for review.
            </p>
          </div>

          {/* Booking Summary Card */}
          <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs text-slate-500 font-semibold uppercase">Booking Reference</span>
              <span className="text-base font-mono font-black text-bit-maroon bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                {successBooking.bookingId}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500 block">Room Number:</span>
                <span className="font-bold text-slate-900">Room {successBooking.roomNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Current Status:</span>
                <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {successBooking.status}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Stay Duration:</span>
                <span className="font-semibold text-slate-800">
                  {successBooking.checkIn} to {successBooking.checkOut} ({successBooking.nights} nights)
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Total Tariff:</span>
                <span className="font-extrabold text-slate-900">
                  ₹{successBooking.amount?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 text-amber-900 rounded-xl text-xs flex items-start space-x-2 border border-amber-200">
              <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Next Step:</strong> The Warden will verify your {successBooking.guestType} credentials. Once <strong>APPROVED</strong>, you can complete simulated payment via UPI/Cards to confirm the room.
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setSuccessBooking(null);
              }}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Book Another Room
            </button>

            <button
              type="button"
              onClick={() => {
                if (onOpenTrackModal) onOpenTrackModal(successBooking.bookingId);
              }}
              className="px-6 py-2.5 rounded-xl bg-bit-maroon hover:bg-bit-maroon-hover text-white text-xs sm:text-sm font-bold shadow-md transition flex items-center space-x-2"
            >
              <span>Track Booking / Pay When Approved</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Selected Room & Tariff Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Room selection summary */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Target Accommodation
                </span>
                {selectedRoom ? (
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">
                    Room {selectedRoom.roomNumber} • Floor {selectedRoom.floor}
                  </div>
                ) : (
                  <div className="text-sm font-bold text-rose-600 mt-0.5">
                    No room selected yet (Click on Floor Map above)
                  </div>
                )}
                <div className="text-xs text-slate-500">AC Executive Suite</div>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Stay Dates
                </span>
                <div className="text-xs font-semibold text-slate-800 mt-0.5">
                  {checkIn && checkOut ? `${checkIn} to ${checkOut}` : 'Select dates above'}
                </div>
                <div className="text-xs font-bold text-bit-maroon">{nights} night(s)</div>
              </div>
            </div>

            {/* Tariff Breakdown Card */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-bit-maroon text-bit-gold flex items-center justify-center font-bold">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Institutional Tariff</div>
                  <div className="text-[11px] text-slate-600">
                    ₹1,200 × {nights} night(s)
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-500">Total Payable</div>
                <div className="text-xl font-black text-bit-maroon">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>

          {/* Guest Type Selector Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Guest Type / Category <span className="text-rose-600">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { type: 'Student', icon: GraduationCap, label: 'Student' },
                { type: 'Parent', icon: Users, label: 'Parent' },
                { type: 'Alumni', icon: GraduationCap, label: 'Alumni' },
                { type: 'Other College Guest', icon: Building, label: 'Other College Guest' },
              ].map((item) => {
                const IconComponent = item.icon;
                const isSelected = guestType === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => {
                      setGuestType(item.type);
                      setError('');
                    }}
                    className={`flex items-center justify-center space-x-2 py-3 px-3 rounded-xl border text-xs sm:text-sm font-bold transition ${
                      isSelected
                        ? 'bg-bit-maroon text-white border-bit-maroon shadow-md ring-2 ring-bit-gold/60'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Universal Fields: Name, Email, Phone */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              1. Universal Contact Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohan Verma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bit-maroon/20 focus:border-bit-maroon text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. rohan@bitmesra.ac.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bit-maroon/20 focus:border-bit-maroon text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone (Country Code + Number) <span className="text-rose-600">*</span>
                </label>
                <div className="flex space-x-1.5">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-24 px-2 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-slate-50 focus:outline-none"
                  >
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+971">🇦🇪 +971</option>
                    <option value="+65">🇸🇬 +65</option>
                    <option value="+61">🇦🇺 +61</option>
                    <option value="+49">🇩🇪 +49</option>
                  </select>
                  <div className="relative flex-1">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="tel"
                      required
                      placeholder="98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bit-maroon/20 focus:border-bit-maroon text-sm font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Verification Section */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              2. Specific Credentials ({guestType})
            </h4>

            {/* A. STUDENT FIELDS */}
            {guestType === 'Student' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-rose-50/40 p-4 rounded-xl border border-rose-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    BIT Roll Number <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BTECH/10189/22"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bit-maroon/20 focus:border-bit-maroon text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bit-maroon/20 focus:border-bit-maroon text-sm font-medium bg-white"
                  >
                    <option>Computer Science & Engineering</option>
                    <option>Electronics & Communication Engg</option>
                    <option>Electrical & Electronics Engg</option>
                    <option>Mechanical Engineering</option>
                    <option>Civil Engineering</option>
                    <option>Chemical Engineering</option>
                    <option>Biotechnology</option>
                    <option>Management Studies (MBA)</option>
                    <option>Architecture & Planning</option>
                    <option>Pharmaceutical Sciences</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Year of Study <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={yearOfStudy}
                    onChange={(e) => setYearOfStudy(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bit-maroon/20 focus:border-bit-maroon text-sm font-medium bg-white"
                  >
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>4th Year</option>
                    <option>Postgraduate / M.Tech / MBA</option>
                    <option>Doctoral / Ph.D Scholar</option>
                  </select>
                </div>
              </div>
            )}

            {/* B. PARENT FIELDS */}
            {guestType === 'Parent' && (
              <div className="space-y-4 bg-amber-50/40 p-4 rounded-xl border border-amber-100">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Visiting Student's Name <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rohan Verma"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bit-maroon/20 focus:border-bit-maroon text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Student's Roll Number <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BTECH/10189/22"
                      value={studentRollNumber}
                      onChange={(e) => setStudentRollNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bit-maroon/20 focus:border-bit-maroon text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Relationship <span className="text-rose-600">*</span>
                    </label>
                    <select
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bit-maroon/20 focus:border-bit-maroon text-sm font-medium bg-white"
                    >
                      <option>Father</option>
                      <option>Mother</option>
                      <option>Parents (Both)</option>
                      <option>Legal Guardian</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Govt ID Type <span className="text-rose-600">*</span>
                    </label>
                    <select
                      value={govtIdType}
                      onChange={(e) => setGovtIdType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bit-maroon/20 focus:border-bit-maroon text-sm font-medium bg-white"
                    >
                      <option>Aadhaar Card</option>
                      <option>Passport</option>
                      <option>Voter ID</option>
                      <option>Driving License</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Govt ID Number <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 1234-5678-9012"
                      value={govtIdNumber}
                      onChange={(e) => setGovtIdNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bit-maroon/20 focus:border-bit-maroon text-sm font-medium"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* C. ALUMNI FIELDS */}
            {guestType === 'Alumni' && (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-blue-50/40 p-4 rounded-xl border border-blue-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Passout Year <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1960"
                    max={new Date().getFullYear()}
                    placeholder="e.g. 2018"
                    value={passoutYear}
                    onChange={(e) => setPassoutYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bit-maroon/20 focus:border-bit-maroon text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Branch / Major <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Computer Science"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bit-maroon/20 focus:border-bit-maroon text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Govt ID Type <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={govtIdType}
                    onChange={(e) => setGovtIdType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bit-maroon/20 focus:border-bit-maroon text-sm font-medium bg-white"
                  >
                    <option>Passport</option>
                    <option>Aadhaar Card</option>
                    <option>Driving License</option>
                    <option>Voter ID</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Govt ID Number <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ID Number"
                    value={govtIdNumber}
                    onChange={(e) => setGovtIdNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bit-maroon/20 focus:border-bit-maroon text-sm font-medium"
                  />
                </div>
              </div>
            )}

            {/* D. OTHER COLLEGE GUEST FIELDS */}
            {guestType === 'Other College Guest' && (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-emerald-50/40 p-4 rounded-xl border border-emerald-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Home College / Univ <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IIT Kharagpur"
                    value={homeCollege}
                    onChange={(e) => setHomeCollege(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bit-maroon/20 focus:border-bit-maroon text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sponsoring Faculty/Dept <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. A. K. Roy (ECE Dept)"
                    value={sponsoringFaculty}
                    onChange={(e) => setSponsoringFaculty(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bit-maroon/20 focus:border-bit-maroon text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Govt ID Type <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={govtIdType}
                    onChange={(e) => setGovtIdType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bit-maroon/20 focus:border-bit-maroon text-sm font-medium bg-white"
                  >
                    <option>Aadhaar Card</option>
                    <option>Passport</option>
                    <option>Institutional Faculty ID</option>
                    <option>Driving License</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Govt ID Number <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ID Number"
                    value={govtIdNumber}
                    onChange={(e) => setGovtIdNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bit-maroon/20 focus:border-bit-maroon text-sm font-medium"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              By submitting, you certify that all identity details are accurate per BIT Mesra hostel and guest house regulations.
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !selectedRoom}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-extrabold text-sm shadow-md transition flex items-center justify-center space-x-2 ${
                !selectedRoom
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : isSubmitting
                  ? 'bg-gradient-to-r from-[#FF9A00]/70 to-[#EE6200]/70 text-white cursor-wait'
                  : 'bg-gradient-to-r from-[#FF9A00] to-[#EE6200] hover:from-[#EE6200] hover:to-[#FF9A00] text-white shadow-lg'
              }`}
            >
              <span>
                {isSubmitting
                  ? (t.portalName?.includes('बीआईटी') ? 'अनुमोदन भेजा जा रहा है...' : 'Submitting for Approval...')
                  : (t.portalName?.includes('बीआईटी') ? 'कुलसचिव अनुमोदन हेतु भेजें' : 'Submit Request for Registrar Approval')}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
