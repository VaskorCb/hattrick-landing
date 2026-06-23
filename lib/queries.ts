// Data fetching helpers for the customer portal. All reads go through the
// anon Supabase client; RLS limits the rows to listed tenants + active
// grounds + future available slots only.

import { supabase } from './supabase';
import type { GroundType, GroundWithTenant, TimeSlot } from './types';

const GROUND_WITH_TENANT =
  '*, tenant:tenants!inner(id, name, slug, address, city, area)';

export interface BrowseFilters {
  q?: string;         // free-text: ground name OR venue name OR city OR area
  city?: string;
  groundType?: GroundType;
  amenities?: string[]; // ALL must match
}

export async function fetchGroundsForBrowse(
  filters: BrowseFilters = {}
): Promise<GroundWithTenant[]> {
  let query = supabase
    .from('grounds')
    .select(GROUND_WITH_TENANT)
    .eq('is_active', true);

  if (filters.groundType) {
    query = query.eq('ground_type', filters.groundType);
  }
  if (filters.amenities && filters.amenities.length > 0) {
    query = query.contains('amenities', filters.amenities);
  }

  const { data, error } = await query.order('name');
  if (error) throw error;

  let rows = (data ?? []) as unknown as GroundWithTenant[];

  // Client-side text + city filter so we can match across tenant fields without
  // doing a complex Supabase OR query across embedded tables.
  if (filters.city) {
    const needle = filters.city.toLowerCase();
    rows = rows.filter(
      (g) =>
        g.tenant.city?.toLowerCase() === needle ||
        g.tenant.area?.toLowerCase() === needle
    );
  }
  if (filters.q) {
    const needle = filters.q.toLowerCase().trim();
    if (needle.length > 0) {
      rows = rows.filter((g) => {
        const t = g.tenant;
        return (
          g.name.toLowerCase().includes(needle) ||
          t.name.toLowerCase().includes(needle) ||
          (t.city ?? '').toLowerCase().includes(needle) ||
          (t.area ?? '').toLowerCase().includes(needle) ||
          (t.address ?? '').toLowerCase().includes(needle)
        );
      });
    }
  }

  return rows;
}

// Distinct cities across all listed tenants — for the homepage city pills.
export async function fetchCities(): Promise<string[]> {
  const { data, error } = await supabase
    .from('tenants')
    .select('city');
  if (error) throw error;
  const cities = new Set<string>();
  (data ?? []).forEach((row: { city: string | null }) => {
    if (row.city && row.city.trim()) cities.add(row.city.trim());
  });
  return [...cities].sort();
}

// Single ground by tenant slug + ground id (clean URL: /turfs/[tenantSlug]/[groundId]).
// For now we just look up by ground id and verify the joined tenant slug matches.
export async function fetchGroundBySlugAndId(
  tenantSlug: string,
  groundId: string
): Promise<GroundWithTenant | null> {
  const { data, error } = await supabase
    .from('grounds')
    .select(GROUND_WITH_TENANT)
    .eq('id', groundId)
    .eq('is_active', true)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const row = data as unknown as GroundWithTenant;
  if (row.tenant.slug !== tenantSlug) return null;
  return row;
}

// My bookings — for the logged-in customer's /account page. RLS guarantees
// only rows where user_id = auth.uid() come back.
export interface MyBookingRow {
  id: string;
  booking_number: string;
  booking_date: string;
  final_amount: number;
  booking_status: string;
  payment_status: string;
  notes: string | null;
  created_at: string;
  ground: {
    id: string;
    name: string;
    tenant: { name: string; slug: string; city: string | null; area: string | null };
  } | null;
  time_slot: { start_time: string; end_time: string } | null;
}

export async function fetchMyBookings(): Promise<MyBookingRow[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select(
      `id, booking_number, booking_date, final_amount, booking_status, payment_status, notes, created_at,
       ground:grounds(id, name, tenant:tenants(name, slug, city, area)),
       time_slot:time_slots(start_time, end_time)`
    )
    .order('booking_date', { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as MyBookingRow[];
}

// Customer cancels their own future booking. Wraps the SECURITY DEFINER
// RPC which checks ownership + booking state on the server.
export async function cancelMyBooking(bookingId: string): Promise<void> {
  const { error } = await supabase.rpc('customer_cancel_booking', {
    p_booking_id: bookingId,
  });
  if (error) throw error;
}

// ---- Reviews ---------------------------------------------------------------

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user_id: string;
  // Joined: customer name (only if profile visible — RLS)
  reviewer?: { full_name: string | null } | null;
}

export interface GroundRating {
  ground_id: string;
  avg_rating: number;
  review_count: number;
}

export async function fetchReviewsForGround(groundId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('id, rating, comment, created_at, user_id, reviewer:profiles!user_id(full_name)')
    .eq('ground_id', groundId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as Review[];
}

export async function fetchRatingsMap(groundIds: string[]): Promise<Map<string, GroundRating>> {
  if (groundIds.length === 0) return new Map();
  const { data, error } = await supabase
    .from('ground_ratings')
    .select('*')
    .in('ground_id', groundIds);
  if (error) throw error;
  const map = new Map<string, GroundRating>();
  (data ?? []).forEach((r: GroundRating) => map.set(r.ground_id, r));
  return map;
}

export async function submitReview(
  bookingId: string,
  rating: number,
  comment: string | null
): Promise<void> {
  const { error } = await supabase.rpc('submit_review', {
    p_booking_id: bookingId,
    p_rating: rating,
    p_comment: comment,
  });
  if (error) throw error;
}

// Returns the existing review for a booking (if any) — used to prefill the
// edit form on /account.
export async function fetchMyReviewForBooking(bookingId: string): Promise<Review | null> {
  const { data, error } = await supabase
    .from('reviews')
    .select('id, rating, comment, created_at, user_id')
    .eq('booking_id', bookingId)
    .maybeSingle();
  if (error) throw error;
  return (data as Review | null) ?? null;
}

// ---- Favorites -------------------------------------------------------------

export async function fetchMyFavoriteIds(): Promise<Set<string>> {
  const { data, error } = await supabase.from('favorites').select('ground_id');
  if (error) throw error;
  return new Set((data ?? []).map((r: { ground_id: string }) => r.ground_id));
}

export async function addFavorite(groundId: string): Promise<void> {
  const { data: user } = await supabase.auth.getUser();
  if (!user?.user) throw new Error('Not signed in');
  const { error } = await supabase
    .from('favorites')
    .insert({ user_id: user.user.id, ground_id: groundId });
  if (error && error.code !== '23505') throw error; // ignore duplicate
}

export async function removeFavorite(groundId: string): Promise<void> {
  const { error } = await supabase.from('favorites').delete().eq('ground_id', groundId);
  if (error) throw error;
}

export async function fetchMyFavoriteGrounds(): Promise<GroundWithTenant[]> {
  const { data, error } = await supabase
    .from('favorites')
    .select(
      `ground:grounds!inner(*, tenant:tenants!inner(id, name, slug, address, city, area))`
    );
  if (error) throw error;
  return (data ?? [])
    .map((r: { ground: GroundWithTenant }) => r.ground)
    .filter(Boolean);
}

// Available slots for a ground over a date range.
export async function fetchAvailableSlots(
  groundId: string,
  startDate: string,
  endDate: string
): Promise<TimeSlot[]> {
  const { data, error } = await supabase
    .from('time_slots')
    .select('*')
    .eq('ground_id', groundId)
    .eq('status', 'available')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date')
    .order('start_time');
  if (error) throw error;
  return (data ?? []) as TimeSlot[];
}
