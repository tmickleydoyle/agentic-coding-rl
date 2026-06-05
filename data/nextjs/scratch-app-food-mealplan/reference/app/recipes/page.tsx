'use client'
import { usePlan } from '../../components/AppStateProvider'

export default function RecipesPage() {
  const { recipes } = usePlan()
  return (
    <section data-testid="page-recipes">
      <h1>Recipes</h1>
      <ul data-testid="recipe-list">
        {recipes.map((r) => (
          <li key={r.id} data-testid={`recipe-${r.id}`}>
            <span data-testid={`recipe-${r.id}-title`}>{r.title}</span>
            <span data-testid={`ingredient-count-${r.id}`}>{r.ingredients.length}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
