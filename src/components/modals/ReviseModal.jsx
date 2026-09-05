import React from 'react';
import { X, Edit3 } from 'lucide-react';

export default function ReviseModal({
  revisingAcc,
  reviseSellPrice,
  setReviseSellPrice,
  reviseBuyerEmail,
  setReviseBuyerEmail,
  handleSaveRevisedSoldDetails,
  onClose
}) {
  if (!revisingAcc) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 max-w-md w-full p-6 rounded-2xl shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">
              Edit Data Penjualan (#{revisingAcc.displayId})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1 text-xs">
          <div className="text-slate-300 font-medium">
            {revisingAcc.game} (@{revisingAcc.username})
          </div>
          <div className="text-[11px] text-slate-500">
            Penjual Terdaftar: <span className="text-slate-400">{revisingAcc.sold_by || '-'}</span>
          </div>
        </div>

        <form onSubmit={handleSaveRevisedSoldDetails} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Koreksi Harga Jual (Rp)
            </label>
            <input
              type="number"
              placeholder="Masukkan harga baru..."
              value={reviseSellPrice}
              onChange={(e) => setReviseSellPrice(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Koreksi Email Pembeli
            </label>
            <input
              type="email"
              placeholder="email_pembeli_baru@domain.com"
              value={reviseBuyerEmail}
              onChange={(e) => setReviseBuyerEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl border border-slate-700 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="w-1/2 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-600/20 transition-all"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
