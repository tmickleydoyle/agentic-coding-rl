import { useMemo, useState } from 'react'
import type { CellId, Cells } from '../lib/engine'
import { computeAll } from '../lib/engine'

export function useSheet(initial: Cells) {
  const [raw, setRaw] = useState<Cells>(initial)

  const computed = useMemo(() => computeAll(raw), [raw])

  const setCell = (id: CellId, value: string) => {
    setRaw((prev) => ({ ...prev, [id]: value }))
  }

  return { raw, computed, setCell }
}
