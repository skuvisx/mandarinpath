import { createClient, SupabaseClient } from '@supabase/supabase-js';

const rawSupabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
// Automatically normalize URL if user accidentally copied "/rest/v1/" from Supabase Data API settings
const supabaseUrl = rawSupabaseUrl
  .replace(/\/rest\/v1\/?$/i, '')
  .replace(/\/+$/, '');
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

/**
 * True only when real-looking public Supabase credentials are present.
 * Placeholder values from .env.example are treated as "not configured" so the
 * app falls back to local demo mode instead of crashing.
 */
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project-id') &&
    !supabaseAnonKey.endsWith('...')
);

// Browser-safe client (anon key only — never put the service-role key here).
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null;
