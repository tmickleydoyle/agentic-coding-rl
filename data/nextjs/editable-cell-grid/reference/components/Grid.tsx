'use client'
import { useState } from 'react'
import type { Coord } from './types'
import { sameCoord } from './types'
import Cell from './Cell'

export default function Grid({ initial }: { initial: string[][] }) {
  const [values, setValues] = useState<string[][]>(() => initial.map((r) => [...r]))
  const [editing, setEditing] = useState<Coord | null>(null)

  const commit = (row: number, col: number, next: string) => {
    setValues((prev) =>
      prev.map((r, ri) => (ri === row ? r.map((c, ci) => (ci === col ? next : c)) : r))
    )
    setEditing(null)
  }

  return (
    <table data-testid="grid">
      <tbody>
        {values.map((cols, row) => (
          <tr key={row}>
            {cols.map((value, col) => (
              <td key={col} data-testid={`cell-${row}-${col}`}>
                <Cell
                  value={value}
                  editing={sameCoord(editing, { row, col })}
                  onStartEdit={() => setEditing({ row, col })}
                  onCommit={(next) => commit(row, col, next)}
                  onCancel={() => setEditing(null)}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
