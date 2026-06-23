"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { SectionHeader } from "../SectionHeader";

const testimonials = [
  {
    bn: "আগে দিনে ৩-৪টা ডাবল বুকিং হতো। HatTrick এর পর zero। আমার staff এখন phone এ না, customer এর সাথে কথা বলে।",
    en: "We used to have 3-4 double bookings a day. After HatTrick? Zero. My staff now talks to customers, not their phones.",
    name: "Imran Ahmed",
    role: "Owner · Goal Arena, Sylhet",
    initial: "I",
  },
  {
    bn: "৩ মাসে আমার revenue ৩৫% বেড়েছে। আগে জানতাম না কোন slot সবচেয়ে profitable। এখন সব data হাতে।",
    en: "Revenue jumped 35% in 3 months. I had no idea which slots were profitable. Now I have all the data.",
    name: "Rakib Hossain",
    role: "Manager · Kick Off Turf",
    initial: "R",
  },
  {
    bn: "Setup এ ১০ মিনিট লেগেছে। আমার counter staff (বয়স ৪৫) এক ঘন্টায় শিখে গেছে। বাংলা interface থাকায় কাজ অনেক সহজ।",
    en: "Setup took 10 minutes. My 45-year-old counter staff learned it in an hour. The Bangla interface makes everything easier.",
    name: "Tanvir Khan",
    role: "Owner · Champions Arena, Dhaka",
    initial: "T",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          eyebrow="Testimonials"
          title={
            <>
              Turf owners are <span className="gradient-text">talking.</span>
            </>
          }
          subtitle="Real owners. Real numbers. Real loud Friday-night-free weekends."
        />

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="p-8 rounded-2xl glass relative hover:border-lime-500/30 transition-all"
            >
              <Quote
                className="absolute top-6 right-6 text-lime-500/30"
                size={32}
              />

              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={14} className="fill-lime-400 text-lime-400" />
                ))}
              </div>

              <p className="text-paper font-medium leading-relaxed mb-3 text-base">
                &ldquo;{t.bn}&rdquo;
              </p>
              <p className="text-ink-400 text-sm leading-relaxed italic mb-6">
                &mdash; {t.en}
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-ink-800">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-lime-400 to-lime-600 flex items-center justify-center text-ink-900 font-bold text-lg">
                  {t.initial}
                </div>
                <div>
                  <div className="text-paper font-semibold text-sm">{t.name}</div>
                  <div className="text-ink-400 text-xs">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
