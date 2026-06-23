"use client";

import { motion } from "framer-motion";
import { Check, Zap, Sparkles } from "lucide-react";
import { SectionHeader } from "../SectionHeader";
import { Button } from "../Button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free Trial",
    price: "৳0",
    period: "/30 days",
    desc: "Try every Pro feature, free for 30 days.",
    cta: "Start Free",
    highlight: false,
    icon: null,
    features: [
      "Full Pro feature access",
      "1 court · unlimited bookings",
      "Staff accounts",
      "Reports & analytics",
      "Email support",
    ],
  },
  {
    name: "Basic",
    price: "৳500",
    period: "/month",
    desc: "Everything most turfs need to ditch the khata for good.",
    cta: "Start 30-Day Trial",
    highlight: true,
    badge: "Most Popular",
    icon: Zap,
    features: [
      "Unlimited courts",
      "Unlimited staff accounts",
      "Coupons & expense tracking",
      "All reports & analytics",
      "Bangla + English UI",
      "Priority email support",
    ],
  },
  {
    name: "Pro",
    price: "৳650",
    period: "/month",
    desc: "Online payments + automated customer communication.",
    cta: "Go Pro",
    highlight: false,
    icon: Sparkles,
    features: [
      "Everything in Basic",
      "bKash / Nagad online payments",
      "WhatsApp customer notifications",
      "Push notifications",
      "Online booking link (share & book)",
      "Priority phone support",
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          eyebrow="Pricing"
          title={
            <>
              Plans that pay for themselves in <span className="gradient-text">one weekend.</span>
            </>
          }
          subtitle="Most turfs save 12+ hours a week and prevent 4-6 double bookings/month. Math kore dekhen — ৳500 e ki ase ar ki ase na."
        />

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={cn(
                  "relative p-8 rounded-3xl flex flex-col",
                  plan.highlight
                    ? "glass-strong border-2 border-lime-500/40 glow-lime md:scale-105"
                    : "glass",
                )}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-lime-500 text-ink-900 text-xs font-bold uppercase tracking-wider">
                    {plan.badge}
                  </div>
                )}

                <div className="flex items-center gap-2 mb-2">
                  {Icon && <Icon size={18} className="text-lime-400" />}
                  <h3 className="text-xl font-display font-bold text-paper">
                    {plan.name}
                  </h3>
                </div>

                <p className="text-sm text-ink-400 leading-relaxed min-h-[40px]">
                  {plan.desc}
                </p>

                <div className="mt-6 mb-6 flex items-baseline gap-1">
                  <span className="text-5xl font-display font-bold text-paper">
                    {plan.price}
                  </span>
                  <span className="text-ink-400 text-sm">{plan.period}</span>
                </div>

                <Button
                  variant={plan.highlight ? "primary" : "secondary"}
                  className="w-full"
                >
                  {plan.cta}
                </Button>

                <div className="mt-8 pt-8 border-t border-ink-800 space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-lime-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check size={12} className="text-lime-400" />
                      </div>
                      <span className="text-sm text-ink-200 leading-relaxed">{f}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center text-sm text-ink-400"
        >
          Annual: <span className="text-lime-400 font-semibold">2 months free</span> · Cancel anytime · ৳0 setup fee
        </motion.p>
      </div>
    </section>
  );
}
