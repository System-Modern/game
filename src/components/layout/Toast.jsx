import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ notification, onClose }) {
  if (!notification) return null;

  const config = {
    success: {
      border: 'border-emerald-500/40',
      bg: 'bg-slate-900/95',
      text: 'text-emerald-300',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
    },
    error: {
      border: 'border-rose-500/40',
      bg: 'bg-slate-900/95',
      text: 'text-rose-300',
      icon: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
    },
    info: {
      border: 'border-blue-500/40',
      bg: 'bg-slate-900/95',
      text: 'text-blue-300',
      icon: <Info className="w-4 h-4 text-blue-400 shrink-0" />
    }
  };

  const style = config[notification.type] || config.success;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md animate-in fade-in slide-in-from-top-3 duration-200">
      <div className={`p-3.5 rounded-xl border ${style.border} ${style.bg} shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 text-xs`}>
        <div className="flex items-center gap-2.5">
          {style.icon}
          <span className={`font-medium ${style.text}`}>{notification.message}</span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
          aria-label="Tutup notifikasi"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
