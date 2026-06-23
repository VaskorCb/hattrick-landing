"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "../Button";

export function FinalCTA() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative rounded-[2.5rem] p-12 md:p-20 text-center overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse at center top, rgba(132, 204, 22, 0.18), transparent 70%), linear-gradient(180deg, #18181b, #0a0a0a)",
            border: "1px solid rgba(132, 204, 22, 0.25)",
          }}
        >
          <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-lime-500/10 blur-[120px] rounded-full" />

          <div className="relative">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-lime-500/10 border border-lime-500/30 mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
              <span className="text-xs font-medium text-lime-300 uppercase tracking-wider">
                Your turn
              </span>
            </motion.div>

            <h2 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05] text-balance">
              Your competition is{" "}
              <span className="text-ink-400">already digital.</span>
              <br />
              <span className="gradient-text">Catch up in 5 minutes.</span>
            </h2>

            <p className="mt-6 text-lg text-ink-300 max-w-xl mx-auto text-balance">
              30-day free trial. No credit card. Cancel anytime. Bangla support included.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" className="text-lg px-10 py-5">
                Start Free Trial <ArrowRight size={20} />
              </Button>
              <Button variant="ghost" size="lg">
                Talk to Founder
              </Button>
            </div>

            <p className="mt-8 text-xs text-ink-500 uppercase tracking-wider">
              Trusted by turfs in Sylhet · Dhaka · Chittagong · Khulna
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
