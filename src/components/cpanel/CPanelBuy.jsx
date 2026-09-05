import React from 'react';
import { 
  Sparkles, 
  PlusCircle, 
  KeyRound, 
  Mail, 
  ShieldAlert, 
  Gamepad2, 
  Search,
  ExternalLink
} from 'lucide-react';

export default function CPanelBuy({
  sessionUser,
  readyStock,
  gamesList,
  generateCount,
  setGenerateCount,
  prefixEmail,
  setPrefixEmail,
  defaultPassword,
  setDefaultPassword,
  isGenerating,
  handleGenerateAccounts,
  manualEmail,
  setManualEmail,
  manualPassword,
  setManualPassword,
  handleSaveManualEmail,
  onOpenAssignModal,
  onCheckOtp,
  showToast
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-bold text-white tracking-tight">
          C-Panel Buy: Input & Generate Stok Akun
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Gunakan generator otomatis atau input manual untuk memasukkan stok ke database bersama.
        </p>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Generator Akun Massal */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
            <Sparkles className="w-4 h-4" />
            <span>Generator Akun Otomatis (Batch)</span>
          </div>

          <form onSubmit={handleGenerateAccounts} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Jumlah Akun
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={generateCount}
                  onChange={(e) => setGenerateCount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Prefix Email
                </label>
                <input
                  type="text"
                  value={prefixEmail}
                  onChange={(e) => setPrefixEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Password Default
                </label>
                <input
                  type="text"
                  value={defaultPassword}
                  onChange={(e) => setDefaultPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-600/20 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Sedang Memproses...' : `Generate ${generateCount} Akun`}</span>
            </button>
          </form>
        </div>

        {/* Input Manual Stok */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <PlusCircle className="w-4 h-4" />
            <span>Input Manual Stok Akun</span>
          </div>

          <form onSubmit={handleSaveManualEmail} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Email Akun
                </label>
                <input
                  type="text"
                  placeholder="email@domain.com"
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Password Akun
                </label>
                <input
                  type="text"
                  placeholder="Password akun"
                  value={manualPassword}
                  onChange={(e) => setManualPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Simpan Stok Akun</span>
            </button>
          </form>
        </div>
      </div>

      {/* Tabel Stok Tersedia */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 sm:px-6 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="text-xs font-semibold text-white">Daftar Stok Siap Di-Buy ({readyStock.length})</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Akun yang dapat di-take dan dilengkapi detail permainannya</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-medium">
                <th className="py-3 px-4 w-16">No</th>
                <th className="py-3 px-4">Kredensial Akun</th>
                <th className="py-3 px-4">Detail Game & Pembeli</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {readyStock.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-xs text-slate-500 italic">
                    Belum ada stok akun yang tersedia.
                  </td>
                </tr>
              ) : (
                readyStock.map((acc) => {
                  const isUntaken = acc.game === 'Belum Diisi' || !acc.game;
                  const isTakenByOther = acc.bought_by && acc.bought_by !== sessionUser.nama && sessionUser.role !== 'admin';

                  return (
                    <tr key={acc.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-400">
                        #{acc.displayId}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-mono text-blue-400 font-medium">{acc.email}</div>
                        <div className="font-mono text-slate-400 text-[11px] mt-0.5">{acc.password}</div>
                      </td>
                      <td className="py-3 px-4">
                        {isUntaken ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Belum di-Take (Stok Mentah)
                          </span>
                        ) : (
                          <div className="space-y-0.5">
                            <div className="font-medium text-slate-200">{acc.game}</div>
                            <div className="text-[11px] text-slate-400">
                              @{acc.username} • Pembeli: <span className="text-slate-300">{acc.bought_by || 'Admin'}</span> • Modal: Rp {Number(acc.buy_price || 0).toLocaleString('id-ID')}
                            </div>
                            {acc.buyer_email && acc.buyer_email !== '-' && (
                              <div className="text-[10px] font-mono text-slate-400">
                                Email Buyer: {acc.buyer_email}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => {
                              if (isTakenByOther) {
                                showToast(`Akun ini sudah di-take oleh ${acc.bought_by}!`, 'error');
                                return;
                              }
                              onOpenAssignModal(acc);
                            }}
                            disabled={isTakenByOther}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              isUntaken
                                ? 'bg-blue-600/15 hover:bg-blue-600/25 text-blue-300 border border-blue-500/30'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                            } ${isTakenByOther ? 'opacity-40 cursor-not-allowed' : ''}`}
                          >
                            {isUntaken ? 'Take Akun' : 'Edit Buy'}
                          </button>

                          <button
                            onClick={() => onCheckOtp(acc)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                          >
                            Cek OTP
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
    </div>
  );
}
