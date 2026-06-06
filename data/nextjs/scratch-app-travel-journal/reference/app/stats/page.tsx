import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function StatsPage() {
  const { entries } = useApp();
  const total = entries.length;
  const countries = Array.from(new Set(entries.map((e) => e.country))).sort().join(", ");
  const avgRating = total === 0 ? "N/A" : (entries.reduce((s, e) => s + e.rating, 0) / total).toFixed(1);

  const moodCount: Record<string, number> = {};
  entries.forEach((e) => { moodCount[e.mood] = (moodCount[e.mood] ?? 0) + 1; });
  const topMood = total === 0 ? "N/A" : Object.entries(moodCount).sort((a, b) => b[1] - a[1])[0][0];

  return (
    <div data-testid="stats-page">
      <h2>Travel Stats</h2>
      <p data-testid="stat-total-entries">{total}</p>
      <p data-testid="stat-countries">{countries}</p>
      <p data-testid="stat-avg-rating">{avgRating}</p>
      <p data-testid="stat-top-mood">{topMood}</p>
    </div>
  );
}
