'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_RECIPES: Recipe[] = [
  {
    id: 'r1',
    title: 'Margherita Pizza',
    cuisine: 'Italian',
    minutes: 30,
    ingredients: ['dough', 'tomato', 'mozzarella', 'basil'],
    steps: ['stretch dough', 'add toppings', 'bake'],
    favorite: false,
  },
  {
    id: 'r2',
    title: 'Chicken Tacos',
    cuisine: 'Mexican',
    minutes: 25,
    ingredients: ['chicken', 'tortillas', 'salsa'],
    steps: ['cook chicken', 'warm tortillas', 'assemble'],
    favorite: true,
  },
  {
    id: 'r3',
    title: 'Pad Thai',
    cuisine: 'Thai',
    minutes: 40,
    ingredients: ['noodles', 'shrimp', 'peanuts', 'lime'],
    steps: ['soak noodles', 'stir fry', 'garnish'],
    favorite: false,
  },
  {
    id: 'r4',
    title: 'Spaghetti Carbonara',
    cuisine: 'Italian',
    minutes: 20,
    ingredients: ['spaghetti', 'egg', 'pancetta', 'pecorino'],
    steps: ['boil pasta', 'fry pancetta', 'toss with egg'],
    favorite: false,
  },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>(SEED_RECIPES)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('recipes')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [cuisineFilter, setCuisineFilter] = useState<CuisineFilter>('all')
  const [query, setQuery] = useState('')
  const [nextId, setNextId] = useState(5)

  const value = useMemo<RecipesApi>(() => {
    const addRecipe = (input: NewRecipeInput) => {
      const id = `r${nextId}`
      setNextId((n) => n + 1)
      setRecipes((prev) => [
        ...prev,
        {
          id,
          title: input.title,
          cuisine: input.cuisine,
          minutes: input.minutes,
          ingredients: input.ingredients,
          steps: input.steps,
          favorite: false,
        },
      ])
    }

    const toggleFavorite = (id: string) => {
      setRecipes((prev) =>
        prev.map((r) => (r.id === id ? { ...r, favorite: !r.favorite } : r)),
      )
    }

    const selectRecipe = (id: string) => {
      setSelectedId(id)
      setRoute('recipe-detail')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      recipes,
      theme,
      route,
      selectedId,
      cuisineFilter,
      query,
      addRecipe,
      toggleFavorite,
      selectRecipe,
      setCuisineFilter,
      setQuery,
      setTheme,
      navigate,
    }
  }, [recipes, theme, route, selectedId, cuisineFilter, query, nextId])

  return <RecipesContext.Provider value={value}>{children}</RecipesContext.Provider>
}

export function useRecipes(): RecipesApi {
  const v = useContext(RecipesContext)
  if (!v) throw new Error('useRecipes must be used within an AppStateProvider')
  return v
}
