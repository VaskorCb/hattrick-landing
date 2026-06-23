// Curated amenities catalogue — must stay in sync with the admin app's edit
// form. Each amenity has a display label + a lucide-react icon name (string)
// so the portal renders identical chips to what admins picked.

import type { LucideIcon } from 'lucide-react';
import {
  Car,
  Droplet,
  Zap,
  Coffee,
  Shirt,
  Snowflake,
  CupSoda,
  Heart,
} from 'lucide-react';

export interface AmenityMeta {
  key: string;
  label: string;
  Icon: LucideIcon;
}

export const AMENITIES: AmenityMeta[] = [
  { key: 'parking',        label: 'Parking',        Icon: Car },
  { key: 'washroom',       label: 'Washroom',       Icon: Droplet },
  { key: 'floodlight',     label: 'Floodlight',     Icon: Zap },
  { key: 'drinking_water', label: 'Drinking water', Icon: CupSoda },
  { key: 'changing_room',  label: 'Changing room',  Icon: Shirt },
  { key: 'ac',             label: 'AC',             Icon: Snowflake },
  { key: 'cafe',           label: 'Café',           Icon: Coffee },
  { key: 'first_aid',      label: 'First aid',      Icon: Heart },
];

export function amenityByKey(key: string): AmenityMeta | undefined {
  return AMENITIES.find((a) => a.key === key);
}

export const GROUND_TYPE_LABELS: Record<string, string> = {
  five_a_side:  '5-a-side',
  seven_a_side: '7-a-side',
  futsal:       'Futsal',
  full_size:    'Full size',
};
