'use client'
import { useRecipes } from '../../components/AppStateProvider'

export default function RecipeDetailPage() {
  const { recipes, selectedId, toggleFavorite } = useRecipes()
  const recipe = recipes.find((r) => r.id === selectedId)

  return (
    <section data-testid="page-recipe-detail">
      <h1>Recipe</h1>
      {!recipe ? (
        <p data-testid="no-selection">No recipe selected.</p>
      ) : (
        <div data-testid="recipe-detail" data-favorite={recipe.favorite ? 'true' : 'false'}>
          <h2 data-testid="detail-title">{recipe.title}</h2>
          <p data-testid="detail-cuisine">{recipe.cuisine}</p>
          <p data-testid="detail-minutes">{recipe.minutes}</p>
          <ul data-testid="ingredient-list">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} data-testid={`ingredient-${i}`}>
                {ing}
              </li>
            ))}
          </ul>
          <ol data-testid="step-list">
            {recipe.steps.map((s, i) => (
              <li key={i} data-testid={`step-${i}`}>
                {s}
              </li>
            ))}
          </ol>
          <button
            data-testid="detail-fav-toggle"
            onClick={() => toggleFavorite(recipe.id)}
          >
            {recipe.favorite ? 'Unfavorite' : 'Favorite'}
          </button>
        </div>
      )}
    </section>
  )
}
