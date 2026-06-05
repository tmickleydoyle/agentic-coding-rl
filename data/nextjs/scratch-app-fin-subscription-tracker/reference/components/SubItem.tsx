'use client'
import { monthlyCost } from '../hooks/useSubs'
import type { Subscription } from '../lib/types'

export default function SubItem({
  sub,
  onCancel,
}: {
  sub: Subscription
  onCancel: (id: string) => void
}) {
  return (
    <li data-testid={`sub-${sub.id}`} data-active={sub.active ? 'true' : 'false'}>
      <span data-testid={`sub-${sub.id}-name`}>{sub.name}</span>
      <span data-testid={`sub-${sub.id}-cycle`}>{sub.cycle}</span>
      <span data-testid={`sub-${sub.id}-cost`}>{sub.cost}</span>
      <span data-testid={`sub-${sub.id}-monthly`}>{monthlyCost(sub)}</span>
      <span data-testid={`sub-${sub.id}-renewal`}>{sub.nextRenewal}</span>
      {sub.active ? (
        <button data-testid={`cancel-${sub.id}`} onClick={() => onCancel(sub.id)}>
          Cancel
        </button>
      ) : (
        <span data-testid={`sub-${sub.id}-cancelled`}>Cancelled</span>
      )}
    </li>
  )
}
