import React from "react";

export function AddMealPage() {
  return (
    <div>
      <h1>Add Meal</h1>
      <form data-testid="add-meal-form">
        <select data-testid="select-day"><option value="Monday">Monday</option></select>
        <select data-testid="select-meal-type"><option value="breakfast">breakfast</option></select>
        <input data-testid="input-name" placeholder="Meal name" />
        <input data-testid="input-notes" placeholder="Notes" />
        <button type="submit" data-testid="submit-btn">Add Meal</button>
      </form>
    </div>
  );
}
