'use client'
import React, { createContext, useContext, useState } from 'react'
import { Recipe, Ingredient, Route } from '../lib/types'

interface AppState {
  route: Route
  recipes: Recipe[]
  ingredients: Ingredient[]
  navigate: (r: Route) => void
  setRecipes: (r: Recipe[]) => void
  setIngredients: (i: Ingredient[]) => void
}

const AppContext = createContext<AppState>({
  route: 'home',
  recipes: [],
  ingredients: [],
  navigate: () => {},
  setRecipes: () => {},
  setIngredients: () => {},
})

export function useApp() {
  return useContext(AppContext)
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home')
  const [recipes, setRecipes] = useState<Recipe[]>([
    { id: 'r1', name: 'Pasta Carbonara', description: 'Classic Italian pasta', ingredients: ['pasta', 'eggs', 'bacon'], favorite: true, createdAt: '2026-01-01T00:00:00Z' },
    { id: 'r2', name: 'Caesar Salad', description: 'Crispy romaine salad', ingredients: ['romaine', 'croutons', 'dressing'], favorite: false, createdAt: '2026-01-02T00:00:00Z' },
    { id: 'r3', name: 'Avocado Toast', description: 'Simple breakfast', ingredients: ['bread', 'avocado'], favorite: true, createdAt: '2026-01-03T00:00:00Z' },
  ])
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: 'i1', name: 'pasta', quantity: '500g' },
    { id: 'i2', name: 'eggs', quantity: '6' },
  ])

  return (
    <AppContext.Provider value={{ route, recipes, ingredients, navigate: setRoute, setRecipes, setIngredients }}>
      {children}
    </AppContext.Provider>
  )
}
