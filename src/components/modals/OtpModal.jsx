import React from 'react';
import { X, Mail, RefreshCw, Clock } from 'lucide-react';

export default function OtpModal({
  selectedAccount,
  inbox,
  loadingInbox,
  onRefreshInbox,
  onClose
}) {
  if (!selectedAccount) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 max-w-lg w-full p-6 rounded-2xl shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-400" />
            <div>
              <h3 className="text-sm font-bold text-white">
                Kotak Masuk OTP Email (#{selectedAccount.displayId})
              </h3>
              <p className="text-[11px] font-mono text-slate-400 mt-0.5">{selectedAccount.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Inbox Content */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 max-h-72 overflow-y-auto space-y-2.5">
          {loadingInbox ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400 space-y-2">
              <RefreshCw className="w-5 h-5 animate-spin text-blue-400" />
              <p className="text-xs">Memeriksa pesan masuk server email...</p>
            </div>
          ) : inbox.length === 0 ? (
            <p className="text-xs text-center text-slate-500 py-8 italic">
              Belum ada pesan email baru atau kode OTP.
            </p>
          ) : (
            inbox.map((mail, idx) => (
              <div key={idx} className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate max-w-[200px] text-slate-300">Dari: {mail.from}</span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-slate-500">
                    <Clock className="w-3 h-3" />
                    {mail.received_at ? new Date(mail.received_at).toLocaleTimeString('id-ID') : '-'}
                  </span>
                </div>
                <div className="text-xs font-semibold text-white">{mail.subject}</div>
                <div className="text-xs text-slate-200 font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 whitespace-pre-wrap select-all">
                  {mail.textBody}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={() => onRefreshInbox(selectedAccount.email)}
            disabled={loadingInbox}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingInbox ? 'animate-spin' : ''}`} />
            <span>Perbarui Kotak Masuk</span>
          </button>
        </div>
      </div>
    </div>
  );
}
