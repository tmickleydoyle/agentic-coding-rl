'use client'
import type { Person } from '../lib/types'

export default function PersonRow({ person }: { person: Person }) {
  return (
    <li data-testid={`person-${person.id}`}>
      <span data-testid={`person-${person.id}-name`}>{person.name}</span>
      <span data-testid={`person-${person.id}-handle`}>{person.handle}</span>
    </li>
  )
}
