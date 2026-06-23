"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  asChild?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-lime-500 text-ink-900 hover:bg-lime-400 hover:shadow-[0_0_40px_rgba(132,204,22,0.5)] font-semibold",
  secondary:
    "bg-ink-800 text-paper border border-ink-700 hover:border-lime-500/40 hover:bg-ink-700",
  ghost:
    "bg-transparent text-paper hover:bg-ink-800/50 border border-transparent hover:border-ink-700",
};

const sizes = {
  sm: "px-4 py-2 text-sm rounded-lg",
  md: "px-6 py-3 text-base rounded-xl",
  lg: "px-8 py-4 text-lg rounded-xl",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:ring-offset-2 focus:ring-offset-ink-900",
        variants[variant],
        sizes[size],
        className,
      )}
      {...(rest as React.ComponentProps<typeof motion.button>)}
    >
      {children}
    </motion.button>
  );
}
