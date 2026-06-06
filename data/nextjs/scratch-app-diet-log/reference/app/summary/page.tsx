import React from "react";
import { useApp } from "../../components/AppStateProvider";

export function SummaryPage() {
  const { summary } = useApp();
  return (
    <div>
      <h1>Daily Summary (2024-03-15)</h1>
      <p data-testid="summary-calories">Calories: {summary.calories}</p>
      <p data-testid="summary-protein">Protein: {summary.protein}g</p>
      <p data-testid="summary-carbs">Carbs: {summary.carbs}g</p>
      <p data-testid="summary-fat">Fat: {summary.fat}g</p>
    </div>
  );
}
