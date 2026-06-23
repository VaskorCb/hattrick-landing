"use client";

import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
}

// Single search field — matches by ground name, venue, city, or area.
// Lives at the top of /turfs, behaves as a controlled component.
export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none">
        <Search size={18} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? 'Search by ground, venue, city, or area…'}
        className="w-full bg-ink-900 border border-ink-700/60 focus:border-lime-500/60 focus:ring-2 focus:ring-lime-500/20 outline-none rounded-2xl py-4 pl-12 pr-12 text-paper placeholder:text-ink-500 transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full text-ink-400 hover:text-paper hover:bg-ink-800 flex items-center justify-center transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
