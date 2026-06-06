'use client';
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function RecipesPage() {
  const { recipes, addRecipe, toggleFavorite } = useApp();
  const [title, setTitle] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [error, setError] = useState('');

  function handleAdd() {
    if (!title.trim()) { setError('Title required'); return; }
    if (!cuisine.trim()) { setError('Cuisine required'); return; }
    if (!instructions.trim()) { setError('Instructions required'); return; }
    const pt = parseInt(prepTime, 10);
    if (isNaN(pt) || pt <= 0) { setError('PrepTime must be positive integer'); return; }
    setError('');
    addRecipe({
      title: title.trim(),
      cuisine: cuisine.trim(),
      prepTime: pt,
      ingredients: ingredients.split(',').map(s => s.trim()).filter(Boolean),
      instructions: instructions.trim(),
      favorite: false,
    });
    setTitle(''); setCuisine(''); setPrepTime(''); setIngredients(''); setInstructions('');
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Recipes</h1>
      {error && <div data-testid="recipe-error" style={{ color: 'red' }}>{error}</div>}
      <div style={{ marginBottom: 16 }}>
        <input data-testid="recipe-title" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <input data-testid="recipe-cuisine" placeholder="Cuisine" value={cuisine} onChange={e => setCuisine(e.target.value)} />
        <input data-testid="recipe-preptime" placeholder="Prep time (min)" type="number" value={prepTime} onChange={e => setPrepTime(e.target.value)} />
        <input data-testid="recipe-ingredients" placeholder="Ingredients (comma-separated)" value={ingredients} onChange={e => setIngredients(e.target.value)} />
        <input data-testid="recipe-instructions" placeholder="Instructions" value={instructions} onChange={e => setInstructions(e.target.value)} />
        <button data-testid="add-recipe-btn" onClick={handleAdd}>Add Recipe</button>
      </div>
      <ul>
        {recipes.map(r => (
          <li key={r.id} data-testid={`recipe-row-${r.id}`}>
            <strong>{r.title}</strong> — {r.cuisine} — {r.prepTime} min
            <button data-testid={`toggle-favorite-${r.id}`} onClick={() => toggleFavorite(r.id)}>
              {r.favorite ? '★' : '☆'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
