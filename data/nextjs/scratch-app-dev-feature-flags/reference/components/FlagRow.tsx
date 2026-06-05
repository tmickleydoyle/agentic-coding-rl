'use client'
import type { Flag } from '../lib/types'
import { enabledEnvCount } from '../hooks/useFlagStats'

export default function FlagRow({
  flag,
  onView,
}: {
  flag: Flag
  onView: (id: string) => void
}) {
  return (
    <li data-testid={`flag-${flag.id}`}>
      <span data-testid={`flag-${flag.id}-key`}>{flag.key}</span>
      <span data-testid={`flag-${flag.id}-rollout`}>{flag.rollout}</span>
      <span data-testid={`enabled-${flag.id}-count`}>{enabledEnvCount(flag)}</span>
      <button data-testid={`view-${flag.id}`} onClick={() => onView(flag.id)}>
        View
      </button>
    </li>
  )
}
