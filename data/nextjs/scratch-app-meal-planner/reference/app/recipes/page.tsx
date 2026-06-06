'use client'
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function RecipesPage() {
  const { recipes, addRecipe, deleteRecipe } = useApp();
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [servings, setServings] = useState('');
  const [prepMinutes, setPrepMinutes] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');

  const handleAdd = () => {
    const ingList = ingredients.split(',').map(i => i.trim()).filter(Boolean);
    if (!name.trim()) { setError('Name required'); return; }
    if (ingList.length === 0) { setError('At least one ingredient required'); return; }
    const ok = addRecipe(name, ingList, parseInt(servings) || 1, parseInt(prepMinutes) || 0, tags.split(',').map(t => t.trim()).filter(Boolean));
    if (!ok) { setError('Failed'); return; }
    setName(''); setIngredients(''); setServings(''); setPrepMinutes(''); setTags(''); setError('');
  };

  return (
    <main data-testid="recipes-page">
      <h2>Recipes</h2>
      <div data-testid="add-recipe-form">
        <input data-testid="recipe-name-input" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
        <input data-testid="recipe-ingredients-input" value={ingredients} onChange={e => setIngredients(e.target.value)} placeholder="Ingredients (comma-separated)" />
        <input data-testid="recipe-servings-input" type="number" value={servings} onChange={e => setServings(e.target.value)} placeholder="Servings" />
        <input data-testid="recipe-prep-input" type="number" value={prepMinutes} onChange={e => setPrepMinutes(e.target.value)} placeholder="Prep minutes" />
        <input data-testid="recipe-tags-input" value={tags} onChange={e => setTags(e.target.value)} placeholder="Tags (comma-separated)" />
        <button data-testid="add-recipe-btn" onClick={handleAdd}>Add Recipe</button>
        {error && <span data-testid="recipe-error">{error}</span>}
      </div>
      <ul data-testid="recipes-list">
        {recipes.map(r => (
          <li key={r.id} data-testid={`recipe-item-${r.id}`}>
            <span data-testid={`recipe-name-${r.id}`}>{r.name}</span>
            <span data-testid={`recipe-ingredients-${r.id}`}>{r.ingredients.join(', ')}</span>
            <button data-testid={`delete-recipe-${r.id}`} onClick={() => deleteRecipe(r.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
