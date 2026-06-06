"use client";
import React from "react";
export function TeamsPage() {
  return (
    <div data-testid="teams-page">
      <h2>Teams</h2>
      <input data-testid="team-name-input" placeholder="Name" />
      <input data-testid="team-owner-input" placeholder="Owner" />
      <button data-testid="add-team-btn">Add Team</button>
      <ul data-testid="team-list"></ul>
    </div>
  );
}
