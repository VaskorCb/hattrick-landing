"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Loader2,
  LogOut,
  MapPin,
  ReceiptText,
  User,
  X,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/Button';
import { useSession } from '@/lib/useSession';
import { signOut } from '@/lib/auth';
import { cancelMyBooking, fetchMyBookings, type MyBookingRow } from '@/lib/queries';
import { formatCurrency, formatDate, formatTime } from '@/lib/format';

export default function AccountPage() {
  const router = useRouter();
  const { session, loading: sessionLoading, user } = useSession();

  const [bookings, setBookings] = useState<MyBookingRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  const refreshBookings = async () => {
    try {
      const next = await fetchMyBookings();
      setBookings(next);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this booking? The slot will be released for others.')) return;
    setCancelingId(id);
    try {
      await cancelMyBooking(id);
      await refreshBookings();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed to cancel');
    } finally {
      setCancelingId(null);
    }
  };

  // Redirect to login if not signed in.
  useEffect(() => {
    if (!sessionLoading && !session) router.replace('/login');
  }, [sessionLoading, session, router]);

  useEffect(() => {
    if (!session) return;
    setLoading(true);
    refreshBookings().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/');
  };

  if (sessionLoading || !session) {
    return (
      <div className="min-h-screen bg-ink-950 flex items-center justify-center">
        <Loader2 size={20} className="animate-spin text-lime-400" />
      </div>
    );
  }

  const upcoming = (bookings ?? []).filter(
    (b) => b.booking_date >= todayLocal() && b.booking_status !== 'cancelled'
  );
  const past = (bookings ?? []).filter(
    (b) => b.booking_date < todayLocal() || b.booking_status === 'cancelled'
  );

  return (
    <div className="min-h-screen bg-ink-950 flex flex-col">
      <Navbar />

      <section className="pt-28 pb-16 px-6 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User size={18} className="text-lime-400" />
                <p className="text-lime-400 text-xs font-bold tracking-widest uppercase">
                  My account
                </p>
              </div>
              <h1 className="text-paper font-display font-bold text-3xl tracking-tight">
                {user?.phone ?? 'Welcome'}
              </h1>
              <p className="text-ink-400 text-sm mt-1">
                Your bookings across every venue, in one place.
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={handleSignOut}>
              <LogOut size={14} />
              Sign out
            </Button>
          </div>

          {/* Loading / error */}
          {loading && (
            <div className="flex items-center gap-2 text-ink-400 text-sm py-6">
              <Loader2 size={14} className="animate-spin" /> Loading your bookings…
            </div>
          )}
          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4">
              {error}
            </p>
          )}

          {/* Upcoming */}
          {!loading && !error && (
            <>
              <SectionHeading
                title={`Upcoming (${upcoming.length})`}
                hint="Show your booking number at the venue"
              />
              {upcoming.length === 0 ? (
                <EmptyCard
                  title="No upcoming bookings"
                  cta="Browse turfs"
                  onCta={() => router.push('/turfs')}
                />
              ) : (
                <div className="space-y-3">
                  {upcoming.map((b) => (
                    <BookingRow
                      key={b.id}
                      b={b}
                      onCancel={() => handleCancel(b.id)}
                      canceling={cancelingId === b.id}
                    />
                  ))}
                </div>
              )}

              <SectionHeading title={`Past (${past.length})`} className="mt-10" />
              {past.length === 0 ? (
                <p className="text-ink-500 text-sm">No past bookings yet.</p>
              ) : (
                <div className="space-y-3">
                  {past.map((b) => (
                    <BookingRow key={b.id} b={b} past />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function todayLocal(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function SectionHeading({
  title,
  hint,
  className,
}: {
  title: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={`mb-3 ${className ?? ''}`}>
      <p className="text-paper font-display font-bold text-lg">{title}</p>
      {hint && <p className="text-ink-500 text-xs">{hint}</p>}
    </div>
  );
}

function EmptyCard({
  title,
  cta,
  onCta,
}: {
  title: string;
  cta: string;
  onCta: () => void;
}) {
  return (
    <div className="bg-ink-900 border border-ink-700/60 rounded-2xl p-6 text-center">
      <ReceiptText size={24} className="text-ink-600 mx-auto mb-2" />
      <p className="text-paper font-bold">{title}</p>
      <button
        onClick={onCta}
        className="text-lime-400 text-sm font-bold tracking-widest uppercase mt-3 hover:underline"
      >
        {cta} →
      </button>
    </div>
  );
}

function BookingRow({
  b,
  past = false,
  onCancel,
  canceling = false,
}: {
  b: MyBookingRow;
  past?: boolean;
  onCancel?: () => void;
  canceling?: boolean;
}) {
  const paid = b.payment_status === 'paid';
  const cancelled = b.booking_status === 'cancelled';
  const venueLine =
    b.ground?.tenant
      ? [b.ground.tenant.area, b.ground.tenant.city].filter(Boolean).join(', ')
      : null;

  return (
    <Link
      href={
        b.ground
          ? `/turfs/${b.ground.tenant.slug}/${b.ground.id}`
          : '/turfs'
      }
      className={`block bg-ink-900 border rounded-2xl p-4 transition-colors hover:border-lime-500/40 ${
        cancelled
          ? 'border-red-500/30 opacity-70'
          : past
            ? 'border-ink-700/40'
            : 'border-lime-500/30'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold tracking-widest uppercase text-ink-400">
              #{b.booking_number}
            </span>
            <Dot
              label={
                cancelled
                  ? 'Cancelled'
                  : paid
                    ? 'Paid'
                    : past
                      ? 'Unpaid · past'
                      : 'Pay at venue'
              }
              tone={cancelled ? 'red' : paid ? 'lime' : past ? 'ink' : 'amber'}
            />
          </div>
          <p className="text-paper font-bold">{b.ground?.name ?? 'Booking'}</p>
          <p className="text-ink-400 text-xs">{b.ground?.tenant?.name}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-ink-300 text-xs">
            <span className="flex items-center gap-1">
              <Calendar size={12} className="text-lime-400" />
              {formatDate(b.booking_date)}
            </span>
            {b.time_slot && (
              <span className="flex items-center gap-1">
                <Clock size={12} className="text-lime-400" />
                {formatTime(b.time_slot.start_time)} – {formatTime(b.time_slot.end_time)}
              </span>
            )}
            {venueLine && (
              <span className="flex items-center gap-1">
                <MapPin size={12} className="text-lime-400" />
                {venueLine}
              </span>
            )}
          </div>
        </div>
        <div className="text-right flex flex-col items-end gap-2">
          <p className="text-paper font-display font-bold text-lg">
            {formatCurrency(b.final_amount)}
          </p>
          {onCancel && !cancelled && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onCancel();
              }}
              disabled={canceling}
              className="flex items-center gap-1 text-red-300 hover:text-red-200 text-[10px] font-bold tracking-widest uppercase disabled:opacity-50"
            >
              {canceling ? (
                <Loader2 size={10} className="animate-spin" />
              ) : (
                <X size={10} />
              )}
              Cancel
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}

function Dot({ label, tone }: { label: string; tone: 'lime' | 'amber' | 'red' | 'ink' }) {
  const bg = {
    lime: 'bg-lime-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
    ink: 'bg-ink-500',
  }[tone];
  const text = {
    lime: 'text-lime-300',
    amber: 'text-amber-300',
    red: 'text-red-300',
    ink: 'text-ink-400',
  }[tone];
  return (
    <span className="flex items-center gap-1">
      <span className={`w-1.5 h-1.5 rounded-full ${bg}`} />
      <span
        className={`text-[10px] font-bold tracking-widest uppercase ${text}`}
      >
        {label}
      </span>
    </span>
  );
}
