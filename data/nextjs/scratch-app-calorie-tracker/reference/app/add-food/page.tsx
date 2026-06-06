import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";

export function AddFoodPage() {
  const { handleAdd } = useApp();
  const [name, setName] = useState("");
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fat, setFat] = useState(0);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Name is required."); return; }
    if (calories < 1) { setError("Calories must be at least 1."); return; }
    setError("");
    handleAdd({ date: "2024-04-10", name: name.trim(), calories, protein, carbs, fat });
  };

  return (
    <div>
      <h1>Add Food</h1>
      {error && <p data-testid="error-message">{error}</p>}
      <form data-testid="add-food-form" onSubmit={handleSubmit}>
        <input data-testid="input-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Food name" />
        <input data-testid="input-calories" type="number" value={calories} onChange={(e) => setCalories(Number(e.target.value))} />
        <input data-testid="input-protein" type="number" value={protein} onChange={(e) => setProtein(Number(e.target.value))} />
        <input data-testid="input-carbs" type="number" value={carbs} onChange={(e) => setCarbs(Number(e.target.value))} />
        <input data-testid="input-fat" type="number" value={fat} onChange={(e) => setFat(Number(e.target.value))} />
        <button type="submit" data-testid="submit-btn">Log Food</button>
      </form>
    </div>
  );
}
