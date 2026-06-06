import React from "react";
import { useApp } from "../../components/AppStateProvider";

export function ViewRecipePage() {
  const { selectedRecipe, handleDelete } = useApp();

  if (!selectedRecipe) {
    return <div>No recipe selected.</div>;
  }

  return (
    <div>
      <h1 data-testid="recipe-name">{selectedRecipe.name}</h1>
      <p data-testid="recipe-category">Category: {selectedRecipe.category}</p>
      <pre data-testid="recipe-ingredients">{selectedRecipe.ingredients}</pre>
      <p data-testid="recipe-instructions">{selectedRecipe.instructions}</p>
      <button
        data-testid="delete-btn"
        onClick={() => handleDelete(selectedRecipe.id)}
      >
        Delete
      </button>
    </div>
  );
}
