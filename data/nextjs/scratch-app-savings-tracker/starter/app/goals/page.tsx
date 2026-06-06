import React from "react";
export function GoalsPage() {
  return (
    <div data-testid="goals-page">
      <div data-testid="add-goal-form">
        <input data-testid="goal-name" /><input data-testid="goal-target" type="number" />
        <input data-testid="goal-deadline" type="date" />
        <button data-testid="add-goal-btn">Add Goal</button>
      </div>
      <ul data-testid="goal-list"></ul>
    </div>
  );
}
