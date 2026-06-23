"use client";

import { motion } from "framer-motion";
import { BookX, MessageCircleX, Wallet } from "lucide-react";
import { SectionHeader } from "../SectionHeader";

const pains = [
  {
    icon: BookX,
    title: "Khata pages full of crossed-out bookings",
    desc: "You can't search a paper notebook. You can't undo a mistake. And you can't go back when the customer says 'kintu ami to confirm korechilam'.",
  },
  {
    icon: MessageCircleX,
    title: "200 WhatsApp messages — still double bookings",
    desc: "Friday raat e phone er upor phone. One message gets missed, two teams show up for the same slot. Fight. Refund. Bad review.",
  },
  {
    icon: Wallet,
    title: "No idea how much you actually made",
    desc: "Cash, bKash, advance, refunds — by month-end nothing matches. Profit? Loss? Khata bole, kintu hisheb e bhul.",
  },
];

export function Problem() {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          eyebrow="The problem"
          title={
            <>
              Still managing your turf <span className="text-red-400">like this?</span>
            </>
          }
          subtitle="Every turf owner in Bangladesh fights the same three battles every single Friday night."
        />

        <div className="grid md:grid-cols-3 gap-6">
          {pains.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="relative p-8 rounded-2xl glass group hover:border-red-500/30 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <p.icon className="text-red-400" size={22} />
              </div>
              <h3 className="text-xl font-display font-bold mb-3 text-paper">
                {p.title}
              </h3>
              <p className="text-ink-400 leading-relaxed text-sm">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
