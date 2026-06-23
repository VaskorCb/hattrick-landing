"use client";

import { useEffect, useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { Button } from '../Button';
import { StarRatingInput } from './StarRating';
import { fetchMyReviewForBooking, submitReview } from '@/lib/queries';

interface ReviewFormProps {
  bookingId: string;
  onDone: () => void;
}

// Inline form rendered under a past booking on /account. Loads any existing
// review to prefill, lets the user rate + comment, then submits via the
// submit_review RPC.
export function ReviewForm({ bookingId, onDone }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMyReviewForBooking(bookingId)
      .then((r) => {
        if (r) {
          setRating(r.rating);
          setComment(r.comment ?? '');
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [bookingId]);

  const handleSubmit = async () => {
    if (rating < 1) {
      setError('Pick at least 1 star');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await submitReview(bookingId, rating, comment.trim() || null);
      onDone();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-3 p-3 bg-ink-950/60 rounded-xl border border-ink-700/60 flex items-center gap-2 text-ink-400 text-sm">
        <Loader2 size={14} className="animate-spin" />
        Loading…
      </div>
    );
  }

  return (
    <div className="mt-3 p-4 bg-ink-950/60 rounded-xl border border-lime-500/30">
      <p className="text-ink-300 text-[11px] font-bold tracking-widest uppercase mb-2">
        How was the experience?
      </p>
      <StarRatingInput value={rating} onChange={setRating} size={26} />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Anything you'd want others to know? (optional)"
        rows={3}
        className="mt-3 w-full bg-ink-900 border border-ink-700/60 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 outline-none rounded-lg p-3 text-paper placeholder:text-ink-600 text-sm transition-colors resize-none"
      />
      {error && <p className="mt-2 text-red-300 text-xs">{error}</p>}
      <div className="flex justify-end gap-2 mt-3">
        <button
          type="button"
          onClick={onDone}
          className="px-3 py-2 text-ink-400 hover:text-paper text-xs font-bold tracking-widest uppercase"
        >
          Cancel
        </button>
        <Button size="sm" onClick={handleSubmit} disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 size={12} className="animate-spin" /> Saving
            </>
          ) : (
            <>
              <Send size={12} /> Submit review
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
