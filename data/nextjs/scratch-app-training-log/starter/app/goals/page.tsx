"use client";
import React from "react";

export function GoalsPage() {
  return (
    <div data-testid="goals-page">
      <h2>Goals</h2>
      <div data-testid="completed-count">0</div>
      <div data-testid="total-goals">0</div>
      <input data-testid="goal-title-input" placeholder="Title" />
      <input data-testid="goal-target-input" type="number" placeholder="Target" />
      <input data-testid="goal-unit-input" placeholder="Unit" />
      <input data-testid="goal-deadline-input" type="date" />
      <button data-testid="add-goal-btn">Add Goal</button>
      <ul data-testid="goal-list"></ul>
    </div>
  );
}
