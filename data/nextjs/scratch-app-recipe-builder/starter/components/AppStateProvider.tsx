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
  route: 'home', recipes: [], ingredients: [],
  navigate: () => {}, setRecipes: () => {}, setIngredients: () => {},
})

export function useApp() { return useContext(AppContext) }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route] = useState<Route>('home')
  const [recipes] = useState<Recipe[]>([])
  const [ingredients] = useState<Ingredient[]>([])
  return (
    <AppContext.Provider value={{ route, recipes, ingredients, navigate: () => {}, setRecipes: () => {}, setIngredients: () => {} }}>
      {children}
    </AppContext.Provider>
  )
}
