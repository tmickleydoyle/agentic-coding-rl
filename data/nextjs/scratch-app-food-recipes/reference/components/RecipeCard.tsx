'use client'
import type { Recipe } from '../lib/types'

export default function RecipeCard({
  recipe,
  onView,
  onToggleFavorite,
}: {
  recipe: Recipe
  onView: (id: string) => void
  onToggleFavorite: (id: string) => void
}) {
  return (
    <li
      data-testid={`recipe-${recipe.id}`}
      data-favorite={recipe.favorite ? 'true' : 'false'}
    >
      <span data-testid={`recipe-${recipe.id}-title`}>{recipe.title}</span>
      <span data-testid={`recipe-${recipe.id}-cuisine`}>{recipe.cuisine}</span>
      <button data-testid={`view-${recipe.id}`} onClick={() => onView(recipe.id)}>
        View
      </button>
      <button
        data-testid={`fav-${recipe.id}`}
        onClick={() => onToggleFavorite(recipe.id)}
      >
        {recipe.favorite ? 'Unfavorite' : 'Favorite'}
      </button>
    </li>
  )
}
