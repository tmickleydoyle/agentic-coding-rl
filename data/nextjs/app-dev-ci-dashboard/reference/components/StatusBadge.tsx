'use client'
import type { BuildStatus } from '../lib/types'

export default function StatusBadge({ status }: { status: BuildStatus }) {
  return (
    <span data-testid="badge" data-status={status}>
      {status}
    </span>
  )
}
