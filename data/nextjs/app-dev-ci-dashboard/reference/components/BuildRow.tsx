'use client'
import type { Build } from '../lib/types'

export default function BuildRow({
  build,
  onRetry,
}: {
  build: Build
  onRetry: (id: string) => void
}) {
  return (
    <li data-testid={`build-${build.id}`} data-status={build.status}>
      <span data-testid={`build-${build.id}-number`}>{build.number}</span>
      <span data-testid={`build-${build.id}-status`}>{build.status}</span>
      <button data-testid={`retry-${build.id}`} onClick={() => onRetry(build.id)}>
        Retry
      </button>
    </li>
  )
}
