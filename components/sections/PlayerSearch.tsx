"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Search } from "lucide-react";
import { Button } from "../Button";
import { fetchCities } from "@/lib/queries";

// Big customer-facing entry to the booking portal. Lives on the homepage
// right after the Hero so players don't get lost in the owner-pitch copy.
// The search field deep-links into /turfs?q=… so anything typed here is
// already applied as a filter on the browse page.
export function PlayerSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    fetchCities()
      .then((list) => setCities(list.slice(0, 6)))
      .catch(() => setCities([]));
  }, []);

  const submit = (search?: string) => {
    const value = (search ?? q).trim();
    const href = value ? `/turfs?q=${encodeURIComponent(value)}` : "/turfs";
    router.push(href);
  };

  return (
    <section id="play" className="relative py-16 md:py-24 border-t border-ink-800/60">
      <div className="absolute inset-0 bg-gradient-to-b from-lime-500/5 to-transparent pointer-events-none" />
      <div className="max-w-5xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <p className="text-lime-400 text-xs font-bold tracking-widest uppercase mb-3">
            For players
          </p>
          <h2 className="text-paper font-display font-bold text-4xl md:text-5xl tracking-tight">
            Looking for a turf?{" "}
            <span className="gradient-text">Find one near you.</span>
          </h2>
          <p className="text-ink-300 mt-3 max-w-2xl mx-auto">
            Search across every listed indoor turf. Live slot availability — book in 60 seconds, no
            account needed.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-ink-900/80 backdrop-blur border border-ink-700/60 rounded-2xl p-3 md:p-4 flex flex-col md:flex-row gap-3 items-stretch"
        >
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none">
              <Search size={18} />
            </div>
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
              placeholder="Search by city, area, or turf name…"
              className="w-full bg-ink-950 border border-ink-700/60 focus:border-lime-500/60 focus:ring-2 focus:ring-lime-500/20 outline-none rounded-xl py-4 pl-12 pr-4 text-paper placeholder:text-ink-500 transition-colors"
            />
          </div>
          <Button size="lg" onClick={() => submit()} className="md:w-auto justify-center">
            Find a turf <ArrowRight size={18} />
          </Button>
        </motion.div>

        {cities.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-5 flex items-center justify-center gap-2 flex-wrap"
          >
            <span className="text-ink-500 text-xs font-bold uppercase tracking-widest flex items-center gap-1">
              <MapPin size={12} /> Popular cities:
            </span>
            {cities.map((c) => (
              <button
                key={c}
                onClick={() => submit(c)}
                className="px-3 py-1.5 rounded-full bg-ink-900 border border-ink-700 hover:border-lime-500/60 hover:text-lime-400 text-ink-300 text-xs font-bold transition-colors"
              >
                {c}
              </button>
            ))}
          </motion.div>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/turfs"
            className="text-ink-400 hover:text-lime-400 text-sm font-bold tracking-widest uppercase transition-colors"
          >
            Or browse all turfs →
          </Link>
        </div>
      </div>
    </section>
  );
}
