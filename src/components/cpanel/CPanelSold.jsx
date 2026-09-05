import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Download, 
  Search, 
  Lock, 
  Unlock, 
  CheckCircle, 
  Edit3, 
  ShoppingBag
} from 'lucide-react';

export default function CPanelSold({
  sessionUser,
  readyStock,
  soldStock,
  financialSummary,
  filterReadyId,
  setFilterReadyId,
  filterSoldId,
  setFilterSoldId,
  handleToggleOnBookSold,
  onOpenSellModal,
  onOpenReviseModal,
  onCheckOtp,
  onDownloadCSV,
  showToast
}) {
  const readyForSaleList = readyStock.filter(a => a.game && a.game !== 'Belum Diisi');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            C-Panel Sold: Manajemen Penjualan
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Book akun sebelum transaksi dan input omset penjualan ke database bersama.
          </p>
        </div>

        <button
          onClick={onDownloadCSV}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span>Export Laporan CSV</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Total Akun Terjual</span>
            <div className="text-2xl font-bold text-white mt-1">
              {financialSummary.totalTerjual}
              <span className="text-xs font-normal text-slate-400 ml-1.5">Akun</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Total Omset Penjualan</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">
              Rp {financialSummary.totalOmset.toLocaleString('id-ID')}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 1. Akun Siap Dijual */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
          <div>
            <h3 className="text-xs font-semibold text-white">Akun Siap Dijual ({readyForSaleList.length})</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Kunci akun (On Book) saat transaksi berlangsung</p>
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari No Urut..."
              value={filterReadyId}
              onChange={(e) => setFilterReadyId(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-medium">
                <th className="py-3 px-4 w-16">No</th>
                <th className="py-3 px-4">Game & User</th>
                <th className="py-3 px-4">Email / Info Buyer</th>
                <th className="py-3 px-4">Status Book</th>
                <th className="py-3 px-4 text-right">Aksi Penjualan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {readyForSaleList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-xs text-slate-500 italic">
                    Tidak ada akun yang siap dijual.
                  </td>
                </tr>
              ) : (
                readyForSaleList.map((acc) => {
                  const isOnBook = acc.status === 'ON_BOOK';
                  const isLockedByOther = isOnBook && acc.locked_by && acc.locked_by !== sessionUser.nama && sessionUser.role !== 'admin';

                  return (
                    <tr key={acc.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-400">
                        #{acc.displayId}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-200">{acc.game}</div>
                        <div className="text-[11px] text-slate-400">
                          @{acc.username} • Modal: Rp {Number(acc.buy_price || 0).toLocaleString('id-ID')}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-mono text-slate-300 text-[11px]">{acc.email}</div>
                        <div className="text-[10px] text-slate-400">Buyer: {acc.bought_by || 'Admin'}</div>
                        {acc.buyer_email && acc.buyer_email !== '-' && (
                          <div className="text-[10px] font-mono text-slate-500">
                            Email Buyer: {acc.buyer_email}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {isOnBook ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            <Lock className="w-3 h-3" />
                            <span>Book: {acc.locked_by}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Available
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleToggleOnBookSold(acc)}
                            disabled={isLockedByOther}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors inline-flex items-center gap-1 ${
                              isOnBook 
                                ? 'bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40' 
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                            } ${isLockedByOther ? 'opacity-40 cursor-not-allowed' : ''}`}
                          >
                            {isOnBook ? 'Lepas Book' : 'On Book'}
                          </button>

                          <button 
                            onClick={() => onCheckOtp(acc)} 
                            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                          >
                            Cek OTP
                          </button>

                          <button 
                            onClick={() => {
                              if (isLockedByOther) {
                                showToast(`Akun ini sedang di-book oleh ${acc.locked_by}!`, 'error');
                                return;
                              }
                              onOpenSellModal(acc);
                            }} 
                            disabled={isLockedByOther}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors ${
                              isLockedByOther ? 'opacity-40 cursor-not-allowed' : ''
                            }`}
                          >
                            Sold
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Riwayat Akun Terjual */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
          <div>
            <h3 className="text-xs font-semibold text-white">Riwayat Akun Terjual ({soldStock.length})</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Daftar transaksi akun yang telah berhasil dicatat terjual</p>
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari No Urut..."
              value={filterSoldId}
              onChange={(e) => setFilterSoldId(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-medium">
                <th className="py-3 px-4 w-16">No</th>
                <th className="py-3 px-4">Game & User</th>
                <th className="py-3 px-4">Email / Info Buyer</th>
                <th className="py-3 px-4">Omset & Seller</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {soldStock.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-xs text-slate-500 italic">
                    Belum ada riwayat penjualan akun.
                  </td>
                </tr>
              ) : (
                soldStock.map((acc) => {
                  const isOwner = acc.sold_by === sessionUser.nama || acc.bought_by === sessionUser.nama;
                  const isAdmin = sessionUser.role === 'admin';
                  const canEdit = isOwner || isAdmin;

                  return (
                    <tr key={acc.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-400">
                        #{acc.displayId}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-200">{acc.game}</div>
                        <div className="text-[11px] text-slate-400">@{acc.username}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-mono text-slate-300 text-[11px]">{acc.email}</div>
                        <div className="text-[10px] text-slate-400">Buyer: {acc.bought_by || '-'}</div>
                        {acc.buyer_email && acc.buyer_email !== '-' && (
                          <div className="text-[10px] font-mono text-slate-500">
                            Email Buyer: {acc.buyer_email}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-emerald-400 font-semibold">
                          Rp {Number(acc.sell_price || 0).toLocaleString('id-ID')}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Seller: <span className="text-slate-300">{acc.sold_by || '-'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {canEdit ? (
                          <button
                            onClick={() => onOpenReviseModal(acc)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors"
                          >
                            <Edit3 className="w-3 h-3 text-blue-400" />
                            <span>Edit Penjualan</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-500 italic px-2 py-1 bg-slate-950 rounded border border-slate-800/80">
                            Bukan Hak Akses
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
