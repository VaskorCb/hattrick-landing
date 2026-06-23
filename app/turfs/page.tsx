"use client";

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, MapPin, SlidersHorizontal, X } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SearchBar } from '@/components/portal/SearchBar';
import { GroundCard } from '@/components/portal/GroundCard';
import { AMENITIES, GROUND_TYPE_LABELS } from '@/lib/amenities';
import { fetchCities, fetchGroundsForBrowse, fetchRatingsMap, type GroundRating } from '@/lib/queries';
import type { GroundType, GroundWithTenant } from '@/lib/types';
import { cn } from '@/lib/utils';

const GROUND_TYPES: GroundType[] = ['five_a_side', 'seven_a_side', 'futsal', 'full_size'];

function TurfsBrowseInner() {
  const search = useSearchParams();
  const initialQ = search?.get('q') ?? '';
  const initialCity = search?.get('city') ?? null;
  const [query, setQuery] = useState(initialQ);
  const [city, setCity] = useState<string | null>(initialCity);
  const [groundType, setGroundType] = useState<GroundType | null>(null);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [grounds, setGrounds] = useState<GroundWithTenant[] | null>(null);
  const [ratings, setRatings] = useState<Map<string, GroundRating>>(new Map());
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cities load once on mount.
  useEffect(() => {
    fetchCities()
      .then(setCities)
      .catch(() => setCities([]));
  }, []);

  // Re-fetch grounds when filters change. Debounced minimally — Supabase is fast.
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchGroundsForBrowse({
      q: query,
      city: city ?? undefined,
      groundType: groundType ?? undefined,
      amenities: amenities.length ? amenities : undefined,
    })
      .then(async (rows) => {
        setGrounds(rows);
        // Fire-and-forget ratings fetch. Failure here shouldn't block the
        // listing — ratings just won't show up.
        try {
          const map = await fetchRatingsMap(rows.map((r) => r.id));
          setRatings(map);
        } catch {
          setRatings(new Map());
        }
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, [query, city, groundType, amenities]);

  const toggleAmenity = (key: string) =>
    setAmenities((cur) => (cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key]));

  const clearFilters = () => {
    setCity(null);
    setGroundType(null);
    setAmenities([]);
    setQuery('');
  };

  const activeFilterCount =
    (city ? 1 : 0) + (groundType ? 1 : 0) + amenities.length + (query ? 1 : 0);

  const visible = useMemo(() => grounds ?? [], [grounds]);

  return (
    <div className="min-h-screen bg-ink-950 flex flex-col">
      <Navbar />

      {/* Hero band */}
      <section className="pt-32 pb-10 px-6 border-b border-ink-800">
        <div className="max-w-7xl mx-auto">
          <p className="text-lime-400 text-xs font-bold tracking-widest uppercase mb-3">
            Browse turfs
          </p>
          <h1 className="text-paper font-display font-bold text-4xl md:text-5xl tracking-tight">
            Find your pitch.
          </h1>
          <p className="text-ink-400 mt-2 max-w-xl">
            Search across every listed venue. Live slot availability, no login required to book.
          </p>

          <div className="mt-6 max-w-2xl">
            <SearchBar value={query} onChange={setQuery} />
          </div>

          {/* City pills */}
          {cities.length > 0 && (
            <div className="mt-5 flex items-center gap-2 flex-wrap">
              <span className="text-ink-500 text-xs font-bold uppercase tracking-widest">
                Cities:
              </span>
              {cities.map((c) => {
                const active = city === c;
                return (
                  <button
                    key={c}
                    onClick={() => setCity(active ? null : c)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-bold border transition-colors',
                      active
                        ? 'bg-lime-500 border-lime-500 text-ink-900'
                        : 'bg-transparent border-ink-700 text-ink-300 hover:border-lime-500/60'
                    )}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Filters + grid */}
      <section className="flex-1 py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFiltersOpen((v) => !v)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-ink-900 border border-ink-700 text-paper text-sm font-bold hover:border-lime-500/60 transition-colors"
              >
                <SlidersHorizontal size={14} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded bg-lime-500 text-ink-900 text-[10px] font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-ink-400 hover:text-paper text-xs font-bold tracking-widest uppercase flex items-center gap-1"
                >
                  <X size={12} /> Clear
                </button>
              )}
            </div>
            <span className="text-ink-400 text-sm">
              {loading ? '…' : `${visible.length} result${visible.length === 1 ? '' : 's'}`}
            </span>
          </div>

          {filtersOpen && (
            <div className="bg-ink-900 border border-ink-700 rounded-2xl p-5 mb-5">
              <div className="mb-4">
                <p className="text-ink-300 text-xs font-bold tracking-widest uppercase mb-2">
                  Ground type
                </p>
                <div className="flex flex-wrap gap-2">
                  {GROUND_TYPES.map((t) => {
                    const active = groundType === t;
                    return (
                      <button
                        key={t}
                        onClick={() => setGroundType(active ? null : t)}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors',
                          active
                            ? 'bg-lime-500 border-lime-500 text-ink-900'
                            : 'bg-transparent border-ink-700 text-ink-300 hover:border-lime-500/60'
                        )}
                      >
                        {GROUND_TYPE_LABELS[t]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-ink-300 text-xs font-bold tracking-widest uppercase mb-2">
                  Amenities (all required)
                </p>
                <div className="flex flex-wrap gap-2">
                  {AMENITIES.map((a) => {
                    const active = amenities.includes(a.key);
                    const Icon = a.Icon;
                    return (
                      <button
                        key={a.key}
                        onClick={() => toggleAmenity(a.key)}
                        className={cn(
                          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors',
                          active
                            ? 'bg-lime-500 border-lime-500 text-ink-900'
                            : 'bg-transparent border-ink-700 text-ink-300 hover:border-lime-500/60'
                        )}
                      >
                        <Icon size={12} />
                        {a.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {error ? (
            <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              {error}
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-20 text-ink-400">
              <Loader2 size={20} className="animate-spin mr-2" />
              Loading turfs…
            </div>
          ) : visible.length === 0 ? (
            <div className="text-center py-20 text-ink-400">
              <MapPin size={32} className="mx-auto mb-3 text-ink-600" />
              <p className="font-bold text-paper">No turfs match.</p>
              <p className="text-sm mt-1">Try removing some filters or a different search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {visible.map((g) => {
                const r = ratings.get(g.id);
                return (
                  <GroundCard
                    key={g.id}
                    ground={g}
                    rating={r?.avg_rating}
                    reviewCount={r?.review_count}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function TurfsBrowsePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-ink-950 flex items-center justify-center">
          <Loader2 size={20} className="animate-spin text-lime-400" />
        </div>
      }
    >
      <TurfsBrowseInner />
    </Suspense>
  );
}
