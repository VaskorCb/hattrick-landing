// Amount stored in paise (smallest unit). Format as ৳ for BDT-style display.
export function formatCurrency(amountInPaise: number): string {
  const value = amountInPaise / 100;
  return `৳${value.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

// "06:00" → "6:00 AM"
export function formatTime(time: string): string {
  const [hStr, mStr] = time.split(':');
  const h = Number(hStr);
  const m = Number(mStr);
  const period = h >= 12 ? 'PM' : 'AM';
  const display = h % 12 || 12;
  const pad = String(m).padStart(2, '0');
  return `${display}:${pad} ${period}`;
}

// "2026-06-25" → "25 Jun 2026"
export function formatDate(date: string): string {
  const d = new Date(date + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// "2026-06-25" → "Thu, 25 Jun"
export function formatDateShort(date: string): string {
  const d = new Date(date + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

// Today's YYYY-MM-DD in local time.
export function todayLocal(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Today + N days as YYYY-MM-DD in local time.
export function todayPlusLocal(days: number): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
