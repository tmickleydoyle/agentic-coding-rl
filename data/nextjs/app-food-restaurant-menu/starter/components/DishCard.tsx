'use client'
import type { Dish } from '../lib/types'

export default function DishCard(_props: {
  dish: Dish
  onView: (id: string) => void
  onAdd: (id: string) => void
}) {
  // TODO: render the dish row (name, price, view + add buttons, data-veg).
  return <li data-testid={`dish-${_props.dish.id}`} />
}
