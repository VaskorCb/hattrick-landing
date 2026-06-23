"use client";

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Loader2, MapPin, Wallet } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/Button';
import { AMENITIES, GROUND_TYPE_LABELS, amenityByKey } from '@/lib/amenities';
import { fetchAvailableSlots, fetchGroundBySlugAndId } from '@/lib/queries';
import { formatCurrency, formatDateShort, formatTime, todayPlusLocal } from '@/lib/format';
import type { GroundWithTenant, TimeSlot } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function GroundDetailPage() {
  const router = useRouter();
  const params = useParams<{ tenantSlug: string; groundId: string }>();
  const tenantSlug = params?.tenantSlug ?? '';
  const groundId = params?.groundId ?? '';

  const [ground, setGround] = useState<GroundWithTenant | null>(null);
  const [groundLoading, setGroundLoading] = useState(true);
  const [groundError, setGroundError] = useState<string | null>(null);

  const [date, setDate] = useState<string>(todayPlusLocal(0));
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    if (!tenantSlug || !groundId) return;
    setGroundLoading(true);
    fetchGroundBySlugAndId(tenantSlug, groundId)
      .then((g) => {
        setGround(g);
        if (!g) setGroundError('Ground not found or no longer listed.');
      })
      .catch((e: unknown) =>
        setGroundError(e instanceof Error ? e.message : 'Failed to load')
      )
      .finally(() => setGroundLoading(false));
  }, [tenantSlug, groundId]);

  useEffect(() => {
    if (!groundId) return;
    setSlotsLoading(true);
    fetchAvailableSlots(groundId, date, date)
      .then(setSlots)
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [groundId, date]);

  const photos = useMemo(() => {
    if (!ground) return [];
    const list = ground.photos ?? [];
    if (list.length > 0) return list;
    if (ground.image_url) return [ground.image_url];
    return [];
  }, [ground]);

  const visibleAmenities = useMemo(() => {
    if (!ground) return [];
    return ground.amenities
      .map((k) => amenityByKey(k))
      .filter((m): m is NonNullable<typeof m> => Boolean(m));
  }, [ground]);

  const handleBook = (slot: TimeSlot) => {
    if (!ground) return;
    router.push(
      `/turfs/${tenantSlug}/${groundId}/book?slot=${slot.id}&date=${slot.date}`
    );
  };

  if (groundLoading) {
    return (
      <div className="min-h-screen bg-ink-950 flex items-center justify-center">
        <Loader2 size={20} className="animate-spin text-lime-400" />
      </div>
    );
  }

  if (!ground) {
    return (
      <div className="min-h-screen bg-ink-950 flex flex-col">
        <Navbar />
        <section className="flex-1 px-6 pt-32 pb-20 max-w-3xl mx-auto w-full">
          <p className="text-red-400 mb-4">{groundError ?? 'Not found.'}</p>
          <Link href="/turfs" className="text-lime-400 text-sm font-bold hover:underline">
            ← Back to all turfs
          </Link>
        </section>
        <Footer />
      </div>
    );
  }

  const cityArea =
    [ground.tenant.area, ground.tenant.city].filter(Boolean).join(', ') || null;

  return (
    <div className="min-h-screen bg-ink-950 flex flex-col">
      <Navbar />

      <section className="pt-28 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/turfs"
            className="inline-flex items-center gap-1 text-ink-400 hover:text-lime-400 text-sm mb-5"
          >
            <ArrowLeft size={14} /> All turfs
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8">
            {/* LEFT — gallery + info */}
            <div>
              {/* Photo gallery */}
              <div className="rounded-2xl overflow-hidden bg-ink-900 border border-ink-700/60">
                <div className="aspect-[16/10] relative bg-ink-800">
                  {photos.length > 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photos[activePhoto]}
                      alt={ground.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lime-500/30 text-9xl font-display font-bold">
                        {ground.name.slice(0, 1).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                {photos.length > 1 && (
                  <div className="flex gap-2 p-3 overflow-x-auto">
                    {photos.map((p, i) => (
                      <button
                        key={p}
                        onClick={() => setActivePhoto(i)}
                        className={cn(
                          'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors',
                          activePhoto === i ? 'border-lime-500' : 'border-ink-700'
                        )}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-md bg-lime-500/10 border border-lime-500/30 text-lime-400 text-[10px] font-bold tracking-widest uppercase">
                    {GROUND_TYPE_LABELS[ground.ground_type] ?? ground.ground_type}
                  </span>
                </div>
                <h1 className="text-paper font-display font-bold text-4xl tracking-tight">
                  {ground.name}
                </h1>
                <p className="text-ink-300 mt-1">{ground.tenant.name}</p>
                {cityArea && (
                  <div className="flex items-center gap-1.5 mt-2 text-ink-400 text-sm">
                    <MapPin size={14} />
                    <span>{[ground.tenant.address, cityArea].filter(Boolean).join(' · ')}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 mt-1 text-ink-400 text-sm">
                  <Clock size={14} />
                  <span>
                    Open {formatTime(ground.opening_time)} – {formatTime(ground.closing_time)}
                  </span>
                </div>
              </div>

              {ground.description && (
                <div className="mt-6">
                  <h2 className="text-paper font-display font-bold text-lg mb-2">About</h2>
                  <p className="text-ink-300 leading-relaxed">{ground.description}</p>
                </div>
              )}

              {visibleAmenities.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-paper font-display font-bold text-lg mb-3">Amenities</h2>
                  <div className="flex flex-wrap gap-2">
                    {visibleAmenities.map((a) => {
                      const Icon = a.Icon;
                      return (
                        <div
                          key={a.key}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-ink-900 border border-ink-700/60"
                        >
                          <Icon size={14} className="text-lime-400" />
                          <span className="text-sm text-ink-200">{a.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT — booking panel */}
            <aside className="lg:sticky lg:top-24 self-start">
              <div className="bg-ink-900 border border-ink-700/60 rounded-2xl p-5">
                <div className="flex items-end justify-between mb-1">
                  <div>
                    <span className="text-paper text-3xl font-display font-bold">
                      {formatCurrency(ground.price_per_hour)}
                    </span>
                    <span className="text-ink-400 text-sm ml-1">/ hour</span>
                  </div>
                  <Wallet size={20} className="text-lime-400" />
                </div>
                <p className="text-ink-400 text-xs mb-4">
                  Pay at venue · cash, card or UPI on arrival
                </p>

                {/* Date strip */}
                <p className="text-ink-300 text-xs font-bold tracking-widest uppercase mb-2">
                  Pick a date
                </p>
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                  {Array.from({ length: 14 }).map((_, i) => {
                    const d = todayPlusLocal(i);
                    const active = d === date;
                    return (
                      <button
                        key={d}
                        onClick={() => setDate(d)}
                        className={cn(
                          'flex-shrink-0 px-3 py-2 rounded-lg border text-xs font-bold transition-colors min-w-[72px]',
                          active
                            ? 'bg-lime-500 border-lime-500 text-ink-900'
                            : 'bg-transparent border-ink-700 text-ink-300 hover:border-lime-500/60'
                        )}
                      >
                        {formatDateShort(d)}
                      </button>
                    );
                  })}
                </div>

                {/* Slots */}
                <p className="text-ink-300 text-xs font-bold tracking-widest uppercase mt-4 mb-2">
                  Available slots
                </p>
                {slotsLoading ? (
                  <div className="flex items-center gap-2 text-ink-400 text-sm py-6 justify-center">
                    <Loader2 size={14} className="animate-spin" /> Loading slots…
                  </div>
                ) : slots.length === 0 ? (
                  <div className="text-center py-6 text-ink-500 text-sm">
                    No slots available for this date.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {slots.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => handleBook(s)}
                        className="px-2 py-2 rounded-lg bg-ink-800 border border-ink-700 hover:border-lime-500 hover:bg-lime-500/10 text-paper text-xs font-bold transition-colors"
                      >
                        {formatTime(s.start_time)}
                      </button>
                    ))}
                  </div>
                )}

                <p className="text-ink-500 text-[11px] mt-4 text-center">
                  Tap a slot → quick guest checkout, no login needed.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
