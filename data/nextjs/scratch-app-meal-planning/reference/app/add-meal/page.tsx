import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { DayOfWeek, MealType } from "../../lib/types";

export function AddMealPage() {
  const { handleAdd } = useApp();
  const [day, setDay] = useState<DayOfWeek>("Monday");
  const [mealType, setMealType] = useState<MealType>("breakfast");
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Name is required."); return; }
    setError("");
    handleAdd({ day, mealType, name: name.trim(), notes });
  };

  return (
    <div>
      <h1>Add Meal</h1>
      {error && <p data-testid="error-message">{error}</p>}
      <form data-testid="add-meal-form" onSubmit={handleSubmit}>
        <select data-testid="select-day" value={day} onChange={(e) => setDay(e.target.value as DayOfWeek)}>
          {(["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"] as DayOfWeek[]).map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select data-testid="select-meal-type" value={mealType} onChange={(e) => setMealType(e.target.value as MealType)}>
          <option value="breakfast">breakfast</option>
          <option value="lunch">lunch</option>
          <option value="dinner">dinner</option>
          <option value="snack">snack</option>
        </select>
        <input data-testid="input-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Meal name" />
        <input data-testid="input-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" />
        <button type="submit" data-testid="submit-btn">Add Meal</button>
      </form>
    </div>
  );
}
