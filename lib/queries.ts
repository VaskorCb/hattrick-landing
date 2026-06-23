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
