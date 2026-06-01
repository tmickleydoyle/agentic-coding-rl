'use client'
import type { Klass } from '../lib/types'

export default function ClassCard({
  klass,
  enrolled,
  onOpen,
}: {
  klass: Klass
  enrolled: number
  onOpen: (id: string) => void
}) {
  const full = enrolled >= klass.capacity
  return (
    <li data-testid={`class-${klass.id}`} data-full={full ? 'true' : 'false'}>
      <span data-testid={`class-${klass.id}-name`}>{klass.name}</span>
      <span data-testid={`class-${klass.id}-capacity`}>{klass.capacity}</span>
      <span data-testid={`class-${klass.id}-enrolled`}>{enrolled}</span>
      <span data-testid={`class-${klass.id}-full`} data-full={full ? 'true' : 'false'}>
        {full ? 'Full' : 'Open'}
      </span>
      <button data-testid={`open-${klass.id}`} onClick={() => onOpen(klass.id)}>
        Open
      </button>
    </li>
  )
}
