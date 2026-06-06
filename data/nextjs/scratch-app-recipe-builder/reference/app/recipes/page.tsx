'use client'
import React, { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { Recipe } from '../../lib/types'

export function RecipesPage() {
  const { recipes, setRecipes } = useApp()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [ingredientsText, setIngredientsText] = useState('')

  const handleAdd = () => {
    if (!name) return
    const newRecipe: Recipe = {
      id: `r${Date.now()}`,
      name,
      description,
      ingredients: ingredientsText.split(',').map(s => s.trim()).filter(Boolean),
      favorite: false,
      createdAt: new Date().toISOString(),
    }
    setRecipes([...recipes, newRecipe])
    setName(''); setDescription(''); setIngredientsText('')
  }

  const handleToggle = (id: string) => {
    setRecipes(recipes.map(r => r.id === id ? { ...r, favorite: !r.favorite } : r))
  }

  return (
    <div data-testid="recipes-page">
      <h1>Recipes</h1>
      <div>
        <input data-testid="input-recipe-name" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
        <input data-testid="input-recipe-description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
        <input data-testid="input-recipe-ingredients" value={ingredientsText} onChange={e => setIngredientsText(e.target.value)} placeholder="Ingredients (comma-separated)" />
        <button data-testid="add-recipe-btn" onClick={handleAdd}>Add Recipe</button>
      </div>
      {recipes.map(r => (
        <div key={r.id} data-testid={`recipe-card-${r.id}`}>
          <div>{r.name}</div>
          <div>{r.description}</div>
          <div>{r.ingredients.length} ingredients</div>
          <button data-testid={`toggle-fav-${r.id}`} onClick={() => handleToggle(r.id)}>
            {r.favorite ? 'Unfavorite' : 'Favorite'}
          </button>
        </div>
      ))}
    </div>
  )
}
