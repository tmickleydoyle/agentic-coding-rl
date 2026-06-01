'use client'
import type { Bin } from '../lib/types'
import { freeSpace, isFull, usagePct, used } from '../lib/types'

export default function BinRow({
  bin,
  onView,
}: {
  bin: Bin
  onView: (id: string) => void
}) {
  return (
    <li data-testid={`bin-${bin.id}`} data-full={isFull(bin) ? 'true' : 'false'}>
      <span data-testid={`bin-${bin.id}-code`}>{bin.code}</span>
      <span data-testid={`bin-${bin.id}-used`}>{used(bin)}</span>
      <span data-testid={`bin-${bin.id}-capacity`}>{bin.capacity}</span>
      <span data-testid={`bin-${bin.id}-free`}>{freeSpace(bin)}</span>
      <span data-testid={`bin-${bin.id}-usage`}>{usagePct(bin)}</span>
      <button data-testid={`view-${bin.id}`} onClick={() => onView(bin.id)}>
        View
      </button>
    </li>
  )
}
