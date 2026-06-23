"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Loader2, Phone, ShieldCheck } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/Button';
import { sendPhoneOtp, verifyPhoneOtp } from '@/lib/auth';

type Step = 'phone' | 'otp';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const handleSendOtp = async () => {
    setError(null);
    setBusy(true);
    const res = await sendPhoneOtp(phone);
    setBusy(false);
    if (!res.ok) {
      setError(res.error ?? 'Failed to send code');
      return;
    }
    setNotice('We sent a 6-digit code to your phone.');
    setStep('otp');
  };

  const handleVerifyOtp = async () => {
    setError(null);
    setBusy(true);
    const res = await verifyPhoneOtp(phone, otp);
    setBusy(false);
    if (!res.ok) {
      setError(res.error ?? 'Invalid code');
      return;
    }
    router.replace('/account');
  };

  return (
    <div className="min-h-screen bg-ink-950 flex flex-col">
      <Navbar />

      <section className="flex-1 pt-32 pb-16 px-6">
        <div className="max-w-md mx-auto">
          <Link
            href="/turfs"
            className="inline-flex items-center gap-1 text-ink-400 hover:text-lime-400 text-sm mb-6"
          >
            <ArrowLeft size={14} /> Back to turfs
          </Link>

          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck size={18} className="text-lime-400" />
            <p className="text-lime-400 text-xs font-bold tracking-widest uppercase">
              Sign in
            </p>
          </div>
          <h1 className="text-paper font-display font-bold text-3xl tracking-tight mb-2">
            {step === 'phone' ? 'Welcome back.' : 'Enter your code.'}
          </h1>
          <p className="text-ink-400 mb-6">
            {step === 'phone'
              ? 'Sign in to see your bookings. Booking still works without an account.'
              : `We sent a 6-digit code to ${phone}.`}
          </p>

          <div className="bg-ink-900 border border-ink-700/60 rounded-2xl p-5">
            {step === 'phone' && (
              <>
                <label className="block text-ink-300 text-[11px] font-bold tracking-widest uppercase mb-1.5">
                  Phone
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500 pointer-events-none">
                    <Phone size={16} />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1XXX XXXXXX"
                    autoComplete="tel"
                    className="w-full bg-ink-950 border border-ink-700 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 outline-none rounded-lg py-3 pl-10 pr-4 text-paper placeholder:text-ink-600 transition-colors"
                  />
                </div>
                <p className="text-ink-500 text-[11px] mt-2">
                  We&apos;ll text you a 6-digit code. Standard SMS rates apply.
                </p>
                <Button
                  onClick={handleSendOtp}
                  disabled={busy || phone.trim().length < 6}
                  size="lg"
                  className="w-full justify-center mt-4"
                >
                  {busy ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Sending…
                    </>
                  ) : (
                    <>
                      Send code <ArrowRight size={16} />
                    </>
                  )}
                </Button>
              </>
            )}

            {step === 'otp' && (
              <>
                <label className="block text-ink-300 text-[11px] font-bold tracking-widest uppercase mb-1.5">
                  6-digit code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full bg-ink-950 border border-ink-700 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 outline-none rounded-lg py-3 px-4 text-paper text-center font-display font-bold text-2xl tracking-[0.5em] placeholder:text-ink-700"
                />
                <div className="flex items-center justify-between mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('phone');
                      setOtp('');
                      setError(null);
                      setNotice(null);
                    }}
                    className="text-ink-400 hover:text-paper text-xs"
                  >
                    Change number
                  </button>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={busy}
                    className="text-lime-400 hover:text-lime-300 text-xs font-bold"
                  >
                    Resend code
                  </button>
                </div>
                <Button
                  onClick={handleVerifyOtp}
                  disabled={busy || otp.length !== 6}
                  size="lg"
                  className="w-full justify-center mt-4"
                >
                  {busy ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Verifying…
                    </>
                  ) : (
                    <>Verify &amp; sign in</>
                  )}
                </Button>
              </>
            )}

            {notice && !error && (
              <p className="mt-3 text-lime-400 text-xs">{notice}</p>
            )}
            {error && (
              <p className="mt-3 text-red-400 text-xs bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
          </div>

          <p className="text-ink-500 text-xs text-center mt-6">
            Don&apos;t want an account? You can still book — go to{' '}
            <Link href="/turfs" className="text-lime-400 hover:underline">
              /turfs
            </Link>
            .
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
