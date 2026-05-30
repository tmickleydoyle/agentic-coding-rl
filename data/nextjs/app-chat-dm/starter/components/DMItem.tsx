'use client'
import type { DM } from '../lib/types'

export default function DMItem({
  dm,
  authorHandle,
}: {
  dm: DM
  authorHandle: string
}) {
  // TODO: render the DM row with author handle and text.
  void authorHandle
  return <li data-testid={`dm-${dm.id}`} />
}
