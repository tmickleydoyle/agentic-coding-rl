import React from "react";

export default function SummaryPage() {
  return (
    <div data-testid="summary-page">
      <h1>Summary</h1>
      <p data-testid="summary-calories">Calories: 0 / 2000</p>
      <p data-testid="summary-protein">Protein: 0g / 150g</p>
      <p data-testid="summary-carbs">Carbs: 0g / 200g</p>
      <p data-testid="summary-fat">Fat: 0g / 65g</p>
    </div>
  );
}
