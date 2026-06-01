import type { Recipe } from './types'

// In-memory server store for the API routes. SEPARATE from the client AppStateProvider
// state — the API has its own seed data and lifecycle. Tests call __reset() in beforeEach.

let recipes: Recipe[] = []
let nextId = 1

function seed(): void {
  recipes = [
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
  nextId = 5
}

seed()

export function __reset(): void {
  seed()
}

export function listRecipes(filter?: {
  cuisine?: string | null
  favorite?: string | null
}): Recipe[] {
  let out = recipes.slice()
  const cuisine = filter?.cuisine
  if (cuisine) out = out.filter((r) => r.cuisine === cuisine)
  const favorite = filter?.favorite
  if (favorite === 'true') out = out.filter((r) => r.favorite)
  else if (favorite === 'false') out = out.filter((r) => !r.favorite)
  return out
}

export function createRecipe(input: {
  title: string
  cuisine?: string
  minutes?: number
  ingredients?: string[]
  steps?: string[]
}): Recipe {
  const recipe: Recipe = {
    id: `r${nextId++}`,
    title: input.title,
    cuisine: input.cuisine ?? 'Other',
    minutes: input.minutes ?? 0,
    ingredients: input.ingredients ?? [],
    steps: input.steps ?? [],
    favorite: false,
  }
  recipes.push(recipe)
  return recipe
}

export function findRecipe(id: string): Recipe | undefined {
  return recipes.find((r) => r.id === id)
}

export function updateRecipe(
  id: string,
  patch: { favorite?: boolean; title?: string; cuisine?: string },
): Recipe | undefined {
  const recipe = recipes.find((r) => r.id === id)
  if (!recipe) return undefined
  if (typeof patch.favorite === 'boolean') recipe.favorite = patch.favorite
  if (typeof patch.title === 'string') recipe.title = patch.title
  if (typeof patch.cuisine === 'string') recipe.cuisine = patch.cuisine
  return recipe
}

export function deleteRecipe(id: string): boolean {
  const idx = recipes.findIndex((r) => r.id === id)
  if (idx === -1) return false
  recipes.splice(idx, 1)
  return true
}
