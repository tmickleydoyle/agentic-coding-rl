'use client'
import React from 'react';
import { AppStateProvider, useApp } from '../components/AppStateProvider';
import { NavBar } from '../components/NavBar';
import { HomePage } from './home/page';
import { RecipesPage } from './recipes/page';
import { PlannerPage } from './planner/page';
import { ShoppingPage } from './shopping/page';

function Shell() {
  const { route } = useApp();
  const pages: Record<string, React.ReactElement> = {
    home: <HomePage />,
    recipes: <RecipesPage />,
    planner: <PlannerPage />,
    shopping: <ShoppingPage />,
  };
  return (
    <div data-testid="app" data-theme="light">
      <NavBar />
      {pages[route] ?? <HomePage />}
    </div>
  );
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>;
}
