'use client'
import type { Cells } from '../lib/engine'
import { ALL_IDS } from '../lib/engine'
import { useSheet } from '../hooks/useSheet'
import Cell from './Cell'

export default function Spreadsheet({ initial = {} }: { initial?: Cells }) {
  const { raw, computed, setCell } = useSheet(initial)

  return (
    <div data-testid="grid">
      {ALL_IDS.map((id) => (
        <Cell
          key={id}
          id={id}
          raw={raw[id] ?? ''}
          value={computed[id]}
          onChange={(v) => setCell(id, v)}
        />
      ))}
    </div>
  )
}
