'use client';
import React, { createContext, useContext } from 'react';
import type { Recipe, Route } from '../lib/types';

interface AppState {
  route: Route;
  recipes: Recipe[];
  navigate: (r: Route) => void;
  addRecipe: (data: Omit<Recipe, 'id'>) => void;
  toggleFavorite: (id: string) => void;
}

const AppContext = createContext<AppState>({ route: 'home', recipes: [], navigate: () => {}, addRecipe: () => {}, toggleFavorite: () => {} });
export function useApp() { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return <AppContext.Provider value={{ route: 'home', recipes: [], navigate: () => {}, addRecipe: () => {}, toggleFavorite: () => {} }}>{children}</AppContext.Provider>;
}
