import { supabase } from './supabase';

// Phone OTP login. Requires the Supabase project to have an SMS provider
// configured (Twilio, MessageBird, etc.). Without provider, the API call
// will return a clear error so the user sees what's missing.

export interface AuthResult {
  ok: boolean;
  error?: string;
}

export async function sendPhoneOtp(phone: string): Promise<AuthResult> {
  const trimmed = phone.trim();
  if (trimmed.length < 6) return { ok: false, error: 'Phone number too short' };
  const { error } = await supabase.auth.signInWithOtp({
    phone: trimmed,
    options: {
      // Auto-create the auth user on first use. We DON'T pass channel: 'whatsapp'
      // — defaults to SMS which works with any provider.
      shouldCreateUser: true,
    },
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function verifyPhoneOtp(phone: string, token: string): Promise<AuthResult> {
  const { error } = await supabase.auth.verifyOtp({
    phone: phone.trim(),
    token: token.trim(),
    type: 'sms',
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}
