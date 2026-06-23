import Link from 'next/link';
import { MapPin } from 'lucide-react';
import type { GroundWithTenant } from '@/lib/types';
import { formatCurrency } from '@/lib/format';
import { GROUND_TYPE_LABELS, amenityByKey } from '@/lib/amenities';
import { StarRating } from './StarRating';

// Card shown on the /turfs browse grid. Click → detail page.
export function GroundCard({
  ground,
  rating,
  reviewCount,
}: {
  ground: GroundWithTenant;
  rating?: number;
  reviewCount?: number;
}) {
  const href = `/turfs/${ground.tenant.slug}/${ground.id}`;
  const cover = ground.photos?.[0] ?? ground.image_url ?? null;
  const topAmenities = (ground.amenities ?? []).slice(0, 3);
  const cityArea =
    [ground.tenant.area, ground.tenant.city].filter(Boolean).join(', ') || null;

  return (
    <Link
      href={href}
      className="group block bg-ink-900 border border-ink-700/60 rounded-2xl overflow-hidden hover:border-lime-500/60 transition-colors"
    >
      <div className="relative aspect-[16/10] bg-ink-800 overflow-hidden">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={ground.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lime-500/40 text-7xl font-display font-bold">
              {ground.name.slice(0, 1).toUpperCase()}
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-ink-950/80 backdrop-blur">
          <span className="text-[10px] font-bold tracking-widest text-lime-400 uppercase">
            {GROUND_TYPE_LABELS[ground.ground_type] ?? ground.ground_type}
          </span>
        </div>
        {rating != null && reviewCount && reviewCount > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md bg-ink-950/80 backdrop-blur">
            <StarRating value={rating} size={11} />
            <span className="text-paper text-[11px] font-bold">{rating.toFixed(1)}</span>
            <span className="text-ink-400 text-[10px]">({reviewCount})</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-paper font-display font-bold text-lg leading-tight">
          {ground.name}
        </h3>
        <p className="text-ink-400 text-sm mt-0.5 truncate">{ground.tenant.name}</p>
        {cityArea && (
          <div className="flex items-center gap-1 mt-2 text-ink-500 text-xs">
            <MapPin size={12} />
            <span className="truncate">{cityArea}</span>
          </div>
        )}

        {topAmenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {topAmenities.map((key) => {
              const meta = amenityByKey(key);
              if (!meta) return null;
              const Icon = meta.Icon;
              return (
                <div
                  key={key}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-ink-800/60 border border-ink-700/40"
                >
                  <Icon size={10} className="text-lime-400" />
                  <span className="text-[10px] text-ink-300 font-medium">{meta.label}</span>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-end justify-between mt-4 pt-3 border-t border-ink-800">
          <div>
            <span className="text-paper text-xl font-display font-bold">
              {formatCurrency(ground.price_per_hour)}
            </span>
            <span className="text-ink-400 text-xs ml-1">/hour</span>
          </div>
          <span className="text-lime-400 text-xs font-bold tracking-widest uppercase">
            Book →
          </span>
        </div>
      </div>
    </Link>
  );
}
