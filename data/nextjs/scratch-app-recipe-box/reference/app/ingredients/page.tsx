'use client';
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function IngredientsPage() {
  const { recipes } = useApp();
  const set = new Set<string>();
  recipes.forEach(r => r.ingredients.forEach(i => set.add(i)));
  const ingredients = Array.from(set).sort();

  return (
    <div style={{ padding: 24 }}>
      <h1>Ingredients</h1>
      <ul data-testid="ingredient-list">
        {ingredients.map(ing => (
          <li key={ing} data-testid={`ingredient-item-${ing.toLowerCase().replace(/\s+/g, '-')}`}>{ing}</li>
        ))}
      </ul>
    </div>
  );
}
