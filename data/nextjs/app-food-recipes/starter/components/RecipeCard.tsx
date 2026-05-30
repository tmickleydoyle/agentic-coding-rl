'use client'
import type { Recipe } from '../lib/types'

export default function RecipeCard(_props: {
  recipe: Recipe
  onView: (id: string) => void
  onToggleFavorite: (id: string) => void
}) {
  // TODO: render the recipe row (title, cuisine, view + favorite buttons, data-favorite).
  return <li data-testid={`recipe-${_props.recipe.id}`} />
}
