import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { Recipe } from "../../lib/types";

export function AddRecipePage() {
  const { handleAdd } = useApp();
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [category, setCategory] = useState<Recipe["category"]>("breakfast");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    setError("");
    handleAdd({ name: name.trim(), ingredients, instructions, category });
  };

  return (
    <div>
      <h1>Add Recipe</h1>
      {error && <p data-testid="error-message">{error}</p>}
      <form data-testid="add-recipe-form" onSubmit={handleSubmit}>
        <input
          data-testid="input-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Recipe name"
        />
        <textarea
          data-testid="input-ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="Ingredients (one per line)"
        />
        <textarea
          data-testid="input-instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Instructions"
        />
        <select
          data-testid="select-category"
          value={category}
          onChange={(e) => setCategory(e.target.value as Recipe["category"])}
        >
          <option value="breakfast">breakfast</option>
          <option value="lunch">lunch</option>
          <option value="dinner">dinner</option>
          <option value="snack">snack</option>
          <option value="dessert">dessert</option>
        </select>
        <button type="submit" data-testid="submit-btn">
          Add Recipe
        </button>
      </form>
    </div>
  );
}
