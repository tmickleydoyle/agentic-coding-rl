'use client';
import React from 'react';
import { AppStateProvider, useApp } from '../components/AppStateProvider';
import { NavBar } from '../components/NavBar';
import { HomePage } from '../app/home/page';
import { RecipesPage } from '../app/recipes/page';
import { IngredientsPage } from '../app/ingredients/page';
import { FavoritesPage } from '../app/favorites/page';

function Shell() {
  const { route } = useApp();
  const pages: Record<string, React.ReactElement> = {
    home: <HomePage />,
    recipes: <RecipesPage />,
    ingredients: <IngredientsPage />,
    favorites: <FavoritesPage />,
  };
  return <div data-theme="light"><NavBar />{pages[route] ?? <HomePage />}</div>;
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
