'use client'
import React from 'react'
export function RecipesPage() {
  return (
    <div data-testid="recipes-page">
      <h1>Recipes</h1>
      <input data-testid="input-recipe-name" placeholder="Name" />
      <input data-testid="input-recipe-description" placeholder="Description" />
      <input data-testid="input-recipe-ingredients" placeholder="Ingredients (comma-separated)" />
      <button data-testid="add-recipe-btn">Add Recipe</button>
    </div>
  )
}
