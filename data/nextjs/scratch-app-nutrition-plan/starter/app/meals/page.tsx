import React from "react";

export default function MealsPage() {
  return (
    <div data-testid="meals-page">
      <h1>Meals</h1>
      <form data-testid="add-meal-form">
        <input data-testid="input-meal-name" placeholder="Meal name" />
        <select data-testid="input-meal-time">
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </select>
        <button type="submit" data-testid="btn-add-meal">Add</button>
      </form>
      <ul data-testid="meal-list"></ul>
    </div>
  );
}
