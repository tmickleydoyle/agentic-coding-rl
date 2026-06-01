export type Recipe = {
  id: string
  title: string
  cuisine: string
  minutes: number
  ingredients: string[]
  steps: string[]
  favorite: boolean
}

export type CuisineFilter = 'all' | string

export type Route = 'recipes' | 'recipe-detail' | 'add' | 'favorites'
export type Theme = 'light' | 'dark'
