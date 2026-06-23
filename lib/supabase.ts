import { createClient } from '@supabase/supabase-js';

// Public-anon client. Reads are RLS-restricted to listed tenants /
// available slots; writes go through SECURITY DEFINER RPCs only.
//
// For server components and route handlers a separate server client can be
// added later. For now, the portal pages are read-only with one RPC call
// (create_portal_booking) so the browser-side anon client is enough.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Fail loudly during build / dev so the developer sees the missing env vars
  // instead of getting opaque 401s at runtime.
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Copy .env.example to .env.local.'
  );
}

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
