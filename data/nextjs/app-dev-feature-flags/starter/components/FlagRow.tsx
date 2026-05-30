'use client'
import type { Flag } from '../lib/types'

export default function FlagRow({
  flag,
  onView,
}: {
  flag: Flag
  onView: (id: string) => void
}) {
  // TODO: render key, rollout, enabled-env count, and a view-<id> button
  void onView
  return <li data-testid={`flag-${flag.id}`} />
}
