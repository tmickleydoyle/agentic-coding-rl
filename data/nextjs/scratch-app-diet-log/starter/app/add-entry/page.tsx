import React from "react";

export function AddEntryPage() {
  return (
    <div>
      <h1>Add Diet Entry</h1>
      <form data-testid="add-entry-form">
        <input data-testid="input-date" type="date" />
        <select data-testid="select-meal-type"><option value="breakfast">breakfast</option></select>
        <input data-testid="input-food-name" placeholder="Food name" />
        <input data-testid="input-calories" type="number" defaultValue={0} />
        <input data-testid="input-protein" type="number" defaultValue={0} />
        <input data-testid="input-carbs" type="number" defaultValue={0} />
        <input data-testid="input-fat" type="number" defaultValue={0} />
        <input data-testid="input-servings" type="number" defaultValue={1} />
        <button type="submit" data-testid="submit-btn">Add Entry</button>
      </form>
    </div>
  );
}
