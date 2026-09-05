import React from 'react';
import { X, CheckCircle, Upload } from 'lucide-react';

export default function SellModal({
  editingAcc,
  sellPrice,
  setSellPrice,
  sellBuyerEmail,
  setSellBuyerEmail,
  setSellProofFile,
  uploading,
  sessionUser,
  handleSaveSellDetails,
  onClose
}) {
  if (!editingAcc) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 max-w-md w-full p-6 rounded-2xl shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              Input Penjualan (Sold) (#{editingAcc.displayId})
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
            {editingAcc.game} (@{editingAcc.username})
          </div>
          <div className="text-[11px] text-slate-500">
            Diproses oleh Buyer: <span className="text-slate-400">{editingAcc.bought_by || 'Admin'}</span>
          </div>
        </div>

        <form onSubmit={handleSaveSellDetails} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Harga Jual / Omset (Rp)
            </label>
            <input
              type="number"
              placeholder="150000"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Email Pembeli (Buyer Email)
            </label>
            <input
              type="email"
              placeholder="email_customer@domain.com"
              value={sellBuyerEmail}
              onChange={(e) => setSellBuyerEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Upload Bukti Transfer (Opsional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSellProofFile(e.target.files[0])}
              className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
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
              disabled={uploading}
              className="w-1/2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
            >
              {uploading ? 'Mengunggah...' : `Konfirmasi Sold (${sessionUser.nama})`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
