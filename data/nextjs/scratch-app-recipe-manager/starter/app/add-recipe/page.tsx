import React from "react";

export function AddRecipePage() {
  return (
    <div>
      <h1>Add Recipe</h1>
      <form data-testid="add-recipe-form">
        <input data-testid="input-name" placeholder="Recipe name" />
        <textarea data-testid="input-ingredients" placeholder="Ingredients" />
        <textarea data-testid="input-instructions" placeholder="Instructions" />
        <select data-testid="select-category">
          <option value="breakfast">breakfast</option>
          <option value="lunch">lunch</option>
          <option value="dinner">dinner</option>
          <option value="snack">snack</option>
          <option value="dessert">dessert</option>
        </select>
        <button type="submit" data-testid="submit-btn">Add Recipe</button>
      </form>
    </div>
  );
}
