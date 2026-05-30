'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { CuisineFilter, Recipe, Route, Theme } from '../lib/types'

type NewRecipeInput = {
  title: string
  cuisine: string
  minutes: number
  ingredients: string[]
  steps: string[]
}

type RecipesApi = {
  recipes: Recipe[]
  theme: Theme
  route: Route
  selectedId: string | null
  cuisineFilter: CuisineFilter
  query: string
  addRecipe: (input: NewRecipeInput) => void
  toggleFavorite: (id: string) => void
  selectRecipe: (id: string) => void
  setCuisineFilter: (filter: CuisineFilter) => void
  setQuery: (q: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const RecipesContext = createContext<RecipesApi | null>(null)

const STUB: RecipesApi = {
  recipes: [],
  theme: 'light',
  route: 'recipes',
  selectedId: null,
  cuisineFilter: 'all',
  query: '',
  addRecipe: () => {},
  toggleFavorite: () => {},
  selectRecipe: () => {},
  setCuisineFilter: () => {},
  setQuery: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold recipes/theme/route/selectedId/cuisineFilter/query in state (seed 4 recipes),
  // implement the actions, and provide them through RecipesContext. The STUB below makes the
  // app mount but does nothing — replace it with real state + actions.
  return <RecipesContext.Provider value={STUB}>{children}</RecipesContext.Provider>
}

export function useRecipes(): RecipesApi {
  const v = useContext(RecipesContext)
  if (!v) throw new Error('useRecipes must be used within an AppStateProvider')
  return v
}
