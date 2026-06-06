"use client";
import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function StatsPage() {
  const { games } = useApp();
  const totalHours = games.reduce((sum, g) => sum + g.hoursPlayed, 0);
  const completed = games.filter((g) => g.status === "completed");

  const genreCounts: Record<string, number> = {};
  games.forEach((g) => { genreCounts[g.genre] = (genreCounts[g.genre] || 0) + 1; });
  const favoriteGenre = Object.keys(genreCounts).sort((a, b) => genreCounts[b] - genreCounts[a])[0] || "N/A";

  return (
    <div data-testid="stats-page">
      <h2>Gaming Stats</h2>
      <p data-testid="stat-total-games">Total games: {games.length}</p>
      <p data-testid="stat-completed">Completed: {completed.length}</p>
      <p data-testid="stat-total-hours">Total hours played: {totalHours}</p>
      <p data-testid="stat-favorite-genre">Favorite genre: {favoriteGenre}</p>
    </div>
  );
}
