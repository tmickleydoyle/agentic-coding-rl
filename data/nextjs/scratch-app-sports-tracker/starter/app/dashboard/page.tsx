"use client";
import React from "react";

export function DashboardPage() {
  return (
    <div data-testid="dashboard-page">
      <h2>Dashboard</h2>
      <div data-testid="athlete-count">0</div>
      <div data-testid="session-count">0</div>
      <div data-testid="avg-score">0.0</div>
    </div>
  );
}
