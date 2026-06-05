'use client'
import type { Meal } from '../lib/types'

export default function MealItem({
  meal,
  onRemove,
}: {
  meal: Meal
  onRemove?: (id: string) => void
}) {
  return (
    <li data-testid={`meal-${meal.id}`}>
      <span data-testid={`meal-${meal.id}-name`}>{meal.name}</span>
      <span data-testid={`meal-${meal.id}-calories`}>{meal.calories}</span>
      <span data-testid={`meal-${meal.id}-protein`}>{meal.protein}</span>
      <span data-testid={`meal-${meal.id}-carbs`}>{meal.carbs}</span>
      <span data-testid={`meal-${meal.id}-fat`}>{meal.fat}</span>
      {onRemove ? (
        <button data-testid={`remove-${meal.id}`} onClick={() => onRemove(meal.id)}>
          Delete
        </button>
      ) : null}
    </li>
  )
}
