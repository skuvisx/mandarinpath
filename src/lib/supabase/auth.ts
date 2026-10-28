import { z } from 'zod';
import { supabase } from './client';

export const emailSchema = z.string().trim().email('Format email tidak valid').max(254);
export const passwordSchema = z
  .string()
  .min(8, 'Kata sandi minimal 8 karakter')
  .max(72, 'Kata sandi maksimal 72 karakter');

export const signUpSchema = z.object({
  name: z.string().trim().min(2, 'Nama minimal 2 karakter').max(60),
  email: emailSchema,
  password: passwordSchema,
});

export const signInSchema = z.object({ email: emailSchema, password: z.string().min(1, 'Kata sandi wajib diisi') });

export type AuthResult = { ok: true; message?: string } | { ok: false; error: string };

function notConfigured(): AuthResult {
  return {
    ok: false,
    error: 'Supabase belum dikonfigurasi. Aplikasi berjalan dalam Mode Lokal (data tersimpan di perangkat ini).',
  };
}

function translateError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes('invalid login')) return 'Email atau kata sandi salah.';
  if (m.includes('already registered') || m.includes('already been registered')) return 'Email sudah terdaftar. Silakan masuk.';
  if (m.includes('email not confirmed')) return 'Email belum dikonfirmasi. Cek kotak masuk Anda.';
  if (m.includes('rate limit')) return 'Terlalu banyak percobaan. Coba lagi beberapa menit lagi.';
  return 'Terjadi kesalahan autentikasi. Silakan coba lagi.';
}

export async function signUp(input: unknown): Promise<AuthResult> {
  if (!supabase) return notConfigured();
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const { name, email, password } = parsed.data;
  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth` : undefined,
    },
  });
  if (error) return { ok: false, error: translateError(error.message) };
  if (!data.session) return { ok: true, message: 'Pendaftaran berhasil. Cek email Anda untuk konfirmasi akun.' };
  return { ok: true, message: 'Pendaftaran berhasil. Anda sudah masuk.' };
}

export async function signIn(input: unknown): Promise<AuthResult> {
  if (!supabase) return notConfigured();
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { ok: false, error: translateError(error.message) };
  return { ok: true };
}

export async function signOut(): Promise<AuthResult> {
  if (!supabase) return notConfigured();
  const { error } = await supabase.auth.signOut();
  if (error) return { ok: false, error: translateError(error.message) };
  return { ok: true };
}

export async function requestPasswordReset(email: unknown): Promise<AuthResult> {
  if (!supabase) return notConfigured();
  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth?mode=update-password` : undefined,
  });
  if (error) return { ok: false, error: translateError(error.message) };
  return { ok: true, message: 'Jika email terdaftar, tautan reset kata sandi sudah dikirim.' };
}

export async function updatePassword(password: unknown): Promise<AuthResult> {
  if (!supabase) return notConfigured();
  const parsed = passwordSchema.safeParse(password);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const { error } = await supabase.auth.updateUser({ password: parsed.data });
  if (error) return { ok: false, error: translateError(error.message) };
  return { ok: true, message: 'Kata sandi berhasil diperbarui.' };
}

// ---- Cloud progress sync (one JSON snapshot per user, RLS-protected) ----

export async function pushSnapshot(userId: string, json: string): Promise<AuthResult> {
  if (!supabase) return notConfigured();
  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch {
    return { ok: false, error: 'Data lokal rusak, sinkronisasi dibatalkan.' };
  }
  const { error } = await supabase.from('user_progress_snapshots').upsert({
    user_id: userId,
    data,
    schema_version: '2',
    client_updated_at: new Date().toISOString(),
  });
  if (error) return { ok: false, error: `Gagal mengunggah progres: ${error.message}` };
  return { ok: true };
}

export async function pullSnapshot(
  userId: string
): Promise<{ ok: true; json: string | null; updatedAt: string | null } | { ok: false; error: string }> {
  if (!supabase) return notConfigured() as { ok: false; error: string };
  const { data, error } = await supabase
    .from('user_progress_snapshots')
    .select('data, client_updated_at')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) return { ok: false, error: `Gagal mengambil progres: ${error.message}` };
  if (!data) return { ok: true, json: null, updatedAt: null };
  return { ok: true, json: JSON.stringify(data.data), updatedAt: data.client_updated_at };
}

export async function deleteMyCloudData(): Promise<AuthResult> {
  if (!supabase) return notConfigured();
  const { error } = await supabase.rpc('delete_my_data');
  if (error) return { ok: false, error: `Gagal menghapus data cloud: ${error.message}` };
  return { ok: true, message: 'Seluruh data progres di cloud telah dihapus.' };
}
