import React from "react";

export function AddFoodPage() {
  return (
    <div>
      <h1>Add Food</h1>
      <form data-testid="add-food-form">
        <input data-testid="input-name" placeholder="Food name" />
        <input data-testid="input-calories" type="number" defaultValue={0} />
        <input data-testid="input-protein" type="number" defaultValue={0} />
        <input data-testid="input-carbs" type="number" defaultValue={0} />
        <input data-testid="input-fat" type="number" defaultValue={0} />
        <button type="submit" data-testid="submit-btn">Log Food</button>
      </form>
    </div>
  );
}
