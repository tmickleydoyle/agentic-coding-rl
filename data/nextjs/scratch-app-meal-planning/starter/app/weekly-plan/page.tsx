import React from "react";

export function WeeklyPlanPage() {
  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  return (
    <div>
      <h1>Weekly Meal Plan</h1>
      <p data-testid="total-meals">0 meals planned</p>
      {days.map((d) => (
        <div key={d} data-testid={`day-section-${d}`}><h2>{d}</h2></div>
      ))}
    </div>
  );
}
