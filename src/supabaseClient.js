import { createClient } from '@supabase/supabase-js';

// Baca dari environment variable, atau gunakan fallback default project agar tidak crash
const defaultUrl = 'https://msthucqijrjmmntsdscm.supabase.co';
const defaultKey = 'sb_publishable_-mgfP8xp-YlJDNmHtmonZw_nN0CR8gz';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || defaultUrl;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || defaultKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);