'use client'
import type { Canned } from '../lib/types'

export default function CannedRow({
  canned,
  disabled,
  onUse,
}: {
  canned: Canned
  disabled: boolean
  onUse: (text: string) => void
}) {
  // TODO: render the canned row with label and a use- button (disabled when no chat).
  void disabled
  void onUse
  return <li data-testid={`canned-${canned.id}`} />
}
