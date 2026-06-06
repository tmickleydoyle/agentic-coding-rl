'use client'
import React, { createContext, useContext } from 'react';
import { Recipe, PlanEntry, ShoppingItem, Route } from '../lib/types';

interface AppState {
  route: Route; recipes: Recipe[]; plan: PlanEntry[]; shoppingItems: ShoppingItem[];
  navigate: (r: Route) => void;
  addRecipe: (name: string, ingredients: string[], servings: number, prepMinutes: number, tags: string[]) => boolean;
  deleteRecipe: (id: string) => void;
  setPlanEntry: (day: PlanEntry['day'], mealType: PlanEntry['mealType'], recipeId: string) => void;
  removePlanEntry: (id: string) => void;
  addCustomShoppingItem: (name: string) => void;
  toggleShoppingItem: (id: string) => void;
}

const AppContext = createContext<AppState>({
  route: 'home', recipes: [], plan: [], shoppingItems: [],
  navigate: () => {}, addRecipe: () => false, deleteRecipe: () => {},
  setPlanEntry: () => {}, removePlanEntry: () => {},
  addCustomShoppingItem: () => {}, toggleShoppingItem: () => {},
});

export function useApp() { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppContext.Provider value={{
      route: 'home', recipes: [], plan: [], shoppingItems: [],
      navigate: () => {}, addRecipe: () => false, deleteRecipe: () => {},
      setPlanEntry: () => {}, removePlanEntry: () => {},
      addCustomShoppingItem: () => {}, toggleShoppingItem: () => {},
    }}>
      {children}
    </AppContext.Provider>
  );
}
