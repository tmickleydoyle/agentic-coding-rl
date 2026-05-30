'use client'
import type { Subscription } from '../lib/types'

export default function SubItem({
  sub,
  onCancel,
}: {
  sub: Subscription
  onCancel: (id: string) => void
}) {
  // TODO: render <li data-testid="sub-<id>" data-active> with name, cycle, cost, monthly
  // (normalized), renewal, and a cancel-<id> button (active) or sub-<id>-cancelled marker.
  void onCancel
  return <li data-testid={`sub-${sub.id}`} />
}
