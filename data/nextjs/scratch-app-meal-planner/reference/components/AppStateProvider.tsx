'use client'
import React, { createContext, useContext, useState } from 'react';
import { Recipe, PlanEntry, ShoppingItem, Route } from '../lib/types';

interface AppState {
  route: Route;
  recipes: Recipe[];
  plan: PlanEntry[];
  shoppingItems: ShoppingItem[];
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
  const [route, setRoute] = useState<Route>('home');
  const [recipes, setRecipes] = useState<Recipe[]>([
    { id: 'rc1', name: 'Oatmeal', ingredients: ['oats', 'milk', 'honey'], servings: 1, prepMinutes: 5, tags: ['breakfast'] },
    { id: 'rc2', name: 'Pasta', ingredients: ['pasta', 'tomato sauce', 'cheese'], servings: 2, prepMinutes: 20, tags: ['dinner'] },
  ]);
  const [plan, setPlan] = useState<PlanEntry[]>([]);
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);
  const [nextRcId, setNextRcId] = useState(3);
  const [nextPlanId, setNextPlanId] = useState(1);
  const [nextShopId, setNextShopId] = useState(1);

  const navigate = (r: Route) => setRoute(r);

  const addRecipe = (name: string, ingredients: string[], servings: number, prepMinutes: number, tags: string[]): boolean => {
    if (!name.trim() || ingredients.length === 0) return false;
    setRecipes(prev => [...prev, { id: `rc${nextRcId}`, name: name.trim(), ingredients, servings, prepMinutes, tags }]);
    setNextRcId(n => n + 1);
    return true;
  };

  const deleteRecipe = (id: string) => {
    setRecipes(prev => prev.filter(r => r.id !== id));
    setPlan(prev => prev.filter(p => p.recipeId !== id));
  };

  const setPlanEntry = (day: PlanEntry['day'], mealType: PlanEntry['mealType'], recipeId: string) => {
    setPlan(prev => {
      const filtered = prev.filter(p => !(p.day === day && p.mealType === mealType));
      return [...filtered, { id: `plan${nextPlanId}`, day, mealType, recipeId }];
    });
    setNextPlanId(n => n + 1);
  };

  const removePlanEntry = (id: string) => setPlan(prev => prev.filter(p => p.id !== id));

  const addCustomShoppingItem = (name: string) => {
    if (!name.trim()) return;
    setShoppingItems(prev => [...prev, { id: `si${nextShopId}`, name: name.trim(), checked: false, custom: true }]);
    setNextShopId(n => n + 1);
  };

  const toggleShoppingItem = (id: string) => {
    setShoppingItems(prev => prev.map(s => s.id === id ? { ...s, checked: !s.checked } : s));
  };

  return (
    <AppContext.Provider value={{ route, recipes, plan, shoppingItems, navigate, addRecipe, deleteRecipe, setPlanEntry, removePlanEntry, addCustomShoppingItem, toggleShoppingItem }}>
      {children}
    </AppContext.Provider>
  );
}
