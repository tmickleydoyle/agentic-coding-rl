import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { MealTime } from "../../lib/types";

export default function MealsPage() {
  const { meals, addMeal, deleteMeal, activeMealId, setActiveMealId } = useApp();
  const [name, setName] = useState("");
  const [time, setTime] = useState<MealTime>("breakfast");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addMeal(name, time);
    setName("");
    setTime("breakfast");
  }

  return (
    <div data-testid="meals-page">
      <h1>Meals</h1>
      <form data-testid="add-meal-form" onSubmit={handleSubmit}>
        <input data-testid="input-meal-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Meal name" />
        <select data-testid="input-meal-time" value={time} onChange={(e) => setTime(e.target.value as MealTime)}>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </select>
        <button type="submit" data-testid="btn-add-meal">Add</button>
      </form>
      <ul data-testid="meal-list">
        {meals.map((m) => (
          <li key={m.id} data-testid={`meal-item-${m.id}`}>
            <button data-testid={`btn-select-meal-${m.id}`} onClick={() => setActiveMealId(m.id)}>
              <span data-testid={`meal-name-${m.id}`}>{m.name}</span>
            </button>
            {activeMealId === m.id && <span data-testid="active-meal-indicator"> (active)</span>}
            <span data-testid={`meal-time-${m.id}`}>{m.time}</span>
            <button data-testid={`btn-delete-meal-${m.id}`} onClick={() => deleteMeal(m.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
