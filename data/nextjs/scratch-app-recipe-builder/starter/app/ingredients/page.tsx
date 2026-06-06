'use client'
import React from 'react'
export function IngredientsPage() {
  return (
    <div data-testid="ingredients-page">
      <h1>Ingredients</h1>
      <input data-testid="input-ingredient-name" placeholder="Name" />
      <input data-testid="input-ingredient-quantity" placeholder="Quantity" />
      <button data-testid="add-ingredient-btn">Add Ingredient</button>
    </div>
  )
}
