'use client';
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function HomePage() {
  const { recipes, navigate } = useApp();
  const featured = recipes[0];
  return (
    <div style={{ padding: 24 }}>
      <h1>Recipe Box</h1>
      <p>Total recipes: <span data-testid="recipe-count">{recipes.length}</span></p>
      {featured && (
        <div>
          <h2>Featured: {featured.title}</h2>
          <p>{featured.cuisine} — {featured.prepTime} min</p>
        </div>
      )}
      <button onClick={() => navigate('recipes')}>Browse All Recipes</button>
    </div>
  );
}
