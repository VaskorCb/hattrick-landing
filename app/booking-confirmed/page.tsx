"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, CheckCircle2, Clock, MapPin, Phone, Printer, Receipt, User } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/Button';
import { formatCurrency, formatDate, formatTime } from '@/lib/format';

interface StoredConfirmation {
  id: string;
  booking_number: string;
  booking_date: string;
  final_amount: number;
  customer_id: string;
  ground_name: string;
  venue_name: string;
  venue_address: string;
  start_time: string;
  end_time: string;
  customer_name: string;
  customer_phone: string;
}

export default function BookingConfirmedPage() {
  const [c, setC] = useState<StoredConfirmation | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('lastBookingConfirmation');
    if (raw) {
      try {
        setC(JSON.parse(raw) as StoredConfirmation);
      } catch {
        setC(null);
      }
    }
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  if (!c) {
    return (
      <div className="min-h-screen bg-ink-950 flex flex-col">
        <Navbar />
        <section className="flex-1 px-6 pt-32 pb-20 max-w-2xl mx-auto w-full text-center">
          <p className="text-ink-300 mb-4">
            No recent booking found in this session. Receipt was sent to your phone.
          </p>
          <Link href="/turfs" className="text-lime-400 text-sm font-bold hover:underline">
            Browse turfs →
          </Link>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-950 flex flex-col">
      <Navbar />

      <section className="flex-1 pt-28 pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Success header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-lime-500/20 border-2 border-lime-500/40 flex items-center justify-center mb-4">
              <CheckCircle2 size={32} className="text-lime-400" />
            </div>
            <p className="text-lime-400 text-xs font-bold tracking-widest uppercase">
              Booking confirmed
            </p>
            <h1 className="text-paper font-display font-bold text-3xl mt-2">
              You&apos;re booked, {c.customer_name.split(' ')[0]}!
            </h1>
            <p className="text-ink-400 mt-2 max-w-md">
              Show this booking number at the venue. Payment is collected on arrival.
            </p>
          </div>

          {/* Receipt card */}
          <div className="bg-ink-900 border border-ink-700/60 rounded-2xl overflow-hidden">
            <div className="bg-lime-500 text-ink-900 px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase opacity-70">
                  Booking number
                </p>
                <p className="font-display font-bold text-2xl">{c.booking_number}</p>
              </div>
              <Receipt size={32} className="opacity-50" />
            </div>

            <div className="p-5 space-y-4">
              <Row icon={<Calendar size={16} />} label="Date" value={formatDate(c.booking_date)} />
              <Row
                icon={<Clock size={16} />}
                label="Time"
                value={`${formatTime(c.start_time)} – ${formatTime(c.end_time)}`}
              />
              <Row icon={<MapPin size={16} />} label="Venue" value={c.venue_name} sub={c.venue_address} />
              <Row icon={<User size={16} />} label="Pitch" value={c.ground_name} />
              <Row icon={<Phone size={16} />} label="Contact" value={c.customer_phone} sub={c.customer_name} />

              <div className="border-t border-ink-700/60 pt-4 mt-4 flex items-center justify-between">
                <span className="text-ink-300 text-sm">Pay at venue</span>
                <span className="text-paper text-2xl font-display font-bold">
                  {formatCurrency(c.final_amount)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <Button variant="secondary" size="md" onClick={() => window.print()}>
              <Printer size={14} />
              Print receipt
            </Button>
            <Link href="/turfs" className="flex-1">
              <Button size="md" className="w-full justify-center">
                Browse more turfs
              </Button>
            </Link>
          </div>

          <p className="text-ink-500 text-xs text-center mt-6">
            Need to cancel or reschedule? Contact the venue directly.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Row({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-ink-800 border border-ink-700/60 flex items-center justify-center text-lime-400 flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-ink-400 text-[10px] font-bold tracking-widest uppercase">{label}</p>
        <p className="text-paper font-bold text-sm">{value}</p>
        {sub && <p className="text-ink-400 text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
