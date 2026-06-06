import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";

export function GoalsPage() {
  const { goals, handleSetGoals } = useApp();
  const [cals, setCals] = useState(goals.calories);
  const [prot, setProt] = useState(goals.protein);
  const [carbs, setCarbs] = useState(goals.carbs);
  const [fat, setFat] = useState(goals.fat);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSetGoals({ calories: cals, protein: prot, carbs, fat });
  };

  return (
    <div>
      <h1>Daily Goals</h1>
      <p data-testid="goal-calories">Calorie Goal: {goals.calories}</p>
      <p data-testid="goal-protein">Protein Goal: {goals.protein}g</p>
      <p data-testid="goal-carbs">Carbs Goal: {goals.carbs}g</p>
      <p data-testid="goal-fat">Fat Goal: {goals.fat}g</p>
      <form data-testid="goals-form" onSubmit={handleSubmit}>
        <input data-testid="input-goal-calories" type="number" value={cals} onChange={(e) => setCals(Number(e.target.value))} />
        <input data-testid="input-goal-protein" type="number" value={prot} onChange={(e) => setProt(Number(e.target.value))} />
        <input data-testid="input-goal-carbs" type="number" value={carbs} onChange={(e) => setCarbs(Number(e.target.value))} />
        <input data-testid="input-goal-fat" type="number" value={fat} onChange={(e) => setFat(Number(e.target.value))} />
        <button type="submit" data-testid="save-goals-btn">Save Goals</button>
      </form>
    </div>
  );
}
