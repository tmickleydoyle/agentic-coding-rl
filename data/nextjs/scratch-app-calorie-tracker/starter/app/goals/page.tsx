import React from "react";

export function GoalsPage() {
  return (
    <div>
      <h1>Daily Goals</h1>
      <p data-testid="goal-calories">Calorie Goal: 2000</p>
      <p data-testid="goal-protein">Protein Goal: 150g</p>
      <p data-testid="goal-carbs">Carbs Goal: 200g</p>
      <p data-testid="goal-fat">Fat Goal: 65g</p>
      <form data-testid="goals-form">
        <input data-testid="input-goal-calories" type="number" defaultValue={2000} />
        <input data-testid="input-goal-protein" type="number" defaultValue={150} />
        <input data-testid="input-goal-carbs" type="number" defaultValue={200} />
        <input data-testid="input-goal-fat" type="number" defaultValue={65} />
        <button type="submit" data-testid="save-goals-btn">Save Goals</button>
      </form>
    </div>
  );
}
