// Shared types — mirror the HatTrick management app's database.types.ts but
// only the slice the customer portal needs (no admin/staff-only fields).

export type GroundType = 'five_a_side' | 'seven_a_side' | 'futsal' | 'full_size';
export type SlotStatus = 'available' | 'booked' | 'blocked' | 'completed';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  address: string | null;
  city: string | null;
  area: string | null;
}

export interface Ground {
  id: string;
  tenant_id: string;
  name: string;
  ground_type: GroundType;
  price_per_hour: number; // paise / smallest currency unit
  opening_time: string;
  closing_time: string;
  is_active: boolean;
  image_url: string | null;
  description: string | null;
  amenities: string[];
  photos: string[];
}

export interface TimeSlot {
  id: string;
  ground_id: string;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:mm
  end_time: string;
  status: SlotStatus;
}

// Returned by create_portal_booking RPC.
export interface PortalBookingConfirmation {
  id: string;
  booking_number: string;
  booking_date: string;
  final_amount: number;
  customer_id: string;
}

// Joined shape used on listing/detail pages.
export interface GroundWithTenant extends Ground {
  tenant: Tenant;
}
