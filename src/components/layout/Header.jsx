import React from 'react';
import { 
  Bell, 
  RefreshCw, 
  LogOut, 
  Layers, 
  ShoppingBag, 
  CheckCircle, 
  BarChart3, 
  User, 
  Mail, 
  Check
} from 'lucide-react';

export default function Header({
  sessionUser,
  activeTab,
  onTabChange,
  loadingAccounts,
  onRefresh,
  showNotificationDropdown,
  setShowNotificationDropdown,
  notificationList,
  setNotificationList,
  unreadNotifCount,
  setUnreadNotifCount,
  onSelectNotificationAccount,
  onLogout,
  buyCount,
  soldCount,
  notifDropdownRef
}) {
  const roleLabels = {
    admin: 'Administrator',
    pembeli_akun: 'Pembeli Akun',
    penjual_akun: 'Penjual Akun'
  };

  return (
    <>
      {/* Top Connection Bar */}
      <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-2.5 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-medium text-slate-300">
            Database Server Connected
          </span>
        </div>

        <button 
          onClick={onRefresh} 
          disabled={loadingAccounts}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${loadingAccounts ? 'animate-spin' : ''}`} />
          <span>{loadingAccounts ? 'Memperbarui...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Main Header Box */}
      <header className="mb-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-white tracking-tight">
                    Game Vault Management
                  </h1>
                  <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                    {roleLabels[sessionUser.role] || sessionUser.role}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Masuk sebagai <strong className="text-slate-200">{sessionUser.nama}</strong> ({sessionUser.email})
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-center">
            {/* Notification Bell */}
            <div className="relative" ref={notifDropdownRef}>
              <button 
                onClick={() => {
                  setShowNotificationDropdown(!showNotificationDropdown);
                  if (!showNotificationDropdown) {
                    setUnreadNotifCount(0);
                  }
                }} 
                className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                title="Pemberitahuan Email Masuk"
                aria-label="Pemberitahuan"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              {showNotificationDropdown && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-3.5 bg-slate-950/80 border-b border-slate-800 flex justify-between items-center">
                    <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-blue-400" />
                      Notifikasi Email Masuk
                    </span>
                    {notificationList.length > 0 && (
                      <button 
                        onClick={() => setNotificationList([])} 
                        className="text-[11px] text-slate-400 hover:text-white"
                      >
                        Bersihkan
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                    {notificationList.length === 0 ? (
                      <p className="text-xs text-center text-slate-500 py-8 italic">
                        Belum ada pemberitahuan email baru.
                      </p>
                    ) : (
                      notificationList.map((item) => (
                        <div 
                          key={item.id} 
                          onClick={() => onSelectNotificationAccount(item)}
                          className="p-3 hover:bg-slate-800/60 transition-colors cursor-pointer group"
                        >
                          <div className="text-xs font-medium text-slate-200 group-hover:text-blue-400">
                            {item.message}
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                            <span>{item.email}</span>
                            <span>{item.time}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <button 
              onClick={onLogout} 
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-medium transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex flex-wrap gap-2 mt-4 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800/80 w-fit">
          {(sessionUser.role === 'admin' || sessionUser.role === 'pembeli_akun') && (
            <button 
              onClick={() => onTabChange('buy')} 
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'buy' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>C-Panel Buy</span>
              <span className="ml-1 px-1.5 py-0.5 rounded bg-black/25 text-[10px]">
                {buyCount}
              </span>
            </button>
          )}

          {(sessionUser.role === 'admin' || sessionUser.role === 'penjual_akun') && (
            <button 
              onClick={() => onTabChange('sold')} 
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'sold' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>C-Panel Sold</span>
              <span className="ml-1 px-1.5 py-0.5 rounded bg-black/25 text-[10px]">
                {soldCount}
              </span>
            </button>
          )}

          {sessionUser.role === 'admin' && (
            <button 
              onClick={() => onTabChange('admin')} 
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'admin' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>C-Panel Admin (KPI & Laporan)</span>
            </button>
          )}
        </nav>
      </header>
    </>
  );
}
