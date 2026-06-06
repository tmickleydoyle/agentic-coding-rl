import React from "react";

export function MealDetailPage() {
  return (
    <div>
      <h1 data-testid="detail-name">Meal Name</h1>
      <p data-testid="detail-day">Day</p>
      <p data-testid="detail-type">Type</p>
      <p data-testid="detail-notes">Notes</p>
      <button data-testid="delete-btn">Delete</button>
    </div>
  );
}
