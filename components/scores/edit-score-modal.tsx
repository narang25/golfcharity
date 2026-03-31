"use client";

import { useState } from "react";
import { Score } from "@/app/(dashboard)/scores/page";
import { FormInput } from "@/components/auth/form-input";

interface EditModalProps {
  score: Score | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditScoreModal({ score, onClose, onSuccess }: EditModalProps) {
  if (!score) return null;

  const [scoreValue, setScoreValue] = useState(score.score.toString());
  const [date, setDate] = useState(new Date(score.played_date).toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const maxDate = new Date().toISOString().split("T")[0];

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const parsedScore = parseInt(scoreValue, 10);
    if (isNaN(parsedScore) || parsedScore < 1 || parsedScore > 45) {
      setError("Score must be between 1 and 45.");
      setLoading(false);
      return;
    }

    if (date > maxDate) {
      setError("You cannot log a score in the future.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/scores/${score!.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: parsedScore, played_date: date })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to update score");
      }

      onSuccess(); // Triggers parent refetch and closes modal

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
        
        <button onClick={onClose} className="absolute top-6 right-6 text-stone-400 hover:text-stone-600">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <h3 className="text-xl font-bold font-serif text-emerald-950 mb-6">Edit Round</h3>

        <form onSubmit={handleUpdate} className="space-y-4">
          <FormInput
            id="edit_score"
            name="edit_score"
            type="number"
            label="Stableford Score"
            value={scoreValue}
            onChange={(e) => setScoreValue(e.target.value)}
            min="1"
            max="45"
            required
          />

          <FormInput
            id="edit_played_date"
            name="edit_played_date"
            type="date"
            label="Date Played"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={maxDate}
            required
          />

          {error && (
            <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-colors font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 rounded-xl text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 transition-colors shadow-sm font-medium text-sm"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
