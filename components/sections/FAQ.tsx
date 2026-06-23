"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { SectionHeader } from "../SectionHeader";

const faqs = [
  {
    q: "I'm not tech-savvy. Can I really use this?",
    a: "If you can use WhatsApp, you can use HatTrick. The interface is built around tap-and-go workflows in both Bangla and English. We'll personally onboard you over a 30-minute video call and walk through your specific setup.",
  },
  {
    q: "Does it work without internet?",
    a: "Yes — the staff app caches everything locally. If your wifi drops mid-shift, bookings still save and sync the moment you're back online. Your turf doesn't stop because the internet did.",
  },
  {
    q: "Can my staff use it on their own phone?",
    a: "Absolutely. Each staff member gets their own login. They use their own phone or a shared counter tablet — and every action is logged so you always know who did what.",
  },
  {
    q: "How do I migrate from khata or Excel?",
    a: "Send us your existing bookings spreadsheet — we'll import customer history, bookings, and outstanding payments for free during your trial. Your khata stays for sentiment, but you'll never need it again.",
  },
  {
    q: "What happens if I cancel?",
    a: "Your data is yours. Export everything to Excel/CSV anytime with one click. Cancel from inside the app — no phone calls, no retention pressure, no surprises.",
  },
  {
    q: "বাংলা support আছে?",
    a: "অবশ্যই। পুরো app বাংলায় available — staff toggle করতে পারবে এক click এ। Support team ও বাংলায় কথা বলে (WhatsApp, phone, email)। সিলেটি বুঝি ভাল 😉",
  },
];

export function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 md:py-32 relative">
      <div className="max-w-3xl mx-auto px-6">
        <SectionHeader
          eyebrow="Questions"
          title={
            <>
              Everything you want to <span className="gradient-text">ask first.</span>
            </>
          }
          subtitle="Still unsure? WhatsApp us — we reply in under an hour during business time."
        />

        <div className="space-y-3">
          {faqs.map((f, i) => {
            const open = openIdx === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className={`rounded-2xl glass overflow-hidden transition-all ${
                  open ? "border-lime-500/40" : ""
                }`}
              >
                <button
                  onClick={() => setOpenIdx(open ? null : i)}
                  className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left"
                >
                  <span className="font-display font-semibold text-paper text-base md:text-lg">
                    {f.q}
                  </span>
                  <motion.div
                    animate={{ rotate: open ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center ${
                      open
                        ? "bg-lime-500 border-lime-500 text-ink-900"
                        : "border-ink-700 text-ink-300"
                    }`}
                  >
                    <Plus size={16} />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-ink-300 leading-relaxed">
                        {f.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
