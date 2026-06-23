"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, Search, ShieldCheck } from "lucide-react";
import { Button } from "../Button";
import { PhoneMockup, TabletMockup } from "../PhoneMockup";
import { LiveBoardScreen } from "../LiveBoardScreen";
import { DashboardScreen } from "../DashboardScreen";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center relative">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-lime-500/10 border border-lime-500/20 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
            <span className="text-xs font-medium text-lime-300 uppercase tracking-wider">
              Built for Bangladesh · 🇧🇩
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight text-balance"
          >
            Run your turf like{" "}
            <span className="gradient-text">Premier League.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 text-lg md:text-xl text-ink-300 max-w-xl leading-relaxed text-balance"
          >
            The booking, payments, and staff management app trusted by indoor
            football turfs across Bangladesh. Stop losing money to double
            bookings.{" "}
            <span className="text-paper font-semibold">Start growing.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Button size="lg">
              Start 30-Day Free Trial <ArrowRight size={18} />
            </Button>
            <Button variant="ghost" size="lg">
              <Play size={18} /> Watch 2-min Demo
            </Button>
          </motion.div>

          {/* Secondary path for players (the customer audience). */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-6"
          >
            <Link
              href="/turfs"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ink-900/60 border border-ink-700/60 hover:border-lime-500/60 hover:bg-lime-500/5 transition-colors group"
            >
              <Search size={14} className="text-lime-400" />
              <span className="text-sm text-ink-200">
                Just want to play?{" "}
                <span className="text-lime-400 font-bold group-hover:underline">Find a turf →</span>
              </span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-400"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-lime-400" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-lime-400" />
              Setup in 5 minutes
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-lime-400" />
              ৳500/mo after trial
            </div>
          </motion.div>
        </div>

        <div className="relative h-[600px] flex items-center justify-center">
          <div className="absolute top-1/4 -right-12 hidden lg:block">
            <TabletMockup tilt={-6} delay={0.6}>
              <DashboardScreen />
            </TabletMockup>
          </div>
          <div className="relative z-10 lg:absolute lg:left-4 lg:top-8">
            <PhoneMockup tilt={6} delay={0.3}>
              <LiveBoardScreen />
            </PhoneMockup>
          </div>
        </div>
      </div>
    </section>
  );
}
