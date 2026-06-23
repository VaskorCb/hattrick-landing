"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({ eyebrow, title, subtitle, align = "center", className }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7 }}
      className={cn(
        "max-w-3xl mb-16",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow && (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-500/10 border border-lime-500/20 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-lime-400" />
          <span className="text-xs font-medium text-lime-300 uppercase tracking-wider">
            {eyebrow}
          </span>
        </div>
      )}
      <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight text-balance leading-[1.05]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-6 text-lg text-ink-300 text-balance leading-relaxed">{subtitle}</p>
      )}
    </motion.div>
  );
}
