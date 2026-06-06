'use client';
import React from 'react';
import { useApp } from './AppStateProvider';

export function NavBar() {
  const { navigate } = useApp();
  return (
    <nav>
      <button data-testid="nav-home" onClick={() => navigate('home')}>Home</button>
      <button data-testid="nav-recipes" onClick={() => navigate('recipes')}>Recipes</button>
      <button data-testid="nav-ingredients" onClick={() => navigate('ingredients')}>Ingredients</button>
      <button data-testid="nav-favorites" onClick={() => navigate('favorites')}>Favorites</button>
    </nav>
  );
}
