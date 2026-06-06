import React from "react";

export function ViewRecipePage() {
  return (
    <div>
      <h1 data-testid="recipe-name">Recipe Name</h1>
      <p data-testid="recipe-category">Category:</p>
      <pre data-testid="recipe-ingredients"></pre>
      <p data-testid="recipe-instructions"></p>
      <button data-testid="delete-btn">Delete</button>
    </div>
  );
}
