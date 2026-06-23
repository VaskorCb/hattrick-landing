"use client";

import { motion } from "framer-motion";

const turfs = [
  "Soccer Zone",
  "Futsal Arena",
  "Avalon Sports",
  "Goal Arena",
  "Sports Garden",
  "Is Sports",
  "Kick Off Turf",
  "Champions Arena",
];

export function LogosBar() {
  return (
    <section className="py-12 border-y border-ink-800/60 overflow-hidden">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center text-sm text-ink-400 uppercase tracking-wider mb-8 font-medium"
      >
        Loved by 50+ turfs across Bangladesh
      </motion.p>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-ink-900 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-ink-900 to-transparent z-10" />

        <div className="flex animate-marquee">
          {[...turfs, ...turfs].map((name, i) => (
            <div
              key={i}
              className="flex-shrink-0 px-10 py-2 flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-ink-800 border border-ink-700 flex items-center justify-center text-lime-400 text-xs font-bold">
                {name[0]}
              </div>
              <span className="text-xl font-display font-semibold text-ink-300 whitespace-nowrap">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
