'use client'
import type { Person } from '../lib/types'

export default function PersonRow({ person }: { person: Person }) {
  // TODO: render the person row with name.
  return <li data-testid={`person-${person.id}`} />
}
