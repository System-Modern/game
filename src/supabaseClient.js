import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Game Vault Warning] Supabase URL atau Anon Key belum dikonfigurasi di file .env! Silakan salin .env.example menjadi .env dan isi dengan kredensial Supabase Anda.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);