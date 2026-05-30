'use client'
import type { Priority } from '../lib/types'

export default function PriorityBadge({ priority }: { priority: Priority }) {
  // TODO: render <span data-testid="badge" data-priority={priority}>
  void priority
  return <span data-testid="badge" />
}
