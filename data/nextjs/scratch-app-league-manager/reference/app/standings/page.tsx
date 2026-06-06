"use client";
import React from "react";
import { getStandings } from "../../lib/store";

export function StandingsPage() {
  const standings = getStandings();
  return (
    <div data-testid="standings-page">
      <h2>Standings</h2>
      <table data-testid="standings-table">
        <thead>
          <tr>
            <th>Team</th><th>W</th><th>D</th><th>L</th><th>Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s) => (
            <tr key={s.teamId} data-testid={`standing-row-${s.teamId}`}>
              <td data-testid={`standing-name-${s.teamId}`}>{s.teamName}</td>
              <td data-testid={`standing-wins-${s.teamId}`}>{s.wins}</td>
              <td data-testid={`standing-draws-${s.teamId}`}>{s.draws}</td>
              <td data-testid={`standing-losses-${s.teamId}`}>{s.losses}</td>
              <td data-testid={`standing-points-${s.teamId}`}>{s.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
