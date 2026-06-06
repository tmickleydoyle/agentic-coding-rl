import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";

export default function DailyPage() {
  const { targets, saveTargets } = useApp();
  const [calories, setCalories] = useState(String(targets.calories));
  const [protein, setProtein] = useState(String(targets.protein));
  const [carbs, setCarbs] = useState(String(targets.carbs));
  const [fat, setFat] = useState(String(targets.fat));

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    saveTargets({ calories: Number(calories), protein: Number(protein), carbs: Number(carbs), fat: Number(fat) });
  }

  return (
    <div data-testid="daily-page">
      <h1>Daily Targets</h1>
      <form data-testid="targets-form" onSubmit={handleSave}>
        <input data-testid="input-target-calories" type="number" value={calories} onChange={(e) => setCalories(e.target.value)} />
        <input data-testid="input-target-protein" type="number" value={protein} onChange={(e) => setProtein(e.target.value)} />
        <input data-testid="input-target-carbs" type="number" value={carbs} onChange={(e) => setCarbs(e.target.value)} />
        <input data-testid="input-target-fat" type="number" value={fat} onChange={(e) => setFat(e.target.value)} />
        <button type="submit" data-testid="btn-save-targets">Save</button>
      </form>
      <p data-testid="current-target-calories">Calories: {targets.calories}</p>
    </div>
  );
}
