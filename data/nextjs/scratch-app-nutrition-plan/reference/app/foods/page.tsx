import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";

export default function FoodsPage() {
  const { meals, activeMealId, addFood } = useApp();
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  const activeMeal = meals.find((m) => m.id === activeMealId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!activeMealId) return;
    addFood(activeMealId, name, Number(calories), Number(protein), Number(carbs), Number(fat));
    setName(""); setCalories(""); setProtein(""); setCarbs(""); setFat("");
  }

  if (!activeMeal) {
    return (
      <div data-testid="foods-page">
        <h1>Foods</h1>
        <p data-testid="no-active-meal">No active meal</p>
      </div>
    );
  }

  return (
    <div data-testid="foods-page">
      <h1>Foods — {activeMeal.name}</h1>
      <form data-testid="add-food-form" onSubmit={handleSubmit}>
        <input data-testid="input-food-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Food name" />
        <input data-testid="input-calories" type="number" value={calories} onChange={(e) => setCalories(e.target.value)} placeholder="Calories" />
        <input data-testid="input-protein" type="number" value={protein} onChange={(e) => setProtein(e.target.value)} placeholder="Protein" />
        <input data-testid="input-carbs" type="number" value={carbs} onChange={(e) => setCarbs(e.target.value)} placeholder="Carbs" />
        <input data-testid="input-fat" type="number" value={fat} onChange={(e) => setFat(e.target.value)} placeholder="Fat" />
        <button type="submit" data-testid="btn-add-food">Add</button>
      </form>
      <ul data-testid="food-list">
        {activeMeal.foods.map((f) => (
          <li key={f.id} data-testid={`food-item-${f.id}`}>
            <span data-testid={`food-name-${f.id}`}>{f.name}</span>
            <span data-testid={`food-calories-${f.id}`}>{f.calories}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
