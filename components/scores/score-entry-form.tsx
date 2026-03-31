"use client";

import { useState } from "react";
import { FormInput } from "@/components/auth/form-input";
import { SubmitButton } from "@/components/auth/submit-button";
import { toast } from "sonner";

export function ScoreEntryForm({ onScoreAdded, scoreCount = 0 }: { onScoreAdded: () => void, scoreCount?: number }) {
  const [score, setScore] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Strict ISO today string for date picker MAX prop
  const maxDate = new Date().toISOString().split("T")[0];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const parsedScore = parseInt(score, 10);
    if (isNaN(parsedScore) || parsedScore < 1 || parsedScore > 45) {
      toast.error("Score must be between 1 and 45.");
      setLoading(false);
      return;
    }

    if (date > maxDate) {
      toast.error("You cannot log a score in the future.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: parsedScore, played_date: date })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to save score");
      }

      setScore("");
      toast.success("Score locked in successfully! Rolling window updated.");
      onScoreAdded(); // Trigger list refresh

    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white border border-emerald-100 rounded-3xl p-8 shadow-sm">
      <h2 className="text-xl font-bold font-serif text-emerald-950 mb-2">Log New Score</h2>
      <p className="text-sm text-emerald-800/60 mb-6">Enter your latest Stableford points to keep your rolling window updated.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {scoreCount >= 5 && (
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2 mb-4">
            <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            <p className="text-xs text-amber-900 leading-snug font-medium">
              You are at maximum capacity (5 scores). Logging this new score will automatically drop your oldest active score.
            </p>
          </div>
        )}
        
        <FormInput
          id="score"
          name="score"
          type="number"
          label="Stableford Score (1-45)"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          min="1"
          max="45"
          required
        />

        <FormInput
          id="played_date"
          name="played_date"
          type="date"
          label="Date Played"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={maxDate}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-2xl text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 transition-colors shadow-sm"
        >
          {loading ? "Saving..." : "Lock in Score"}
        </button>
      </form>
    </div>
  );
}
