"use client";

import { useEffect, useState } from "react";
import { SubscriptionCard } from "./subscription-card";
import { CharityCard } from "./charity-card";
import { ParticipationCard } from "./participation-card";
import { WinningsCard } from "./winnings-card";
import { ScoreEntryForm } from "../scores/score-entry-form";
import { ScoreList } from "../scores/score-list";
import { EditScoreModal } from "../scores/edit-score-modal";
export interface Score {
  id: string;
  played_date: string;
  score: number;
  created_at: string;
}

interface DashboardData {
  subscription: any;
  charity: any;
  scores: any;
  winnings: any;
  participation: any;
}

export function DashboardGrid({ isAdmin }: { isAdmin?: boolean }) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // Scores State mirroring the /scores layout
  const [scores, setScores] = useState<Score[]>([]);
  const [scoresLoading, setScoresLoading] = useState(true);
  const [editingScore, setEditingScore] = useState<Score | null>(null);

  const fetchDashboardStats = async () => {
    try {
      const res = await fetch("/api/dashboard/stats");
      const json = await res.json();
      setData(json);
    } catch {
      console.error("Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  const fetchScoresState = async () => {
    try {
      const res = await fetch("/api/scores");
      const json = await res.json();
      if (json.scores) setScores(json.scores);
    } catch {
      console.error("Failed to load scores");
    } finally {
      setScoresLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    fetchScoresState();
  }, []);

  const handleScoreDeleted = async (id: string) => {
    setScores(prev => prev.filter(s => s.id !== id));
    await fetch(`/api/scores/${id}`, { method: "DELETE" });
  };

  const handleScoreAddedOrEdited = () => {
    fetchScoresState(); // Sync list
    fetchDashboardStats(); // Resync score counts in stats object
  };

  if (loading || !data) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-end mb-6">
          <div className="space-y-3">
             <div className="h-10 w-64 bg-emerald-100 rounded-xl animate-pulse"></div>
             <div className="h-5 w-96 bg-emerald-50 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* Row 1 Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map((i) => (
            <div key={i} className="h-44 bg-white border border-stone-100 rounded-3xl p-6 flex flex-col justify-between animate-pulse">
              <div className="h-6 w-24 bg-stone-100 rounded-lg"></div>
              <div className="h-8 w-32 bg-emerald-50 rounded-lg"></div>
              <div className="h-4 w-48 bg-stone-50 rounded-lg"></div>
            </div>
          ))}
        </div>

        {/* Row 2 Skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 items-start">
          <div className="h-[400px] bg-white border border-stone-100 rounded-3xl animate-pulse"></div>
          <div className="h-[600px] bg-white border border-stone-100 rounded-3xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
           <h1 className="text-4xl font-serif text-emerald-950 font-bold mb-2">Member Command Center</h1>
           <p className="text-emerald-800/70 max-w-2xl font-medium">Manage your subscription configuration, log rounds, and track your immediate charitable impact.</p>
        </div>
        {isAdmin && (
           <a href="/admin" className="bg-amber-400 text-amber-950 px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm shadow hover:shadow-md hover:bg-amber-300 hover:-translate-y-0.5 transition flex items-center gap-2 flex-shrink-0">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
             Enter Back Office
           </a>
        )}
      </div>

      {/* Row 1: Core Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <SubscriptionCard 
            status={data.subscription.status} 
            plan={data.subscription.plan} 
            renewalDate={data.subscription.renewalDate} 
          />
        </div>
        <div className="lg:col-span-1">
          <CharityCard charityData={data.charity} />
        </div>
        <div className="lg:col-span-1">
          <ParticipationCard 
            entriesCount={data.participation.entriesCount}
            nextDrawDate={data.participation.nextDrawDate}
            history={data.participation.history}
          />
        </div>
        <div className="lg:col-span-1">
          <WinningsCard 
            totalWon={data.winnings.totalWon}
            activePending={data.winnings.activePending}
          />
        </div>
      </div>

      {/* Row 2: Deep Interaction Modules */}
      <div id="scores" className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 items-start animate-in slide-in-from-bottom-8 duration-700 scroll-mt-28">
        <div className="sticky top-24">
          <ScoreEntryForm onScoreAdded={handleScoreAddedOrEdited} scoreCount={scores.length} />
          
          <div className="mt-6 bg-emerald-50 rounded-2xl p-6 border border-emerald-100 flex items-center justify-between shadow-inner">
             <span className="text-sm font-bold text-emerald-900 uppercase">Current Capacity</span>
             <span className="text-2xl font-bold font-serif text-emerald-800">{scores.length} / 5</span>
          </div>
        </div>

        <div>
          <ScoreList 
            scores={scores} 
            loading={scoresLoading}
            onEdit={(score) => setEditingScore(score)}
            onDelete={handleScoreDeleted}
          />
        </div>
      </div>

      {editingScore && (
         <EditScoreModal
            score={editingScore}
            onClose={() => setEditingScore(null)}
            onSuccess={() => {
              setEditingScore(null);
              handleScoreAddedOrEdited();
            }}
         />
      )}
    </div>
  );
}
