"use client";

import { useEffect, useState } from "react";
import { ScoreEntryForm } from "@/components/scores/score-entry-form";
import { ScoreList } from "@/components/scores/score-list";
import { EditScoreModal } from "@/components/scores/edit-score-modal";

import { Score } from "@/components/dashboard/dashboard-grid";

export default function ScoresPage() {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingScore, setEditingScore] = useState<Score | null>(null);

  const fetchScores = async () => {
    try {
      const res = await fetch("/api/scores");
      const data = await res.json();
      if (data.scores) {
        setScores(data.scores);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  const handleDelete = async (id: string) => {
    // Optimistic UI Drop
    setScores(prev => prev.filter(s => s.id !== id));
    await fetch(`/api/scores/${id}`, { method: "DELETE" });
  };

  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-serif font-bold text-emerald-950 mb-2">My Handicap Index</h1>
        <p className="text-emerald-800/60 max-w-2xl">Keep your rolling window updated. Your newest cards instantly bump your oldest entries off the list natively.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 items-start">
        
        {/* Entry Side */}
        <div className="sticky top-24">
          <ScoreEntryForm onScoreAdded={fetchScores} />
        </div>

        {/* List Side */}
        <div>
          <ScoreList 
            scores={scores} 
            loading={loading}
            onEdit={(score) => setEditingScore(score)}
            onDelete={handleDelete}
          />
        </div>

      </div>

      {editingScore && (
         <EditScoreModal
            score={editingScore}
            onClose={() => setEditingScore(null)}
            onSuccess={() => {
              setEditingScore(null);
              fetchScores();
            }}
         />
      )}
    </>
  );
}
