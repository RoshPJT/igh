import React from 'react';
import {
  Bell,
  Mail,
  Smartphone,
  CheckCircle2,
  X,
  ShieldCheck,
  CreditCard
} from 'lucide-react';

export default function NotificationCenter({
  notifications = [],
  onDismissNotification,
  isOpen,
  onClose,
}) {
  return (
    <>
      {/* Floating Toast Stack in Bottom-Left */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col space-y-3 pointer-events-none max-w-sm w-full">
        {notifications.slice(0, 3).map((notif) => (
          <div
            key={notif.id}
            className={`pointer-events-auto rounded-2xl shadow-2xl p-4 border flex items-start space-x-3 transition transform animate-in slide-in-from-bottom-5 duration-300 ${
              notif.type === 'sms'
                ? 'bg-slate-900 text-white border-amber-400'
                : 'bg-white text-slate-900 border-emerald-400'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                notif.type === 'sms'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {notif.type === 'sms' ? (
                <Smartphone className="w-5 h-5" />
              ) : (
                <Mail className="w-5 h-5" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                  {notif.title}
                </span>
                <span className="text-[10px] opacity-70">
                  {notif.timestamp || 'Just now'}
                </span>
              </div>
              <p className="text-xs font-medium mt-0.5 leading-snug">
                {notif.message}
              </p>
              {notif.destination && (
                <div className="text-[10px] opacity-80 mt-1 font-mono">
                  Sent to: {notif.destination}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => onDismissNotification(notif.id)}
              className="text-slate-400 hover:text-white flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Full Notification History Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b-2 border-bit-gold">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-bit-gold" />
                <h4 className="font-bold text-sm">Dispatched SMS & Email Alerts</h4>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3 text-xs">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  No notifications recorded yet.
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span className="flex items-center space-x-1.5">
                        {n.type === 'sms' ? (
                          <Smartphone className="w-3.5 h-3.5 text-amber-600" />
                        ) : (
                          <Mail className="w-3.5 h-3.5 text-blue-600" />
                        )}
                        <span>{n.title}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {n.timestamp}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px]">{n.message}</p>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Target: {n.destination}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
