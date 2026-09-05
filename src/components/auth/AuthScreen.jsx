import React from 'react';
import { ShieldCheck, UserCheck, Key, Lock, Mail, User, ArrowLeft, LogIn } from 'lucide-react';

export default function AuthScreen({
  authMode,
  setAuthMode,
  loginRoleTarget,
  setLoginRoleTarget,
  inputEmail,
  setInputEmail,
  inputPassword,
  setInputPassword,
  inputNama,
  setInputNama,
  inputRole,
  setInputRole,
  adminSecretKey,
  setAdminSecretKey,
  forgotRoleTarget,
  setForgotRoleTarget,
  newPassword,
  setNewPassword,
  pageLoading,
  handleLogin,
  handleRegister,
  handleForgotPassword
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
        
        {/* Logo & Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Game Vault Portal</h1>
          <p className="text-xs text-slate-400 mt-1">Sistem Manajemen & Transaksi Akun Game</p>
        </div>

        {/* Mode: LOGIN */}
        {authMode === 'login' && (
          <div>
            {/* Role Switcher */}
            <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 mb-5">
              <button
                type="button"
                onClick={() => setLoginRoleTarget('pembeli_akun')}
                className={`py-2 text-xs font-medium rounded-lg transition-all ${
                  loginRoleTarget === 'pembeli_akun'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Pembeli
              </button>
              <button
                type="button"
                onClick={() => setLoginRoleTarget('penjual_akun')}
                className={`py-2 text-xs font-medium rounded-lg transition-all ${
                  loginRoleTarget === 'penjual_akun'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Penjual
              </button>
              <button
                type="button"
                onClick={() => setLoginRoleTarget('admin')}
                className={`py-2 text-xs font-medium rounded-lg transition-all ${
                  loginRoleTarget === 'admin'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Admin
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Email Akun ({loginRoleTarget.replace('_', ' ').toUpperCase()})
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={inputPassword}
                    onChange={(e) => setInputPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={pageLoading}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50"
              >
                <LogIn className="w-4 h-4" />
                <span>{pageLoading ? 'Memproses...' : `Masuk sebagai ${loginRoleTarget.replace('_', ' ')}`}</span>
              </button>

              <div className="flex items-center justify-between text-xs pt-2 text-slate-400">
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Daftar Akun Baru
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('forgot')}
                  className="hover:text-slate-200 transition-colors"
                >
                  Lupa Password?
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Mode: REGISTER */}
        {authMode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="text-center pb-2">
              <h2 className="text-sm font-semibold text-white">Buat Akun Baru</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Isi data di bawah untuk mendaftar ke portal</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Nama Lengkap</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  value={inputNama}
                  onChange={(e) => setInputNama(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Kata Sandi</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="Minimal 6 karakter"
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Hak Akses (Role)</label>
              <select
                value={inputRole}
                onChange={(e) => {
                  setInputRole(e.target.value);
                  setAdminSecretKey('');
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              >
                <option value="pembeli_akun">Pembeli Akun (C-Panel Buy)</option>
                <option value="penjual_akun">Penjual Akun (C-Panel Sold)</option>
                <option value="admin">Admin (Akses Penuh)</option>
              </select>
            </div>

            {inputRole === 'admin' && (
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <label className="block text-xs font-medium text-blue-400">Kode Rahasia Admin</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="Masukkan kunci keamanan admin"
                    value={adminSecretKey}
                    onChange={(e) => setAdminSecretKey(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all mt-2"
            >
              Daftar Sekarang
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Halaman Login</span>
              </button>
            </div>
          </form>
        )}

        {/* Mode: FORGOT PASSWORD */}
        {authMode === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="text-center pb-2">
              <h2 className="text-sm font-semibold text-white">Reset Kata Sandi</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Pilih role dan masukkan email untuk mengubah sandi</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Pilih Role Akun</label>
              <select
                value={forgotRoleTarget}
                onChange={(e) => setForgotRoleTarget(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              >
                <option value="pembeli_akun">Pembeli Akun</option>
                <option value="penjual_akun">Penjual Akun</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Terdaftar</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Kata Sandi Baru</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="Minimal 6 karakter"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition-colors mt-2"
            >
              Simpan Password Baru
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Halaman Login</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
