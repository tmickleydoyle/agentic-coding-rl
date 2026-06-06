"use client";
import React from "react";
import { getReports } from "../../lib/store";
export function ReportsPage() {
  const reports = getReports();
  return (
    <div data-testid="reports-page">
      <h2>Reports</h2>
      <ul data-testid="reports-list">
        {reports.map((r) => (
          <li key={r.matchId} data-testid={`report-item-${r.matchId}`}>
            <span data-testid={`report-home-${r.matchId}`}>{r.homeTeam}</span>
            <span data-testid={`report-flags-${r.matchId}`}>{r.flagCount}</span>
            <span data-testid={`report-reds-${r.matchId}`}>{r.redCards}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
