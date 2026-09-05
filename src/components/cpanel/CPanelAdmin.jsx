import React from 'react';
import { Trophy, Award, TrendingUp, ShoppingBag, Users } from 'lucide-react';

export default function CPanelAdmin({ employeeKpiList }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-bold text-white tracking-tight">
          C-Panel Admin: Analisis & KPI Karyawan
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Pantau statistik kinerja penjualan tim berdasarkan total akun terjual dan omset yang dicapai.
        </p>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Leaderboard & Performa Tim</span>
          </div>
          <span className="text-[11px] text-slate-400">
            {employeeKpiList.length} Anggota Tim Terdaftar
          </span>
        </div>

        <div className="space-y-3">
          {employeeKpiList.length === 0 ? (
            <p className="text-xs text-slate-500 italic text-center py-8">
              Belum ada data penjualan karyawan tercatat di database.
            </p>
          ) : (
            employeeKpiList.map((kpi, index) => {
              const rankColor = 
                index === 0 ? 'text-amber-400 bg-amber-400/10 border-amber-400/20' :
                index === 1 ? 'text-slate-300 bg-slate-300/10 border-slate-300/20' :
                index === 2 ? 'text-amber-600 bg-amber-600/10 border-amber-600/20' :
                'text-slate-500 bg-slate-800/40 border-slate-700/30';

              return (
                <div 
                  key={index} 
                  className="bg-slate-950 p-4 rounded-xl border border-slate-800/90 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-6 h-6 rounded-lg border flex items-center justify-center text-[11px] font-bold ${rankColor}`}>
                        {index + 1}
                      </span>
                      <span className="font-semibold text-white">{kpi.name}</span>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div className="text-slate-300">
                        <span className="text-blue-400 font-semibold">{kpi.count}</span> Terjual
                      </div>
                      <div className="text-emerald-400 font-semibold">
                        Rp {kpi.revenue.toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>

                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800/60">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all duration-700 ease-out" 
                      style={{ width: `${Math.max(kpi.percentage, 4)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
