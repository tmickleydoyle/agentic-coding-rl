import React from "react";
export function GoalsPage() {
  return (
    <div data-testid="goals-page">
      <div data-testid="add-goal-form">
        <input data-testid="goal-title" />
        <input data-testid="goal-target" type="number" />
        <select data-testid="goal-category"><option value="other">other</option></select>
        <button data-testid="add-goal-btn">Add Goal</button>
      </div>
      <ul data-testid="goal-list"></ul>
    </div>
  );
}
