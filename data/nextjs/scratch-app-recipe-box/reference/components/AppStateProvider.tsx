'use client';
import React, { createContext, useContext, useState } from 'react';
import type { Recipe, Route } from '../lib/types';

interface AppState {
  route: Route;
  recipes: Recipe[];
  navigate: (r: Route) => void;
  addRecipe: (data: Omit<Recipe, 'id'>) => void;
  toggleFavorite: (id: string) => void;
}

const AppContext = createContext<AppState>({
  route: 'home',
  recipes: [],
  navigate: () => {},
  addRecipe: () => {},
  toggleFavorite: () => {},
});

export function useApp() { return useContext(AppContext); }

const seed: Recipe[] = [
  { id: 'r1', title: 'Pasta Carbonara', cuisine: 'Italian', prepTime: 20, ingredients: ['pasta', 'eggs', 'bacon', 'parmesan'], instructions: 'Boil pasta...', favorite: true },
  { id: 'r2', title: 'Chicken Stir Fry', cuisine: 'Asian', prepTime: 15, ingredients: ['chicken', 'broccoli', 'soy sauce', 'ginger'], instructions: 'Heat oil...', favorite: false },
  { id: 'r3', title: 'Caesar Salad', cuisine: 'American', prepTime: 10, ingredients: ['lettuce', 'croutons', 'parmesan', 'caesar dressing'], instructions: 'Toss greens...', favorite: true },
];

let idCounter = 4;

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home');
  const [recipes, setRecipes] = useState<Recipe[]>(seed.map(r => ({ ...r, ingredients: [...r.ingredients] })));

  function navigate(r: Route) { setRoute(r); }

  function addRecipe(data: Omit<Recipe, 'id'>) {
    const r: Recipe = { id: `r${idCounter++}`, ...data };
    setRecipes(prev => [...prev, r]);
  }

  function toggleFavorite(id: string) {
    setRecipes(prev => prev.map(r => r.id === id ? { ...r, favorite: !r.favorite } : r));
  }

  return (
    <AppContext.Provider value={{ route, recipes, navigate, addRecipe, toggleFavorite }}>
      {children}
    </AppContext.Provider>
  );
}
