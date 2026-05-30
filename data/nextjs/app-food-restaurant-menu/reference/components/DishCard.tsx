'use client'
import type { Dish } from '../lib/types'

export default function DishCard({
  dish,
  onView,
  onAdd,
}: {
  dish: Dish
  onView: (id: string) => void
  onAdd: (id: string) => void
}) {
  return (
    <li data-testid={`dish-${dish.id}`} data-veg={dish.vegetarian ? 'true' : 'false'}>
      <span data-testid={`dish-${dish.id}-name`}>{dish.name}</span>
      <span data-testid={`dish-${dish.id}-price`}>{dish.price}</span>
      <button data-testid={`view-${dish.id}`} onClick={() => onView(dish.id)}>
        View
      </button>
      <button data-testid={`add-${dish.id}`} onClick={() => onAdd(dish.id)}>
        Add
      </button>
    </li>
  )
}
