import { useState } from 'react'
import type { CellId, Cells } from '../lib/engine'

// TODO: return { raw, computed, setCell }. computed = computeAll(raw). setCell updates one raw cell.
export function useSheet(initial: Cells) {
  const [raw, setRaw] = useState<Cells>(initial)
  return {
    raw,
    computed: {} as Record<CellId, number | null>,
    setCell: (_id: CellId, _value: string) => {},
  }
}
