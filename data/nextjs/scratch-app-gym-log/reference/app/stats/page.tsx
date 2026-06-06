import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function StatsPage() {
  const { sessions } = useApp();
  const totalSessions = sessions.length;
  const allExercises = sessions.flatMap((s) => s.exercises);
  const totalExercises = allExercises.length;

  const freq: Record<string, number> = {};
  allExercises.forEach((e) => {
    freq[e.name] = (freq[e.name] || 0) + 1;
  });
  let mostFrequent = "";
  let maxCount = 0;
  Object.keys(freq).forEach((k) => {
    if (freq[k] > maxCount) {
      maxCount = freq[k];
      mostFrequent = k;
    }
  });

  return (
    <div data-testid="stats-page">
      <h1>Stats</h1>
      <p data-testid="stat-total-sessions">Total Sessions: {totalSessions}</p>
      <p data-testid="stat-total-exercises">Total Exercises: {totalExercises}</p>
      <p data-testid="stat-most-frequent">Most Frequent: {mostFrequent || "N/A"}</p>
    </div>
  );
}
