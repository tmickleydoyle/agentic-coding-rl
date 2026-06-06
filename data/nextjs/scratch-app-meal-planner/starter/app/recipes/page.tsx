'use client'
import React from 'react';
export function RecipesPage() {
  return (
    <main data-testid="recipes-page">
      <h2>Recipes</h2>
      <div data-testid="add-recipe-form">
        <input data-testid="recipe-name-input" placeholder="Name" />
        <input data-testid="recipe-ingredients-input" placeholder="Ingredients (comma-separated)" />
        <input data-testid="recipe-servings-input" type="number" placeholder="Servings" />
        <input data-testid="recipe-prep-input" type="number" placeholder="Prep minutes" />
        <input data-testid="recipe-tags-input" placeholder="Tags (comma-separated)" />
        <button data-testid="add-recipe-btn">Add Recipe</button>
      </div>
      <ul data-testid="recipes-list" />
    </main>
  );
}
