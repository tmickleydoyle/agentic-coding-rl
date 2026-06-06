import React from "react";
import { getLeaderboard } from "../../lib/store";

export function LeaderboardPage() {
  const ranked = getLeaderboard();

  return (
    <div data-testid="leaderboard-page">
      <h2>Leaderboard</h2>
      {ranked.map((d, idx) => (
        <div key={d.id} data-testid={`lb-row-${d.id}`}>
          <span data-testid={`lb-rank-${d.id}`}>{idx + 1}</span>
          <span data-testid={`lb-name-${d.id}`}>{d.name}</span>
          <span data-testid={`lb-total-${d.id}`}>{d.totalDonated}</span>
        </div>
      ))}
    </div>
  );
}
