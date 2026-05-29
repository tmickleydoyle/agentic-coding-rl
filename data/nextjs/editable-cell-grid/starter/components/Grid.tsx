'use client'
import { useState } from 'react'
import type { Coord } from './types'
import { sameCoord } from './types'
import Cell from './Cell'

// TODO: track grid values and which single cell (if any) is editing. Render
// <table data-testid="grid"> with a <tr> per row and a <td data-testid="cell-<row>-<col>">
// wrapping a Cell. Double-click starts editing that cell (stopping any other). Commit updates
// the value and exits edit mode; cancel exits without changing. At most one input at a time.
export default function Grid({ initial }: { initial: string[][] }) {
  const [values, setValues] = useState<string[][]>(() => initial.map((r) => [...r]))
  const [editing, setEditing] = useState<Coord | null>(null)
  return <table data-testid="grid" />
}
