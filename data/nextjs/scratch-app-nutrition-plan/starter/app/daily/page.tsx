import React from "react";

export default function DailyPage() {
  return (
    <div data-testid="daily-page">
      <h1>Daily Targets</h1>
      <form data-testid="targets-form">
        <input data-testid="input-target-calories" type="number" defaultValue={2000} />
        <input data-testid="input-target-protein" type="number" defaultValue={150} />
        <input data-testid="input-target-carbs" type="number" defaultValue={200} />
        <input data-testid="input-target-fat" type="number" defaultValue={65} />
        <button type="submit" data-testid="btn-save-targets">Save</button>
      </form>
      <p data-testid="current-target-calories">Calories: 2000</p>
    </div>
  );
}
