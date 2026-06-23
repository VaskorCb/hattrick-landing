"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Users,
  BarChart3,
  Ticket,
  ShieldCheck,
  Languages,
  Sparkles,
} from "lucide-react";
import { SectionHeader } from "../SectionHeader";
import { LiveBoardScreen } from "../LiveBoardScreen";
import { DashboardScreen } from "../DashboardScreen";

export function Features() {
  return (
    <section id="features" className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          eyebrow="The solution"
          title={
            <>
              One app. <span className="gradient-text">Every part</span> of your turf.
            </>
          }
          subtitle="From the slot grid to the cash drawer — HatTrick replaces the khata, the WhatsApp chaos, and the Excel sheet."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[280px]">
          {/* Live Board — large 2x2 */}
          <FeatureCard className="md:col-span-2 md:row-span-2 md:h-auto">
            <div className="flex flex-col h-full">
              <div className="mb-4">
                <Badge>
                  <Activity size={12} /> LIVE BOARD
                </Badge>
                <h3 className="mt-4 text-3xl font-display font-bold text-paper">
                  See every slot, every court,{" "}
                  <span className="text-lime-400">in real time.</span>
                </h3>
                <p className="mt-3 text-ink-400 max-w-md">
                  Color-coded by status: paid (lime), unpaid (ink), blocked, completed.
                  Updates the moment a staff member touches the booking — no refresh needed.
                </p>
              </div>
              <div className="relative flex-1 mt-4 -mb-4 -mr-4 rounded-xl overflow-hidden border border-ink-700 bg-ink-950">
                <div className="absolute inset-0">
                  <LiveBoardScreen />
                </div>
              </div>
            </div>
          </FeatureCard>

          <FeatureCard>
            <Badge>
              <Users size={12} /> WALK-IN
            </Badge>
            <h3 className="mt-4 text-2xl font-display font-bold text-paper">
              Phone-lookup booking
            </h3>
            <p className="mt-2 text-ink-400 text-sm leading-relaxed">
              Type a phone number — returning customer&apos;s info auto-fills in
              2 seconds. Walk-in done in 30 seconds.
            </p>
          </FeatureCard>

          <FeatureCard>
            <Badge>
              <Languages size={12} /> BANGLA
            </Badge>
            <h3 className="mt-4 text-2xl font-display font-bold text-paper">
              Full Bangla interface
            </h3>
            <p className="mt-2 text-ink-400 text-sm leading-relaxed">
              আপনার staff বাংলা তে comfortable? এক click এ পুরো app বাংলা — every screen, every button.
            </p>
          </FeatureCard>

          {/* Dashboard — large 2x1 */}
          <FeatureCard className="md:col-span-2">
            <div className="grid grid-cols-2 gap-5 h-full items-center">
              <div>
                <Badge>
                  <BarChart3 size={12} /> ANALYTICS
                </Badge>
                <h3 className="mt-4 text-2xl font-display font-bold text-paper">
                  Today&apos;s revenue, peak hours, profit/loss — at a glance.
                </h3>
                <p className="mt-2 text-ink-400 text-sm">
                  Monthly reports, expense tracking, shift cash reconciliation, audit log — all built in.
                </p>
              </div>
              <div className="relative h-full rounded-xl overflow-hidden border border-ink-700 bg-ink-950 min-h-[220px]">
                <div className="absolute inset-0">
                  <DashboardScreen />
                </div>
              </div>
            </div>
          </FeatureCard>

          <FeatureCard>
            <Badge>
              <Ticket size={12} /> COUPONS
            </Badge>
            <h3 className="mt-4 text-2xl font-display font-bold text-paper">
              Discounts & Teams
            </h3>
            <p className="mt-2 text-ink-400 text-sm leading-relaxed">
              Run promo codes (% or flat) with usage limits. Let regular teams
              save their lineup for one-tap booking.
            </p>
          </FeatureCard>

          <FeatureCard>
            <Badge>
              <ShieldCheck size={12} /> AUDIT LOG
            </Badge>
            <h3 className="mt-4 text-2xl font-display font-bold text-paper">
              Staff with accountability
            </h3>
            <p className="mt-2 text-ink-400 text-sm leading-relaxed">
              Every staff has their own login. Every change is logged: who, what, when. End-of-shift cash declaration built in.
            </p>
          </FeatureCard>

          <FeatureCard className="md:col-span-1">
            <Badge>
              <Sparkles size={12} /> COMING SOON
            </Badge>
            <h3 className="mt-4 text-2xl font-display font-bold text-paper">
              bKash, Nagad & WhatsApp
            </h3>
            <p className="mt-2 text-ink-400 text-sm leading-relaxed">
              Customers pay advance online. Auto WhatsApp reminders. Pro plan only.
            </p>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`relative p-6 md:p-8 rounded-2xl glass group hover:border-lime-500/30 transition-all overflow-hidden ${className ?? ""}`}
    >
      {children}
    </motion.div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-lime-500/10 border border-lime-500/20 text-[10px] font-bold tracking-wider text-lime-300 uppercase">
      {children}
    </div>
  );
}
