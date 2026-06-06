import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function SummaryPage() {
  const { meals, targets } = useApp();
  const allFoods = meals.flatMap((m) => m.foods);
  const totalCalories = allFoods.reduce((s, f) => s + f.calories, 0);
  const totalProtein = allFoods.reduce((s, f) => s + f.protein, 0);
  const totalCarbs = allFoods.reduce((s, f) => s + f.carbs, 0);
  const totalFat = allFoods.reduce((s, f) => s + f.fat, 0);

  return (
    <div data-testid="summary-page">
      <h1>Summary</h1>
      <p data-testid="summary-calories">Calories: {totalCalories} / {targets.calories}</p>
      <p data-testid="summary-protein">Protein: {totalProtein}g / {targets.protein}g</p>
      <p data-testid="summary-carbs">Carbs: {totalCarbs}g / {targets.carbs}g</p>
      <p data-testid="summary-fat">Fat: {totalFat}g / {targets.fat}g</p>
    </div>
  );
}
