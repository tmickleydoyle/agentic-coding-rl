'use client'
import type { Cells } from '../lib/engine'
import { ALL_IDS } from '../lib/engine'
import { useSheet } from '../hooks/useSheet'
import Cell from './Cell'

// TODO: render <div data-testid="grid"> with a <Cell> for every id A1..C3, wiring onChange to setCell.
export default function Spreadsheet({ initial = {} }: { initial?: Cells }) {
  const { raw, computed, setCell } = useSheet(initial)
  return <div data-testid="grid" />
}
