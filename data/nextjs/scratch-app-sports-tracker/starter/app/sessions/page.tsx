"use client";
import React from "react";

export function SessionsPage() {
  return (
    <div data-testid="sessions-page">
      <h2>Sessions</h2>
      <select data-testid="session-athlete-select"><option value="">Select athlete</option></select>
      <input data-testid="session-date-input" type="date" />
      <input data-testid="session-duration-input" type="number" placeholder="Duration (min)" />
      <input data-testid="session-score-input" type="number" placeholder="Score (1-10)" />
      <button data-testid="add-session-btn">Log Session</button>
      <ul data-testid="session-list"></ul>
    </div>
  );
}
