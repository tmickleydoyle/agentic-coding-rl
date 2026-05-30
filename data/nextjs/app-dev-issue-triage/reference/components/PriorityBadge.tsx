'use client'
import type { Priority } from '../lib/types'

export default function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span data-testid="badge" data-priority={priority}>
      {priority}
    </span>
  )
}
