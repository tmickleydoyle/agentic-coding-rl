import React from "react";

export default function GoalsPage() {
  return (
    <div data-testid="goals-page">
      <h1>Pace Goals</h1>
      <form data-testid="goals-form">
        <input data-testid="input-goal-easy" defaultValue="6:00" />
        <input data-testid="input-goal-tempo" defaultValue="4:30" />
        <input data-testid="input-goal-long" defaultValue="5:30" />
        <input data-testid="input-goal-race" defaultValue="5:00" />
        <button type="submit" data-testid="btn-save-goals">Save</button>
      </form>
      <p data-testid="current-goal-easy">Easy: 6:00</p>
    </div>
  );
}
