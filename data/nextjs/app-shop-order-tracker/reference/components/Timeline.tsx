'use client'
import type { Order } from '../lib/types'
import { TIMELINE } from '../lib/types'
import { reached } from '../hooks/useOrders'

export default function Timeline({ order }: { order: Order }) {
  return (
    <ol data-testid="timeline">
      {TIMELINE.map((step) => (
        <li
          key={step}
          data-testid={`step-${step}`}
          data-reached={reached(order, step) ? 'true' : 'false'}
        >
          {step}
        </li>
      ))}
    </ol>
  )
}
