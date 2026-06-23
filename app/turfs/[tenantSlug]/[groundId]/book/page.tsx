"use client";

import { Suspense, useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Loader2, MapPin } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/Button';
import { supabase } from '@/lib/supabase';
import { fetchGroundBySlugAndId, fetchAvailableSlots } from '@/lib/queries';
import { formatCurrency, formatDate, formatTime } from '@/lib/format';
import type { GroundWithTenant, PortalBookingConfirmation, TimeSlot } from '@/lib/types';

function BookingFormInner() {
  const router = useRouter();
  const params = useParams<{ tenantSlug: string; groundId: string }>();
  const search = useSearchParams();

  const tenantSlug = params?.tenantSlug ?? '';
  const groundId = params?.groundId ?? '';
  const slotId = search?.get('slot') ?? '';
  const date = search?.get('date') ?? '';

  const [ground, setGround] = useState<GroundWithTenant | null>(null);
  const [slot, setSlot] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Form state
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!tenantSlug || !groundId || !slotId || !date) {
      setLoadError('Missing slot information. Pick a slot first.');
      setLoading(false);
      return;
    }
    Promise.all([
      fetchGroundBySlugAndId(tenantSlug, groundId),
      fetchAvailableSlots(groundId, date, date),
    ])
      .then(([g, slots]) => {
        if (!g) {
          setLoadError('Ground not found or no longer listed.');
          return;
        }
        const found = slots.find((s) => s.id === slotId);
        if (!found) {
          setLoadError('This slot is no longer available — please pick another.');
          return;
        }
        setGround(g);
        setSlot(found);
      })
      .catch((e: unknown) =>
        setLoadError(e instanceof Error ? e.message : 'Failed to load slot')
      )
      .finally(() => setLoading(false));
  }, [tenantSlug, groundId, slotId, date]);

  const canSubmit =
    !submitting &&
    !!slot &&
    !!ground &&
    phone.trim().length >= 6 &&
    fullName.trim().length >= 2;

  const handleSubmit = async () => {
    if (!canSubmit || !ground || !slot) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const { data, error } = await supabase.rpc('create_portal_booking', {
        p_ground_id: ground.id,
        p_slot_id: slot.id,
        p_full_name: fullName,
        p_phone: phone,
        p_email: email.trim() || null,
        p_team_size: teamSize ? parseInt(teamSize, 10) || null : null,
        p_notes: notes.trim() || null,
      });
      if (error) throw error;
      const confirmation = data as PortalBookingConfirmation;

      // Stash confirmation in sessionStorage so /booking-confirmed can render
      // a receipt without a follow-up DB call.
      sessionStorage.setItem(
        'lastBookingConfirmation',
        JSON.stringify({
          ...confirmation,
          ground_name: ground.name,
          venue_name: ground.tenant.name,
          venue_address: [ground.tenant.address, ground.tenant.area, ground.tenant.city]
            .filter(Boolean)
            .join(', '),
          start_time: slot.start_time,
          end_time: slot.end_time,
          customer_name: fullName.trim(),
          customer_phone: phone.trim(),
        })
      );
      router.replace('/booking-confirmed');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to confirm booking';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-950 flex items-center justify-center">
        <Loader2 size={20} className="animate-spin text-lime-400" />
      </div>
    );
  }

  if (loadError || !ground || !slot) {
    return (
      <div className="min-h-screen bg-ink-950 flex flex-col">
        <Navbar />
        <section className="flex-1 px-6 pt-32 pb-20 max-w-2xl mx-auto w-full">
          <p className="text-red-400 mb-4">{loadError ?? 'Could not load slot.'}</p>
          <Link href="/turfs" className="text-lime-400 text-sm font-bold hover:underline">
            ← Back to turfs
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

      <section className="pt-28 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <Link
            href={`/turfs/${tenantSlug}/${groundId}`}
            className="inline-flex items-center gap-1 text-ink-400 hover:text-lime-400 text-sm mb-5"
          >
            <ArrowLeft size={14} /> Back to ground
          </Link>

          <h1 className="text-paper font-display font-bold text-3xl tracking-tight mb-2">
            Confirm your booking
          </h1>
          <p className="text-ink-400 mb-6">
            No account needed — pay at venue. Receipt will be sent to your phone.
          </p>

          {/* Slot summary */}
          <div className="bg-ink-900 border border-lime-500/30 rounded-2xl p-5 mb-6">
            <p className="text-lime-400 text-xs font-bold tracking-widest uppercase mb-2">
              Your slot
            </p>
            <p className="text-paper font-display font-bold text-xl">{ground.name}</p>
            <p className="text-ink-300 text-sm">{ground.tenant.name}</p>
            {cityArea && (
              <div className="flex items-center gap-1.5 mt-1.5 text-ink-400 text-xs">
                <MapPin size={12} /> {cityArea}
              </div>
            )}
            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 pt-4 border-t border-ink-700/60">
              <div className="flex items-center gap-1.5 text-ink-200 text-sm">
                <Calendar size={14} className="text-lime-400" />
                {formatDate(date)}
              </div>
              <div className="flex items-center gap-1.5 text-ink-200 text-sm">
                <Clock size={14} className="text-lime-400" />
                {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
              </div>
              <div className="ml-auto">
                <span className="text-paper text-xl font-display font-bold">
                  {formatCurrency(ground.price_per_hour)}
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-ink-900 border border-ink-700/60 rounded-2xl p-5">
            <h2 className="text-paper font-display font-bold text-lg mb-4">Your details</h2>

            <FormField
              label="Phone *"
              type="tel"
              placeholder="+880 1XXX XXXXXX"
              value={phone}
              onChange={setPhone}
            />
            <FormField
              label="Full name *"
              type="text"
              placeholder="Your name"
              value={fullName}
              onChange={setFullName}
            />
            <FormField
              label="Email (optional)"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={setEmail}
            />
            <FormField
              label="Team size (optional)"
              type="number"
              placeholder="e.g. 10"
              value={teamSize}
              onChange={setTeamSize}
            />
            <FormField
              label="Notes (optional)"
              type="text"
              placeholder="Anything the venue should know"
              value={notes}
              onChange={setNotes}
            />

            {submitError && (
              <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                {submitError}
              </div>
            )}

            <div className="mt-5">
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="w-full justify-center"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Confirming…
                  </>
                ) : (
                  <>Confirm booking · {formatCurrency(ground.price_per_hour)}</>
                )}
              </Button>
              <p className="text-ink-500 text-[11px] mt-3 text-center">
                By confirming, you agree to pay {formatCurrency(ground.price_per_hour)} at the venue on
                {' '}
                {formatDate(date)}.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type: string;
}) {
  return (
    <div className="mb-3">
      <label className="block text-ink-300 text-[11px] font-bold tracking-widest uppercase mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-ink-950 border border-ink-700 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 outline-none rounded-lg py-3 px-4 text-paper placeholder:text-ink-600 transition-colors"
      />
    </div>
  );
}

export default function BookingPage() {
  // Suspense boundary keeps useSearchParams happy during static-export builds.
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-ink-950 flex items-center justify-center">
          <Loader2 size={20} className="animate-spin text-lime-400" />
        </div>
      }
    >
      <BookingFormInner />
    </Suspense>
  );
}
