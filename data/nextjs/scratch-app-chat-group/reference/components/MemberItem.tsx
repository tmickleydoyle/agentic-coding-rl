'use client'
import type { Person } from '../lib/types'

export default function MemberItem({
  person,
  isAdmin,
  onRemove,
}: {
  person: Person
  isAdmin: boolean
  onRemove: (id: string) => void
}) {
  return (
    <li data-testid={`member-${person.id}`}>
      <span data-testid={`member-${person.id}-name`}>{person.name}</span>
      {isAdmin ? null : (
        <button data-testid={`remove-${person.id}`} onClick={() => onRemove(person.id)}>
          Remove
        </button>
      )}
    </li>
  )
}
