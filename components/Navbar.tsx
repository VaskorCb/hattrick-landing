"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, User } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { useSession } from "@/lib/useSession";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Find a turf", href: "/turfs" },
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { session } = useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          scrolled
            ? "glass-strong border-b border-ink-700/40 py-3"
            : "bg-transparent py-5",
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="/" className="flex items-center">
            <Logo />
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-ink-300 hover:text-lime-400 transition-colors duration-200 relative group"
              >
                {l.label}
                <span className="absolute inset-x-0 -bottom-1 h-px bg-lime-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <Link
                href="/account"
                className="flex items-center gap-1.5 text-sm text-ink-300 hover:text-lime-400 transition-colors"
              >
                <User size={14} />
                My account
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-sm text-ink-300 hover:text-paper transition-colors"
              >
                Sign In
              </Link>
            )}
            <Button size="sm">
              Start Free Trial
              <ArrowRight size={16} />
            </Button>
          </div>

          <button
            className="md:hidden text-paper p-2"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-ink-950/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex items-center justify-between p-6">
              <Logo />
              <button
                className="text-paper p-2"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
            <motion.nav
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.06 } },
              }}
              className="flex flex-col px-6 mt-8 gap-6"
            >
              {navLinks.map((l) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    show: { opacity: 1, x: 0 },
                  }}
                  className="text-3xl font-display font-bold text-paper hover:text-lime-400"
                >
                  {l.label}
                </motion.a>
              ))}
              <div className="pt-6 flex flex-col gap-3">
                {session ? (
                  <Link href="/account" onClick={() => setMobileOpen(false)}>
                    <Button variant="secondary" size="lg" className="w-full justify-center">
                      <User size={16} /> My account
                    </Button>
                  </Link>
                ) : (
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="secondary" size="lg" className="w-full justify-center">
                      Sign In
                    </Button>
                  </Link>
                )}
                <Button size="lg">
                  Start Free Trial <ArrowRight size={18} />
                </Button>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
