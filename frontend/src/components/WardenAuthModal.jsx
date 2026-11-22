import React, { useState } from 'react';
import {
  X,
  Shield,
  Lock,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Building
} from 'lucide-react';
import bitLogo from '../assets/bit_mesra_logo.png';

export default function WardenAuthModal({
  isOpen,
  onClose,
  onAuthorized,
  t,
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    // Verification check: Accepts registrar@bitmesra.ac.in, warden@bitmesra.ac.in or admin credentials
    if (
      (cleanEmail.includes('registrar') || cleanEmail.includes('warden') || cleanEmail.includes('admin') || cleanEmail.includes('bitmesra.ac.in')) &&
      (cleanPass === 'registrar123' || cleanPass === 'warden123' || cleanPass === 'admin123' || cleanPass === 'bitmesra')
    ) {
      localStorage.setItem('bit_warden_auth', JSON.stringify({ email: cleanEmail, role: 'Registrar' }));
      onAuthorized();
      onClose();
    } else {
      setError('Invalid Registrar Credentials. Use registrar@bitmesra.ac.in and password "registrar123" or click the demo button below.');
    }
  };

  const handleDemoLogin = () => {
    setEmail('registrar@bitmesra.ac.in');
    setPassword('registrar123');
    localStorage.setItem('bit_warden_auth', JSON.stringify({ email: 'registrar@bitmesra.ac.in', role: 'Registrar' }));
    onAuthorized();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border-2 border-amber-400">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b-2 border-amber-400">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-full bg-white p-0.5 flex items-center justify-center shadow-lg border-2 border-amber-400 flex-shrink-0">
              <img
                src={bitLogo}
                alt="BIT Mesra Crest"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="p-0.5 rounded bg-amber-500 text-slate-950 font-bold">
                  <Shield className="w-3.5 h-3.5" />
                </span>
                <h3 className="text-sm sm:text-base font-black text-white">
                  {t.wardenLoginTitle || 'Authorized Personnel Login'}
                </h3>
              </div>
              <p className="text-[10px] sm:text-[11px] text-amber-300">
                Registrar Office • BIT Mesra Guest House Administration
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

        {/* Form Body */}
        <div className="p-6 space-y-4">
          <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-xl text-xs text-amber-900">
            <strong>Restricted Access:</strong> Only authorized Registrars and Hospitality administrative officers are permitted to review identity credentials and approve reservations.
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Official Registrar Email <span className="text-rose-600">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="registrar@bitmesra.ac.in"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Security Password / PIN <span className="text-rose-600">*</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center justify-center space-x-2 border border-amber-400/50"
            >
              <Lock className="w-4 h-4" />
              <span>Verify & Access Registrar Dashboard</span>
            </button>
          </form>

          {/* Quick Demo Fill Button */}
          <div className="pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1.5"
            >
              <span>⚡ One-Click Demo Registrar Login</span>
              <span className="text-[10px] text-amber-800 font-normal">(registrar@bitmesra.ac.in)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
