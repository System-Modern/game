import React from 'react';
import { X, Upload, ShoppingCart } from 'lucide-react';

export default function BuyModal({
  assigningAcc,
  gamesList,
  game,
  setGame,
  username,
  setUsername,
  buyPrice,
  setBuyPrice,
  buyEmailPembeli,
  setBuyEmailPembeli,
  setBuyProofFile,
  uploading,
  sessionUser,
  handleSaveAssignGame,
  onClose
}) {
  if (!assigningAcc) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 max-w-md w-full p-6 rounded-2xl shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">
              Data Pembelian Akun (#{assigningAcc.displayId})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSaveAssignGame} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Pilih Game</label>
            <select
              value={game}
              onChange={(e) => setGame(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            >
              {gamesList.map((g, idx) => (
                <option key={idx} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Nickname / Username</label>
            <input
              type="text"
              placeholder="Username akun game..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Harga Modal Beli (Rp)</label>
            <input
              type="number"
              placeholder="50000"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Email Pembeli (Opsional)
            </label>
            <input
              type="email"
              placeholder="email_buyer@domain.com"
              value={buyEmailPembeli}
              onChange={(e) => setBuyEmailPembeli(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Bukti Pembelian (Opsional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setBuyProofFile(e.target.files[0])}
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
              className="w-1/2 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-600/20 transition-all disabled:opacity-50"
            >
              {uploading ? 'Mengunggah...' : `Simpan (${sessionUser.nama})`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
