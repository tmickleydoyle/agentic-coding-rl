'use client'
import type { Assignment } from '../lib/types'

export default function AssignmentRow({
  assignment,
  recipeTitle,
  onRemove,
}: {
  assignment: Assignment
  recipeTitle: string
  onRemove: (id: string) => void
}) {
  return (
    <li data-testid={`assignment-${assignment.id}`}>
      <span data-testid={`assignment-${assignment.id}-title`}>{recipeTitle}</span>
      <button data-testid={`remove-${assignment.id}`} onClick={() => onRemove(assignment.id)}>
        Remove
      </button>
    </li>
  )
}
