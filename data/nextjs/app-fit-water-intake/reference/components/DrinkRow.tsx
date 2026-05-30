'use client'
import type { Drink } from '../lib/types'

export default function DrinkRow({
  drink,
  onRemove,
}: {
  drink: Drink
  onRemove: (id: string) => void
}) {
  return (
    <li data-testid={`drink-${drink.id}`}>
      <span data-testid={`drink-${drink.id}-amount`}>{drink.amount}</span>
      <button data-testid={`remove-${drink.id}`} onClick={() => onRemove(drink.id)}>
        Delete
      </button>
    </li>
  )
}
