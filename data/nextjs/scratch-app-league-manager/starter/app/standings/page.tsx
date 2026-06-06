"use client";
import React from "react";
export function StandingsPage() {
  return (
    <div data-testid="standings-page">
      <h2>Standings</h2>
      <table data-testid="standings-table"><thead><tr><th>Team</th><th>W</th><th>D</th><th>L</th><th>Pts</th></tr></thead><tbody></tbody></table>
    </div>
  );
}
