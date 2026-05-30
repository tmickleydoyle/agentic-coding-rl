'use client'
import type { Drink } from '../lib/types'

export default function DrinkRow({
  drink,
  onRemove,
}: {
  drink: Drink
  onRemove: (id: string) => void
}) {
  // TODO: render the amount and a remove-<id> button.
  void onRemove
  return <li data-testid={`drink-${drink.id}`} />
}
