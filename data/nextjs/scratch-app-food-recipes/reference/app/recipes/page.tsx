'use client'
import { useRecipes } from '../../components/AppStateProvider'
import { useRecipeViews } from '../../hooks/useRecipeViews'
import Filters from '../../components/Filters'
import RecipeCard from '../../components/RecipeCard'

export default function RecipesPage() {
  const {
    query,
    setQuery,
    cuisineFilter,
    setCuisineFilter,
    selectRecipe,
    toggleFavorite,
  } = useRecipes()
  const { cuisines, filtered } = useRecipeViews()

  return (
    <section data-testid="page-recipes">
      <h1>Recipes</h1>
      <input
        data-testid="search-input"
        placeholder="Search recipes"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Filters
        cuisines={cuisines}
        cuisineFilter={cuisineFilter}
        onCuisineChange={setCuisineFilter}
      />
      {filtered.length === 0 ? (
        <p data-testid="empty-state">No recipes match.</p>
      ) : (
        <ul data-testid="recipe-list">
          {filtered.map((r) => (
            <RecipeCard
              key={r.id}
              recipe={r}
              onView={selectRecipe}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
