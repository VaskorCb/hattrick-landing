"use client";

import { motion } from "framer-motion";

const slots = [
  ["paid", "paid", "unpaid", "available", "available", "available"],
  ["paid", "paid", "paid", "unpaid", "available", "blocked"],
  ["paid", "unpaid", "paid", "paid", "available", "available"],
  ["completed", "paid", "paid", "paid", "unpaid", "available"],
];

const styles: Record<string, string> = {
  paid: "bg-lime-500 text-ink-900",
  unpaid: "bg-ink-800 text-lime-400 border border-lime-500/40",
  available: "bg-ink-800/40 text-ink-500 border border-ink-700",
  blocked: "bg-red-500/15 text-red-400 border border-red-500/30",
  completed: "bg-ink-700 text-ink-300",
};

const labels: Record<string, string> = {
  paid: "✓",
  unpaid: "৳",
  available: "+",
  blocked: "✕",
  completed: "✓",
};

export function LiveBoardScreen() {
  return (
    <div className="w-full h-full flex flex-col bg-ink-950">
      <div className="px-4 pt-12 pb-3 flex items-center justify-between border-b border-ink-800">
        <div>
          <div className="text-[10px] text-ink-400 uppercase tracking-wider">Live Board</div>
          <div className="text-sm font-display font-bold text-paper">Today · Fri</div>
        </div>
        <div className="flex items-center gap-1.5">
          <motion.div
            animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-lime-400"
          />
          <span className="text-[10px] text-lime-400 font-medium uppercase tracking-wider">Live</span>
        </div>
      </div>

      <div className="px-4 py-3 flex items-center gap-2 border-b border-ink-800">
        {["Court A", "Court B", "Court C"].map((c, i) => (
          <div
            key={c}
            className={`px-2.5 py-1 rounded-md text-[10px] font-medium ${
              i === 0 ? "bg-lime-500 text-ink-900" : "bg-ink-800 text-ink-300"
            }`}
          >
            {c}
          </div>
        ))}
      </div>

      <div className="px-4 py-3 flex-1 overflow-hidden">
        <div className="grid grid-cols-6 gap-1.5 mb-2">
          {["6", "7", "8", "9", "10", "11"].map((h) => (
            <div key={h} className="text-[9px] text-ink-500 text-center">{h}pm</div>
          ))}
        </div>
        <div className="space-y-1.5">
          {slots.map((row, ri) => (
            <div key={ri} className="grid grid-cols-6 gap-1.5">
              {row.map((status, ci) => (
                <motion.div
                  key={ci}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + ri * 0.1 + ci * 0.03 }}
                  className={`h-10 rounded-md flex items-center justify-center text-sm font-bold ${styles[status]}`}
                >
                  {labels[status]}
                </motion.div>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 rounded-xl bg-ink-800/60 border border-lime-500/20">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-ink-400 uppercase tracking-wider">Today&apos;s revenue</span>
            <span className="text-[10px] text-lime-400">+18%</span>
          </div>
          <div className="text-xl font-display font-bold text-paper">৳ 24,500</div>
        </div>
      </div>
    </div>
  );
}
