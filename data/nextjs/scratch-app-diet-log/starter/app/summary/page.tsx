import React from "react";

export function SummaryPage() {
  return (
    <div>
      <h1>Daily Summary</h1>
      <p data-testid="summary-calories">Calories: 0</p>
      <p data-testid="summary-protein">Protein: 0g</p>
      <p data-testid="summary-carbs">Carbs: 0g</p>
      <p data-testid="summary-fat">Fat: 0g</p>
    </div>
  );
}
