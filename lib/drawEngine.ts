import { createClient } from "./supabase/server";

// Platform Math Configurations
const TARGET_SUB_PRICE = 9.99; // Using standard monthly base for computation
const PRIZE_POOL_PERCENTAGE = 0.20; // 20% of active revenue forms the prize pool

export function calculatePrizePool(activeSubscriberCount: number, rolledOverJackpot: number = 0) {
  const grossContribution = activeSubscriberCount * TARGET_SUB_PRICE * PRIZE_POOL_PERCENTAGE;
  
  return {
    totalGenerated: grossContribution,
    jackpot: Number((grossContribution * 0.40).toFixed(2)) + Number(rolledOverJackpot),
    fourMatch: Number((grossContribution * 0.35).toFixed(2)),
    threeMatch: Number((grossContribution * 0.25).toFixed(2))
  };
}

export function generateRandomNumbers(): number[] {
  const numbers = new Set<number>();
  while (numbers.size < 5) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }
  return Array.from(numbers).sort((a, b) => a - b);
}

export function generateAlgorithmicNumbers(allUserScores: number[]): number[] {
  if (!allUserScores || allUserScores.length === 0) return generateRandomNumbers();

  // 1. Calculate frequency of every single entered score across the ecosystem
  const frequencies: Record<number, number> = {};
  for (let i = 1; i <= 45; i++) frequencies[i] = 0;
  allUserScores.forEach(score => {
    if (score >= 1 && score <= 45) frequencies[score]++;
  });

  // 2. Identify the top 20 most frequent numbers mathematically
  const sortedByFreq = Object.keys(frequencies)
    .map(Number)
    .sort((a, b) => frequencies[b] - frequencies[a]);
    
  const heavyWeights = sortedByFreq.slice(0, 20);

  // 3. Algorithmically select 5 numbers heavily skewed (80% chance) towards the most frequent numbers
  // This physically increases the overall chance that users hit 3/4/5 matches collectively.
  const winning = new Set<number>();
  while (winning.size < 5) {
    if (Math.random() < 0.8) {
      winning.add(heavyWeights[Math.floor(Math.random() * heavyWeights.length)]);
    } else {
      winning.add(Math.floor(Math.random() * 45) + 1);
    }
  }
  return Array.from(winning).sort((a, b) => a - b);
}

export function evaluateMatches(winningNumbers: number[], userScores: number[]): number {
  if (!userScores || userScores.length === 0) return 0;
  let matches = 0;
  const winSet = new Set(winningNumbers);
  
  userScores.forEach(score => {
    if (winSet.has(score)) matches++;
  });
  
  return matches;
}
