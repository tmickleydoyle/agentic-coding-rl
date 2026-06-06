'use client';
import React from 'react';

export function RecipesPage() {
  return (
    <div>
      <h1>Recipes</h1>
      <input data-testid="recipe-title" placeholder="Title" />
      <input data-testid="recipe-cuisine" placeholder="Cuisine" />
      <input data-testid="recipe-preptime" type="number" placeholder="Prep time" />
      <input data-testid="recipe-ingredients" placeholder="Ingredients" />
      <input data-testid="recipe-instructions" placeholder="Instructions" />
      <button data-testid="add-recipe-btn">Add Recipe</button>
      <ul></ul>
    </div>
  );
}
