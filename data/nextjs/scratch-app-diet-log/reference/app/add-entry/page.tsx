import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { MealType } from "../../lib/types";

export function AddEntryPage() {
  const { handleAdd } = useApp();
  const [date, setDate] = useState("2024-03-15");
  const [mealType, setMealType] = useState<MealType>("breakfast");
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fat, setFat] = useState(0);
  const [servings, setServings] = useState(1);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim()) { setError("Food name is required."); return; }
    setError("");
    handleAdd({ date, mealType, foodName: foodName.trim(), calories, protein, carbs, fat, servings });
  };

  return (
    <div>
      <h1>Add Diet Entry</h1>
      {error && <p data-testid="error-message">{error}</p>}
      <form data-testid="add-entry-form" onSubmit={handleSubmit}>
        <input data-testid="input-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <select data-testid="select-meal-type" value={mealType} onChange={(e) => setMealType(e.target.value as MealType)}>
          <option value="breakfast">breakfast</option>
          <option value="lunch">lunch</option>
          <option value="dinner">dinner</option>
          <option value="snack">snack</option>
        </select>
        <input data-testid="input-food-name" value={foodName} onChange={(e) => setFoodName(e.target.value)} placeholder="Food name" />
        <input data-testid="input-calories" type="number" value={calories} onChange={(e) => setCalories(Number(e.target.value))} />
        <input data-testid="input-protein" type="number" value={protein} onChange={(e) => setProtein(Number(e.target.value))} />
        <input data-testid="input-carbs" type="number" value={carbs} onChange={(e) => setCarbs(Number(e.target.value))} />
        <input data-testid="input-fat" type="number" value={fat} onChange={(e) => setFat(Number(e.target.value))} />
        <input data-testid="input-servings" type="number" value={servings} onChange={(e) => setServings(Number(e.target.value))} />
        <button type="submit" data-testid="submit-btn">Add Entry</button>
      </form>
    </div>
  );
}
