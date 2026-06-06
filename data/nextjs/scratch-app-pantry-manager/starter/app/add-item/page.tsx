import React from "react";

export function AddItemPage() {
  return (
    <div>
      <h1>Add Pantry Item</h1>
      <form data-testid="add-item-form">
        <input data-testid="input-name" placeholder="Item name" />
        <input data-testid="input-quantity" type="number" defaultValue={1} />
        <input data-testid="input-unit" placeholder="Unit" />
        <select data-testid="select-category"><option value="grain">grain</option></select>
        <input data-testid="input-threshold" type="number" defaultValue={2} />
        <input data-testid="input-expires" type="date" />
        <button type="submit" data-testid="submit-btn">Add Item</button>
      </form>
    </div>
  );
}
