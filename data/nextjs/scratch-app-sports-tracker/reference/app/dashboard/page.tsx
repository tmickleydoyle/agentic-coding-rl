"use client";
import React from "react";
import { getAthletes, getSessions } from "../../lib/store";

export function DashboardPage() {
  const athletes = getAthletes();
  const sessions = getSessions();
  const avgScore =
    sessions.length > 0
      ? (sessions.reduce((sum, s) => sum + s.score, 0) / sessions.length).toFixed(1)
      : "0.0";
  return (
    <div data-testid="dashboard-page">
      <h2>Dashboard</h2>
      <div data-testid="athlete-count">{athletes.length}</div>
      <div data-testid="session-count">{sessions.length}</div>
      <div data-testid="avg-score">{avgScore}</div>
    </div>
  );
}
