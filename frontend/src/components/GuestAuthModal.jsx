import React, { useState } from 'react';
import {
  X,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  Globe,
  User,
  GraduationCap
} from 'lucide-react';

const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'USA / Canada', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+971', country: 'United Arab Emirates', flag: '🇦🇪' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
];

export default function GuestAuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  t,
}) {
  const [step, setStep] = useState('phone'); // 'phone', 'otp'
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [guestType, setGuestType] = useState('Student');
  const [rollNumber, setRollNumber] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [error, setError] = useState('');
  const [otpToast, setOtpToast] = useState(null);

  if (!isOpen) return null;

  const handleSendOtp = (e) => {
    e.preventDefault();
    setError('');

    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 7) {
      setError('Please enter a valid mobile number.');
      return;
    }

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    // Generate random 6-digit OTP
    const mockOtp = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(mockOtp);
    setStep('otp');

    // Show simulated SMS alert banner
    setOtpToast(`📱 SMS to ${countryCode} ${cleanPhone}: Your BIT Mesra Guest House OTP is ${mockOtp}`);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setError('');

    if (otpInput.trim() !== generatedOtp && otpInput.trim() !== '123456') {
      setError('Invalid OTP. Please check the code or click auto-fill.');
      return;
    }

    // Success -> Construct user profile
    const userProfile = {
      phone: `${countryCode} ${phone.trim()}`,
      countryCode,
      rawPhone: phone.trim(),
      name: name.trim(),
      guestType,
      rollNumber: guestType === 'Student' ? rollNumber.trim() : '',
      loggedInAt: new Date().toISOString(),
    };

    localStorage.setItem('bit_guest_user', JSON.stringify(userProfile));
    if (onLoginSuccess) {
      onLoginSuccess(userProfile);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#081B33] via-[#0E2E5C] to-[#143B70] text-white p-5 flex items-center justify-between border-b-2 border-bit-gold">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
              <Phone className="w-5 h-5 text-bit-gold" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {t.otpLoginTitle || 'Guest Mobile Login (OTP)'}
              </h3>
              <p className="text-[11px] text-blue-200">
                BIT Mesra Guest House Secure Access
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Simulated SMS Toast */}
        {otpToast && (
          <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-between animate-pulse">
            <span>{otpToast}</span>
            <button
              type="button"
              onClick={() => setOtpInput(generatedOtp)}
              className="underline ml-2 uppercase text-[10px]"
            >
              Copy
            </button>
          </div>
        )}

        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-3.5">
              <p className="text-xs text-slate-600">
                Enter your mobile number and details to login, save reservations, and receive SMS & Email stay confirmations.
              </p>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rohan Verma"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bit-maroon/20 text-sm font-medium"
                  />
                </div>
              </div>

              {/* Phone + Country Code */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mobile Number (Domestic / International) <span className="text-rose-600">*</span>
                </label>
                <div className="flex space-x-2">
                  {/* Country Code Dropdown */}
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-28 px-2 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-bit-maroon/20"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>

                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 98765 43210"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bit-maroon/20 text-sm font-medium"
                  />
                </div>
              </div>

              {/* Guest Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Guest Category
                </label>
                <select
                  value={guestType}
                  onChange={(e) => setGuestType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none"
                >
                  <option value="Student">🎓 Student (BIT Mesra)</option>
                  <option value="Parent">👨‍👩‍👧 Parent / Visiting Family</option>
                  <option value="Alumni">🎓 Alumni</option>
                  <option value="Other College Guest">🏫 Other College / University Guest</option>
                </select>
              </div>

              {/* Roll Number if Student */}
              {guestType === 'Student' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    BIT Student Roll Number
                  </label>
                  <input
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder="e.g. BTECH/10045/22"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm uppercase font-mono"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-[#FF9A00] to-[#EE6200] hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition"
              >
                {t.getOtpBtn || 'Send 6-Digit OTP via SMS'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center py-2">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2 border border-emerald-200">
                  <Lock className="w-6 h-6" />
                </div>
                <p className="text-xs text-slate-600">
                  OTP sent to registered mobile <strong className="text-slate-900">{countryCode} {phone}</strong>
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 text-center">
                  Enter 6-Digit OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="• • • • • •"
                  className="w-full py-3 text-center text-2xl font-mono font-black tracking-widest rounded-xl border-2 border-slate-300 focus:border-bit-maroon focus:outline-none"
                />
              </div>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setOtpInput(generatedOtp || '123456')}
                  className="flex-1 py-1.5 px-3 bg-amber-50 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold hover:bg-amber-100 transition"
                >
                  ⚡ Auto-fill OTP ({generatedOtp || '123456'})
                </button>
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200"
                >
                  Edit Number
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition"
              >
                Verify & Login to Portal
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
