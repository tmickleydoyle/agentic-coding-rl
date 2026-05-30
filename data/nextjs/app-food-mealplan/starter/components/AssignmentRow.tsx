'use client'
import type { Assignment } from '../lib/types'

export default function AssignmentRow(_props: {
  assignment: Assignment
  recipeTitle: string
  onRemove: (id: string) => void
}) {
  // TODO: render the assignment row (recipe title + remove button).
  return <li data-testid={`assignment-${_props.assignment.id}`} />
}
