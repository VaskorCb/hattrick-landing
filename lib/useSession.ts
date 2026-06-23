"use client";

import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

// Reactive Supabase session hook. Returns null on first render (before the
// initial getSession promise resolves) and undefined never — the consumer
// can rely on `session === null` to mean "checked, not signed in".
//
// `loading` is true only on the very first render before the initial fetch
// settles.
export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
      setLoading(false);
    });
    const sub = supabase.auth.onAuthStateChange((_event, s) => {
      if (mounted) setSession(s ?? null);
    });
    return () => {
      mounted = false;
      sub.data.subscription.unsubscribe();
    };
  }, []);

  return { session, loading, user: session?.user ?? null };
}
