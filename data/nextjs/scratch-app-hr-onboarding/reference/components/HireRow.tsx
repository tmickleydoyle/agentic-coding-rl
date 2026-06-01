'use client'
import type { Hire } from '../lib/types'

export default function HireRow({
  hire,
  percent,
  onOpen,
}: {
  hire: Hire
  percent: number
  onOpen: (id: string) => void
}) {
  return (
    <li data-testid={`hire-${hire.id}`}>
      <span data-testid={`hire-${hire.id}-name`}>{hire.name}</span>
      <span data-testid={`hire-${hire.id}-role`}>{hire.role}</span>
      <span data-testid={`hire-${hire.id}-percent`}>{percent}</span>
      <button data-testid={`open-${hire.id}`} onClick={() => onOpen(hire.id)}>
        Open
      </button>
    </li>
  )
}
