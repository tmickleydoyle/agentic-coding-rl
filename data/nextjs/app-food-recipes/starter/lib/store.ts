import type { Recipe } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `recipes` and an id counter; seed them; provide __reset() to
// re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listRecipes(_filter?: {
  cuisine?: string | null
  favorite?: string | null
}): Recipe[] {
  // TODO: return recipes, applying optional cuisine + favorite filters
  return []
}

export function createRecipe(_input: {
  title: string
  cuisine?: string
  minutes?: number
  ingredients?: string[]
  steps?: string[]
}): Recipe {
  // TODO: append a new recipe with a fresh id and return it
  return {
    id: '',
    title: '',
    cuisine: '',
    minutes: 0,
    ingredients: [],
    steps: [],
    favorite: false,
  }
}

export function findRecipe(_id: string): Recipe | undefined {
  // TODO: look up a recipe by id
  return undefined
}

export function updateRecipe(
  _id: string,
  _patch: { favorite?: boolean; title?: string; cuisine?: string },
): Recipe | undefined {
  // TODO: apply the patch (toggle favorite when none given) and return the recipe
  return undefined
}

export function deleteRecipe(_id: string): boolean {
  // TODO: remove the recipe; return whether it existed
  return false
}
