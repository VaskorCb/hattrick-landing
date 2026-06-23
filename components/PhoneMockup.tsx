"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PhoneMockupProps {
  children: ReactNode;
  className?: string;
  tilt?: number;
  delay?: number;
}

export function PhoneMockup({ children, className, tilt = 0, delay = 0 }: PhoneMockupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: tilt - 5 }}
      animate={{ opacity: 1, y: 0, rotate: tilt }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn("relative", className)}
      style={{ transformStyle: "preserve-3d" }}
    >
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay }}
        className="relative"
      >
        <div className="absolute inset-0 bg-lime-500/20 blur-3xl scale-90 -z-10" />
        <div className="relative w-[280px] h-[580px] rounded-[44px] bg-gradient-to-b from-ink-700 to-ink-900 p-2 shadow-2xl border border-ink-700">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-ink-900 rounded-b-2xl z-10" />
          <div className="w-full h-full rounded-[36px] overflow-hidden bg-ink-950 relative">
            {children}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function TabletMockup({ children, className, tilt = 0, delay = 0 }: PhoneMockupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: tilt - 3 }}
      animate={{ opacity: 1, y: 0, rotate: tilt }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn("relative", className)}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay }}
        className="relative"
      >
        <div className="absolute inset-0 bg-lime-500/15 blur-3xl scale-90 -z-10" />
        <div className="relative w-[440px] h-[300px] rounded-2xl bg-gradient-to-b from-ink-700 to-ink-900 p-2 shadow-2xl border border-ink-700">
          <div className="w-full h-full rounded-xl overflow-hidden bg-ink-950 relative">
            {children}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
