import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-lime-500/40 blur-md" />
        <svg
          width="28"
          height="28"
          viewBox="0 0 32 32"
          fill="none"
          className="relative"
        >
          <circle cx="16" cy="16" r="14" fill="#0a0a0a" stroke="#84cc16" strokeWidth="2" />
          <path
            d="M16 6L19 12L25 13L20.5 17L22 23L16 20L10 23L11.5 17L7 13L13 12L16 6Z"
            fill="#84cc16"
          />
        </svg>
      </div>
      <span className="font-display font-bold text-xl tracking-tight">
        Hat<span className="text-lime-400">Trick</span>
      </span>
    </div>
  );
}
