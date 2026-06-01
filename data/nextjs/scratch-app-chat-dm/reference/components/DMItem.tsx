'use client'
import type { DM } from '../lib/types'

export default function DMItem({
  dm,
  authorHandle,
}: {
  dm: DM
  authorHandle: string
}) {
  return (
    <li data-testid={`dm-${dm.id}`}>
      <span data-testid={`dm-${dm.id}-author`}>{authorHandle}</span>
      <span data-testid={`dm-${dm.id}-text`}>{dm.text}</span>
    </li>
  )
}
