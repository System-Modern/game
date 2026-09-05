# Game Vault Management Portal

Aplikasi manajemen dan transaksi akun game berbasis **React + Vite + Tailwind CSS** dan **Supabase**.

---

## 🚀 Fitur Utama

- **Role-Based Access Control**: Pembeli Akun (`pembeli_akun`), Penjual Akun (`penjual_akun`), dan Admin (`admin`).
- **C-Panel Buy**: Generator akun massal otomatis & input manual stok akun.
- **C-Panel Sold**: Sistem On-Book (locking saat transaksi), pencatatan omset, dan upload bukti transfer.
- **C-Panel Admin**: Leaderboard KPI performa anggota tim dan ekspor laporan penjualan ke CSV.
- **Edge Function OTP Checker**: Pengecekan otomatis inbox / kode OTP email masuk & notifikasi lonceng suara.

---

## 🛠️ Panduan Instalasi & Menjalankan Aplikasi

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/username/game-management.git
cd game-management
npm install
```

### 2. Konfigurasi Environment Variable (`.env`)
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Lalu isi kredensial Supabase Anda di dalam `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```
> **Keamanan**: File `.env` sudah masuk dalam `.gitignore` sehingga URL dan Anon Key Supabase Anda aman dan tidak akan ter-upload ke GitHub.

---

## 🗄️ Inisialisasi Database Supabase (1 File All-in-One)

Seluruh struktur database (Tabel, Index, Storage Bucket `account-proofs`, dan RLS Policy) telah disatukan ke dalam satu file:

👉 **[`supabase/schema.sql`](./supabase/schema.sql)**

### Langkah Eksekusi:
1. Buka [Supabase Dashboard](https://supabase.com/dashboard).
2. Masuk ke menu **SQL Editor** -> **New query**.
3. Buka file `supabase/schema.sql`, salin seluruh kodenya, dan paste ke SQL Editor.
4. Klik tombol **Run**.

---

## ⚡ Deploy Edge Function (Inbox OTP)

Untuk mengaktifkan fungsi pembacaan inbox email:
```bash
supabase functions deploy fetch-inbox
```

---

## 💻 Menjalankan Server Lokal

```bash
# Menjalankan local development server
npm run dev

# Build untuk production
npm run build
```
