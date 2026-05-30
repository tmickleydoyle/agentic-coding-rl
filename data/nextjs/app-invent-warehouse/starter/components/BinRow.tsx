'use client'
import type { Bin } from '../lib/types'

export default function BinRow(_props: { bin: Bin; onView: (id: string) => void }) {
  // TODO: render code, used, capacity, free, usage, and a view-<id> button; data-full on
  // the <li>.
  return <li data-testid={`bin-${_props.bin.id}`} data-full="false" />
}
