'use client'
import type { Meal } from '../lib/types'

export default function MealItem(_props: { meal: Meal; onRemove?: (id: string) => void }) {
  // TODO: render meal-<id> with name/calories/macros and an optional remove-<id> button
  return <li data-testid={`meal-${_props.meal.id}`} />
}
