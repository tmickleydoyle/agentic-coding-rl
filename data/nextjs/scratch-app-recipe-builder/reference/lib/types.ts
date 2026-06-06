export interface Recipe {
  id: string
  name: string
  description: string
  ingredients: string[]
  favorite: boolean
  createdAt: string
}

export interface Ingredient {
  id: string
  name: string
  quantity: string
}

export type Route = 'home' | 'recipes' | 'ingredients' | 'favorites'
