"use client";

import { motion } from "framer-motion";
import { TrendingUp, Calendar, Users } from "lucide-react";

const bars = [38, 55, 42, 68, 60, 82, 95];

export function DashboardScreen() {
  return (
    <div className="w-full h-full flex flex-col bg-ink-950 p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-[10px] text-ink-400 uppercase tracking-wider">Admin Dashboard</div>
          <div className="text-sm font-display font-bold text-paper">Today</div>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-lime-400">
          <TrendingUp size={11} />
          <span>+24% vs yesterday</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { l: "Bookings", v: "47", c: "lime-400", i: Calendar },
          { l: "Revenue", v: "৳41k", c: "paper", i: TrendingUp },
          { l: "Customers", v: "32", c: "paper", i: Users },
        ].map(({ l, v, c, i: Icon }) => (
          <div key={l} className="bg-ink-800/60 rounded-lg p-2 border border-ink-700">
            <Icon size={10} className="text-ink-400 mb-1" />
            <div className={`text-sm font-bold text-${c}`}>{v}</div>
            <div className="text-[8px] text-ink-400 uppercase">{l}</div>
          </div>
        ))}
      </div>

      <div className="bg-ink-800/40 rounded-lg p-3 border border-ink-700 flex-1">
        <div className="text-[9px] text-ink-400 uppercase mb-2 tracking-wider">Weekly revenue</div>
        <div className="flex items-end gap-1.5 h-20">
          {bars.map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ duration: 0.8, delay: 0.3 + i * 0.08, ease: "easeOut" }}
              className={`flex-1 rounded-t ${i === bars.length - 1 ? "bg-lime-500" : "bg-ink-700"}`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[8px] text-ink-500 mt-1">
          {"SMTWTFS".split("").map((d, i) => <span key={i}>{d}</span>)}
        </div>
      </div>
    </div>
  );
}
