"use client";

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  value: number;          // 0..5 (can be decimal)
  size?: number;
  className?: string;
}

// Display-only star rating. Renders 5 stars filled proportionally to `value`.
export function StarRating({ value, size = 14, className }: StarRatingProps) {
  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = Math.min(1, Math.max(0, value - i));
        return (
          <div key={i} className="relative" style={{ width: size, height: size }}>
            <Star size={size} className="text-ink-700" strokeWidth={1.5} />
            {filled > 0 && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${filled * 100}%` }}
              >
                <Star
                  size={size}
                  className="text-lime-400 fill-lime-400"
                  strokeWidth={1.5}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Interactive star input used in the review submit form.
export function StarRatingInput({
  value,
  onChange,
  size = 28,
}: {
  value: number;
  onChange: (next: number) => void;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const n = i + 1;
        const filled = value >= n;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange(n)}
            className="p-1 transition-transform hover:scale-110"
            aria-label={`${n} star`}
          >
            <Star
              size={size}
              className={filled ? 'text-lime-400 fill-lime-400' : 'text-ink-600 hover:text-lime-400'}
              strokeWidth={1.5}
            />
          </button>
        );
      })}
    </div>
  );
}
